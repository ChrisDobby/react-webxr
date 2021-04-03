import * as React from "react";
import useAugmentedReality, { UnsupportedReason } from "../useAugmentedReality";
import { StartComponentProps, StandardProps, StandardAugmentedRealityProps, UnsupportedReasonProps } from "./propTypes";
import { GltfImage, XRSessionOptions } from "../types";
import { Gltf2Node } from "../immersive-web/render/nodes/gltf2";
import { Node } from "../immersive-web/render/core/node";
import { startSession, endSession, enableStats, addImage, removeImage } from "../augmentedRealitySession";

const overlayElementId = "react-webxr-dom-overlay";
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
            default:
                return "";
        }
    };

    return <div {...otherProps}>{getMessage()}</div>;
};

const StartStopButton = ({ onStartSelected }: StartComponentProps) => (
    <button
        type="button"
        style={{ backgroundColor: "transparent", outline: 0, border: "none" }}
        onClick={onStartSelected}
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path d="M608 64H32C14.33 64 0 78.33 0 96v320c0 17.67 14.33 32 32 32h160.22c25.19 0 48.03-14.77 58.36-37.74l27.74-61.64C286.21 331.08 302.35 320 320 320s33.79 11.08 41.68 28.62l27.74 61.64C399.75 433.23 422.6 448 447.78 448H608c17.67 0 32-14.33 32-32V96c0-17.67-14.33-32-32-32zM160 304c-35.35 0-64-28.65-64-64s28.65-64 64-64 64 28.65 64 64-28.65 64-64 64zm320 0c-35.35 0-64-28.65-64-64s28.65-64 64-64 64 28.65 64 64-28.65 64-64 64z" />
        </svg>
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
    node: Node | Gltf2Node;
};

const AugmentedReality = (props: AugmentedRealityProps) => {
    const [session, setSession] = React.useState<XRSession | null>(null);
    const { support } = useAugmentedReality();
    const {
        startStopComponent,
        unsupportedComponent,
        showStats = true,
        images,
        onHitTest,
        onSelect,
        options,
        children,
        ...otherProps
    } = props;

    const imagesInView = React.useRef<SceneImage[]>([]);

    React.useEffect(() => {
        if (session) {
            enableStats(showStats);
        }
    }, [showStats, session]);

    React.useEffect(() => {
        const updateImages = (imagesToUpdate?: GltfImage[]) => {
            const toRemove = imagesInView.current.filter(
                ({ key }) => !imagesToUpdate?.find(image => image.key === key),
            );
            const toAdd = imagesToUpdate?.filter(({ key }) => !imagesInView.current.find(image => image.key === key));

            toRemove.forEach(image => removeImage(image.node));
            toAdd?.forEach(image => {
                const { src, matrix } = image;
                const newImage = new Gltf2Node({ url: src });
                const node = addImage(newImage, image.includeShadow);
                if (!node) return;
                if (matrix) {
                    node.matrix = matrix;
                }

                imagesInView.current.push({ node, key: image.key });
            });
        };
        if (session) {
            updateImages(images);
        }
    }, [images, session]);

    React.useEffect(() => {
        if (onSelect) {
            session?.addEventListener("select", onSelect);
        }
        return () => session?.removeEventListener("select", onSelect);
    }, [onSelect, session]);

    if (!support.isSupported) {
        const Unsupported = unsupportedComponent || UnsupportedMessage;
        return <Unsupported {...otherProps} reason={support.unsupportedReason as UnsupportedReason} />;
    }

    const addDomOverlayOptions = (sessionOptions?: XRSessionOptions) => {
        if (!children) return options;
        return { ...sessionOptions, domOverlayOptions: { rootElementId: overlayElementId } };
    };

    const addHitTestOptions = (sessionOptions?: XRSessionOptions) => {
        if (!onHitTest) return sessionOptions;
        return {
            hitTestOptions: sessionOptions?.hitTestOptions
                ? { ...sessionOptions?.hitTestOptions, onHitTest }
                : undefined,
        };
    };

    const onStartSelected = async () => {
        const allOptions = addDomOverlayOptions(addHitTestOptions(options));
        setSession(await startSession({ ...allOptions }));
    };

    const onStopSelected = () => {
        endSession();
    };

    const StartStop = startStopComponent || StartStopButton;
    return (
        <div {...otherProps}>
            <StartStop onStartSelected={onStartSelected} onStopSelected={onStopSelected} sessionInProgress={false} />
            {children && (
                <div style={{ display: "none" }}>
                    <div id={overlayElementId}>{children}</div>
                </div>
            )}
        </div>
    );
};

export default AugmentedReality;
