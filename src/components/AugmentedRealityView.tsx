import * as React from "react";
import useAugmentedReality, { UnsupportedReason, GltfImage } from "../useAugmentedReality";

type StartComponentProps = {
    sessionInProgress: boolean;
    onStartSelected: () => void;
    onStopSelected: () => void;
};

type UnsupportedReasonProps = {
    reason: UnsupportedReason;
};

type StandardProps = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
};

type AugmentedRealityViewProps = StandardProps & {
    /**
     * Component to use to start/stop the session rather than the default button
     */
    startStopComponent?: (props: StartComponentProps) => JSX.Element;

    /**
     * Component to use to display messages when augmented reality is not supported rather than the default message
     */
    unsupportedComponent?: (props: UnsupportedReasonProps) => JSX.Element;

    /**
     * Indicates whether to show the stats box
     * @default true
     */
    showStats?: boolean;

    /**
     * Array of images in gltf format to be displayed in the view
     */
    images?: GltfImage[];
};

type UnsupportedMessageProps = StandardProps & UnsupportedReasonProps;

const StartStopButton = ({ onStartSelected }: StartComponentProps) => (
    <button style={{ backgroundColor: "transparent", outline: 0, border: "none" }} onClick={onStartSelected}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path d="M608 64H32C14.33 64 0 78.33 0 96v320c0 17.67 14.33 32 32 32h160.22c25.19 0 48.03-14.77 58.36-37.74l27.74-61.64C286.21 331.08 302.35 320 320 320s33.79 11.08 41.68 28.62l27.74 61.64C399.75 433.23 422.6 448 447.78 448H608c17.67 0 32-14.33 32-32V96c0-17.67-14.33-32-32-32zM160 304c-35.35 0-64-28.65-64-64s28.65-64 64-64 64 28.65 64 64-28.65 64-64 64zm320 0c-35.35 0-64-28.65-64-64s28.65-64 64-64 64 28.65 64 64-28.65 64-64 64z" />
        </svg>{" "}
        <span style={{ fontWeight: 700 }}>Start AR Session</span>
    </button>
);

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

/**
 * `AugmentedRealityView` will offer the user the opportunity to start a fully immersive augmented reality session when available in the browser
 */
const AugmentedRealityView = (props: AugmentedRealityViewProps) => {
    const { startStopComponent, unsupportedComponent, images, showStats = true, ...otherProps } = props;
    const {
        support: { isSupported, unsupportedReason },
        startSession,
        endSession,
        viewStats,
        showImages,
    } = useAugmentedReality();

    React.useEffect(() => {
        viewStats(showStats);
    }, [showStats]);

    React.useEffect(() => {
        if (images) {
            showImages(images);
        }
    }, [images]);

    if (!isSupported) {
        const Unsupported = unsupportedComponent || UnsupportedMessage;
        return <Unsupported {...otherProps} reason={unsupportedReason as UnsupportedReason} />;
    }

    const onStartSelected = () => {
        startSession();
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

export default AugmentedRealityView;
