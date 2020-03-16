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
         * Event called when a hit test target has been selected by the user
         */
        onHitTestSelect?: (matrix: Float32Array) => void;
    };

/**
 * `AugmentedRealityHitTest`
 */
const AugmentedRealityHitTest = (props: AugmentedRealityHitTestProps) => {
    const currentMatrix = React.useRef<Float32Array | null>(null);
    const onHitTest = (matrix: Float32Array | null) => (currentMatrix.current = matrix);

    const { showStats = false, showTarget = true, targetImage, onHitTestSelect, ...standardProps } = props;
    const hitTestOptions = { targetImage, showTarget: Boolean(showTarget) };

    const onSelect = () => {
        if (currentMatrix.current && onHitTestSelect) {
            onHitTestSelect(currentMatrix.current);
        }
    };

    return (
        <AugmentedReality
            showStats={showStats}
            {...standardProps}
            options={{ hitTestOptions }}
            onHitTest={onHitTest}
            onSelect={onHitTestSelect ? onSelect : undefined}
        />
    );
};

export default AugmentedRealityHitTest;
