import * as React from "react";
import AugmentedReality from "./AugmentedReality";
import { StandardProps, StandardAugmentedRealityProps } from "./propTypes";

type AugmentedRealityHitTestProps = StandardProps &
    StandardAugmentedRealityProps & {
        /**
         * Boolean indicating whether to display the hit test target
         */
        showTarget?: boolean;

        /**
         * Url of a gltf image to use instead of the default image to show the current hit test target
         */
        targetImageUrl?: string;

        /**
         * Event called when a hit test target has been selected by the user
         */
        onHitTestSelect?: (matrix: Float32Array) => void;
    };

/**
 * `AugmentedRealityHitTest` showa a target when the hit test finds a surface and reacts to onHitTestSelect event when user selects
 */
const AugmentedRealityHitTest = (props: AugmentedRealityHitTestProps) => {
    const currentMatrix = React.useRef<Float32Array | null>(null);
    const onHitTest = (matrix: Float32Array | null) => (currentMatrix.current = matrix);

    const { showStats = false, showTarget = true, targetImageUrl, onHitTestSelect, ...standardProps } = props;
    const hitTestOptions = { targetImageUrl, showTarget: Boolean(showTarget) };

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
