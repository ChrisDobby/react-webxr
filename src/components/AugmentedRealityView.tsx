import * as React from "react";
import useAugmentedReality, { GltfImage } from "../useAugmentedReality";
import AugmentedReality from "./AugmentedReality";
import { StandardProps, StandardAugmentedRealityProps } from "./types";

export type AugmentedRealityViewProps = StandardProps &
    StandardAugmentedRealityProps & {
        /**
         * Array of images in gltf format to be displayed in the view
         */
        images?: GltfImage[];
    };

/**
 * `AugmentedRealityView` will offer the user the opportunity to start a fully immersive augmented reality session when available in the browser
 */
const AugmentedRealityView = (props: AugmentedRealityViewProps) => {
    const { images, showStats = true, ...otherProps } = props;
    const {
        support: { isSupported, unsupportedReason },
        startSession,
        endSession,
        viewStats,
        showImages,
    } = useAugmentedReality();

    React.useEffect(() => {
        if (images) {
            showImages(images);
        }
    }, [images]);

    return (
        <AugmentedReality
            {...otherProps}
            isSupported={isSupported}
            unsupportedReason={unsupportedReason}
            startSession={startSession}
            endSession={endSession}
            showStats={showStats}
            viewStats={viewStats}
        />
    );
};

export default AugmentedRealityView;
