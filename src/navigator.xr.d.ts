declare class XRWebGLLayer {
    constructor(session: XRSession, gl: any);
}

type UpdateRenderStateOptions = { baseLayer?: XRWebGLLayer };

interface Pose {}
interface ReferenceSpace {}

interface Frame {
    getViewerPose: (referenceSpace: ReferenceSpace) => Pose;
}

interface XRSession {
    end: () => void;
    addEventListener: (event: string, callback) => void;
    requestReferenceSpace: (space: string) => Promise<ReferenceSpace>;
    requestAnimationFrame: (onFrame: (t: any, frame: Frame) => void) => void;
    updateRenderState: (options: UpdateRenderStateOptions) => void;
}

interface XR {
    isSessionSupported: (sessionType: string) => Promise<boolean>;
    requestSession: (sessionType: string) => Promise<XRSession>;
}

interface NavigatorXR {
    xr?: XR;
}

interface Navigator extends NavigatorXR {}
