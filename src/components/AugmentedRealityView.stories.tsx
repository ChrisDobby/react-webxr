import * as React from "react";
import AugmentedRealityView from "./AugmentedRealityView";
import { UnsupportedReason } from "../useAugmentedReality";

export default {
    component: AugmentedRealityView,
    title: "AugmentedRealityView",
    parameters: {
        componentSubtitle: "Immersive augmented reality view",
    },
};

export const Default = () => <AugmentedRealityView />;

const StoryStartStopButton = (props: any) => <button onClick={props.onStartSelected}>Start AR session</button>;
export const WithStartStopComponent = () => <AugmentedRealityView startStopComponent={StoryStartStopButton} />;

const ReasonDisplay = (props: any) => {
    switch (props.reason) {
        case UnsupportedReason.NotSupportedInBrowser:
            return <div>A custom not supported in the browser message</div>;
        case UnsupportedReason.InsecureConnection:
            return <div>A custom insecure connection message</div>;
        default:
            return <div />;
    }
};
export const WithUnsupportedMessageComponent = () => <AugmentedRealityView unsupportedComponent={ReasonDisplay} />;
