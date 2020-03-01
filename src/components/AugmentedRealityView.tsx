import * as React from "react";
import AugmentedReality from "./AugmentedReality";
import { StandardProps, StandardAugmentedRealityProps } from "./propTypes";

export type AugmentedRealityViewProps = StandardProps & StandardAugmentedRealityProps;

/**
 * `AugmentedRealityView` will offer the user the opportunity to start a fully immersive augmented reality session when available in the browser
 */
const AugmentedRealityView = (props: AugmentedRealityViewProps) => {
    const { showStats = true, ...otherProps } = props;

    return <AugmentedReality {...otherProps} showStats={showStats} />;
};

export default AugmentedRealityView;
