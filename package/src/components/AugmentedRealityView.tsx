import * as React from "react";
import { useAugmentedReality } from "..";
import { UnsupportedReason } from "../useAugmentedReality";

type StartComponentProps = {
    sessionInProgress: boolean;
    onStartSelected: () => void;
    onStopSelected: () => void;
};

type UnsupportedReasonProps = {
    reason: UnsupportedReason;
};

type StandardProps = React.AriaAttributes & {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
};

type AugmentedRealityViewProps = StandardProps & {
    startStopComponent?: (props: StartComponentProps) => JSX.Element;
    unsupportedComponent?: (props: UnsupportedReasonProps) => JSX.Element;
};

type UnsupportedMessageProps = StandardProps & UnsupportedReasonProps;

const StartStopButton = ({ onStartSelected }: StartComponentProps) => (
    <button onClick={onStartSelected}>Start AR Session</button>
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

const AugmentedRealityView = (props: AugmentedRealityViewProps) => {
    const { startStopComponent, unsupportedComponent, ...otherProps } = props;
    const {
        support: { isSupported, unsupportedReason },
        startSession,
        endSession,
    } = useAugmentedReality();

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
