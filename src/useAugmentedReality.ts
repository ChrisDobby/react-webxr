import * as React from "react";

const sessionType = "immersive-ar";

export enum UnsupportedReason {
    NotInitialised,
    InsecureConnection,
    NotSupportedInBrowser,
}

type AugmentedRealitySupport = {
    isSupported: boolean;
    unsupportedReason?: UnsupportedReason;
};

const useAugmentedReality = () => {
    const [support, setSupport] = React.useState<AugmentedRealitySupport>({
        isSupported: false,
        unsupportedReason: UnsupportedReason.NotInitialised,
    });

    React.useEffect(() => {
        const checkBrowserSupport = async (xr: XR) => {
            const isSupportedInBrowser = await xr.isSessionSupported(sessionType);
            setSupport({
                isSupported: isSupportedInBrowser,
                unsupportedReason: isSupportedInBrowser ? undefined : UnsupportedReason.NotSupportedInBrowser,
            });
        };

        const onDeviceChange = () => {
            if (!window.isSecureContext) {
                setSupport({ isSupported: false, unsupportedReason: UnsupportedReason.InsecureConnection });
            } else if (!navigator.xr) {
                setSupport({ isSupported: false, unsupportedReason: UnsupportedReason.NotSupportedInBrowser });
            } else {
                checkBrowserSupport(navigator.xr);
            }
        };

        onDeviceChange();
    }, []);

    return { support };
};

export default useAugmentedReality;
