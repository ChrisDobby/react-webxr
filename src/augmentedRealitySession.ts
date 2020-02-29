import { Scene } from "./immersive-web/render/scenes/scene";
import { Gltf2Node } from "./immersive-web/render/nodes/gltf2";
import { Renderer, createWebGLContext } from "./immersive-web/render/core/renderer";

const sessionType = "immersive-ar";

let xrRefSpace: ReferenceSpace | null = null;

let gl: any = null;
let renderer = null;
let xrSession: XRSession | null = null;
const scene = new Scene();
scene.enableStats(false);
scene.clear = false;

const onXRFrame = (_: any, frame: Frame) => {
    const session = frame.session;
    const pose = frame.getViewerPose(xrRefSpace as ReferenceSpace);

    scene.startFrame();

    session.requestAnimationFrame(onXRFrame);

    scene.drawXRFrame(frame, pose);
    scene.endFrame();
};

const initGl = () => {
    if (gl) return;
    gl = createWebGLContext({
        xrCompatible: true,
    });

    renderer = new Renderer(gl);

    scene.setRenderer(renderer);
};

const onSessionEnded = () => {};

export const startSession = async () => {
    scene.clearNodes();
    if (!navigator.xr) return;
    xrSession = await navigator.xr.requestSession(sessionType);
    xrSession.addEventListener("end", onSessionEnded);

    initGl();

    xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, gl) });
    xrRefSpace = await xrSession.requestReferenceSpace("local");
    xrSession.requestAnimationFrame(onXRFrame);

    return xrSession;
};

export const endSession = () => {
    xrSession?.end();
};

export const enableStats = (enabled: boolean) => {
    scene.enableStats(enabled);
};

export const addImage = (imageNode: Gltf2Node) => {
    if (!xrSession) return;
    scene.addNode(imageNode);
};

export const removeImage = (imageNode: Gltf2Node) => {
    if (!xrSession) return;
    scene.removeNode(imageNode);
};
