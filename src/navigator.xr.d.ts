declare class XRWebGLLayer {
    constructor(session: XRSession, gl: any);
}

type UpdateRenderStateOptions = { baseLayer?: XRWebGLLayer };

interface Pose {
    transform: { matrix: Float32Array };
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ReferenceSpace {}
interface HitTestSource {
    cancel: () => void;
}

interface HitTestResult {
    getPose: (space: ReferenceSpace) => Pose;
}

interface Frame {
    session: XRSession;
    getViewerPose: (referenceSpace: ReferenceSpace) => Pose;
    getHitTestResults: (hitTestSource: HitTestSource) => HitTestResult[];
}

interface XRSession {
    end: () => void;
    addEventListener: (event: string, callback) => void;
    removeEventListener: (event: string, callback) => void;
    requestReferenceSpace: (space: string) => Promise<ReferenceSpace>;
    requestHitTestSource: ({ space: ReferenceSpace }) => Promise<HitTestSource>;
    requestAnimationFrame: (onFrame: (t: any, frame: Frame) => void) => void;
    updateRenderState: (options: UpdateRenderStateOptions) => void;
    domOverlayState: { type: "screen" | "floating" | "head-locked" };
}

interface XR {
    isSessionSupported: (sessionType: string) => Promise<boolean>;
    requestSession: (
        sessionType: string,
        options?: {
            requiredFeatures: string[];
            optionalFeatures?: string[];
            domOverlay?: { root: HTMLElement | null };
        },
    ) => Promise<XRSession>;
}

interface NavigatorXR {
    xr?: XR;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Navigator extends NavigatorXR {}
