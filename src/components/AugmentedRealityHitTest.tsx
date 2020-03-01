import * as React from "react";
import AugmentedReality from "./AugmentedReality";
import { StandardProps, StandardAugmentedRealityProps } from "./propTypes";
import { GltfImage } from "../types";

type AugmentedRealityHitTestProps = StandardProps &
    StandardAugmentedRealityProps & {
        /**
         * Boolean indicating whether to display the hit test target
         */
        showTarget?: boolean;

        /**
         * Image in gltf format to use instead of the default image to show the current hit test target
         */
        targetImage?: GltfImage;

        /**
         * Event called when a hit test target is found
         */
        onHitTest?: (matrix: any) => void;

        /**
         * Event called when a hit test target has been selected by the user
         */
        onSelect?: (matrix: any) => void;
    };

/**
 * `AugmentedRealityHitTest`
 */
const AugmentedRealityHitTest = (props: AugmentedRealityHitTestProps) => {
    const { showStats = false, showTarget = true, targetImage, onHitTest, onSelect, ...standardProps } = props;
    const hitTestOptions = { targetImage, onHitTest, onSelect, showTarget: Boolean(showTarget) };

    return <AugmentedReality showStats={showStats} {...standardProps} options={{ hitTestOptions }} />;
};

export default AugmentedRealityHitTest;
