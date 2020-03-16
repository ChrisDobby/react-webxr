import * as React from "react";
import { UnsupportedReason } from "../useAugmentedReality";
import { StartComponentProps, StandardProps, StandardAugmentedRealityProps, UnsupportedReasonProps } from "./propTypes";
import { GltfImage, XRSessionOptions } from "../types";
import { Gltf2Node } from "../immersive-web/render/nodes/gltf2";
import { useAugmentedReality } from "..";
import { startSession, endSession, enableStats, addImage, removeImage } from "../augmentedRealitySession";

type UnsupportedMessageProps = StandardProps & UnsupportedReasonProps;

const UnsupportedMessage = (props: UnsupportedMessageProps) => {
    const { reason, ...otherProps } = props;

    const getMessage = () => {
        switch (reason) {
            case UnsupportedReason.NotInitialised:
                return "Initialising augmented reality";
            case UnsupportedReason.InsecureConnection:
                return "Augmented reality is not available on an insecure connection";
            case UnsupportedReason.NotSupportedInBrowser:
                return "Augmented reality is not supported in this browser";
        }
    };

    return <div {...otherProps}>{getMessage()}</div>;
};

const StartStopButton = ({ onStartSelected }: StartComponentProps) => (
    <button style={{ backgroundColor: "transparent", outline: 0, border: "none" }} onClick={onStartSelected}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path d="M608 64H32C14.33 64 0 78.33 0 96v320c0 17.67 14.33 32 32 32h160.22c25.19 0 48.03-14.77 58.36-37.74l27.74-61.64C286.21 331.08 302.35 320 320 320s33.79 11.08 41.68 28.62l27.74 61.64C399.75 433.23 422.6 448 447.78 448H608c17.67 0 32-14.33 32-32V96c0-17.67-14.33-32-32-32zM160 304c-35.35 0-64-28.65-64-64s28.65-64 64-64 64 28.65 64 64-28.65 64-64 64zm320 0c-35.35 0-64-28.65-64-64s28.65-64 64-64 64 28.65 64 64-28.65 64-64 64z" />
        </svg>{" "}
        <span style={{ fontWeight: 700 }}>Start AR Session</span>
    </button>
);

type AugmentedRealityProps = StandardProps &
    StandardAugmentedRealityProps & {
        options?: XRSessionOptions;
        onSelect?: () => void;
        onHitTest?: (matrix: Float32Array | null) => void;
    };

type SceneImage = {
    key: string;
    node: Gltf2Node;
};

const AugmentedReality = (props: AugmentedRealityProps) => {
    const [session, setSession] = React.useState<XRSession>();
    const { support } = useAugmentedReality();
    const {
        startStopComponent,
        unsupportedComponent,
        showStats = true,
        images,
        onHitTest,
        onSelect,
        options,
        ...otherProps
    } = props;

    const imagesInView = React.useRef<SceneImage[]>([]);

    const updateImages = (images?: GltfImage[]) => {
        const toRemove = imagesInView.current.filter(({ key }) => !Boolean(images?.find(image => image.key === key)));
        const toAdd = images?.filter(({ key }) => !Boolean(imagesInView.current.find(image => image.key === key)));

        for (const image of toRemove) {
            removeImage(image.node);
        }

        for (const image of toAdd || []) {
            const { src, scale, matrix } = image;
            const newImage = new Gltf2Node({ url: src });
            if (scale) {
                newImage.scale = scale;
            }
            if (matrix) {
                newImage.matrix = matrix;
            }

            addImage(newImage);
            imagesInView.current.push({ key: image.key, node: newImage });
        }
    };

    React.useEffect(() => {
        if (session) {
            enableStats(showStats);
        }
    }, [showStats, support, session]);

    React.useEffect(() => {
        if (session) {
            updateImages(images);
        }
    }, [images, updateImages, session]);

    React.useEffect(() => {
        if (onSelect) {
            session?.addEventListener("select", onSelect);
        }
        return () => session?.removeEventListener("select", onSelect);
    });

    if (!support.isSupported) {
        const Unsupported = unsupportedComponent || UnsupportedMessage;
        return <Unsupported {...otherProps} reason={support.unsupportedReason as UnsupportedReason} />;
    }

    const onStartSelected = async () => {
        const allOptions = onHitTest
            ? {
                  ...options,
                  hitTestOptions: options?.hitTestOptions ? { ...options?.hitTestOptions, onHitTest } : undefined,
              }
            : options;
        setSession(await startSession({ ...allOptions }));
    };

    const onStopSelected = () => {
        endSession();
    };

    const StartStop = startStopComponent || StartStopButton;
    return (
        <div {...otherProps}>
            <StartStop onStartSelected={onStartSelected} onStopSelected={onStopSelected} sessionInProgress={false} />
        </div>
    );
};

export default AugmentedReality;
