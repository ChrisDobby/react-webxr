import { UnsupportedReason } from "../useAugmentedReality";
import { GltfImage } from "../types";

export type UnsupportedReasonProps = {
    reason: UnsupportedReason;
};

export type StartComponentProps = {
    sessionInProgress: boolean;
    onStartSelected: () => void;
    onStopSelected: () => void;
};

export type StandardProps = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
};

export type StandardAugmentedRealityProps = {
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

    /**
     * Content to overlay in the augmented reality view
     */
    children?: React.ReactNode;
};
