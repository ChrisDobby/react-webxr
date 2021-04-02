import { Scene } from "./immersive-web/render/scenes/scene";
import { Gltf2Node } from "./immersive-web/render/nodes/gltf2";
import { Renderer, createWebGLContext } from "./immersive-web/render/core/renderer";
import { DropShadowNode } from "./immersive-web/render/nodes/drop-shadow";
import { vec3 } from "./immersive-web/render/math/gl-matrix";
import { Node } from "./immersive-web/render/core/node";

const sessionType = "immersive-ar";

let xrRefSpace: ReferenceSpace | null = null;
let xrHitTestSource: HitTestSource | null = null;
let xrViewerSpace = null;

let xrHitTestTarget: Gltf2Node | null = null;
let gl: any = null;
let renderer = null;
let xrSession: XRSession | null = null;

const scene = new Scene();
scene.enableStats(false);
scene.clear = false;

const handleHitTest = (onHitTest?: (matrix: Float32Array | null) => void) => {
    const handler = (frame: Frame, pose: any) => {
        if (xrHitTestTarget) xrHitTestTarget.visible = false;
        if (!xrHitTestSource || !pose) return;

        const hitTestResults = frame.getHitTestResults(xrHitTestSource);
        if (hitTestResults.length > 0) {
            const hitTestPose = hitTestResults[0].getPose(xrRefSpace as ReferenceSpace);
            if (xrHitTestTarget) {
                xrHitTestTarget.visible = true;
                xrHitTestTarget.matrix = hitTestPose.transform.matrix;
            }

            if (onHitTest) {
                onHitTest(hitTestPose.transform.matrix);
            }
        } else if (onHitTest) {
            onHitTest(null);
        }
    };

    return handler;
};

type XRFameHandler = (frame: Frame, pose: any) => void;

const handleXRFrame = (handlers: XRFameHandler[]) => {
    const onXRFrame = (_: any, frame: Frame) => {
        const { session } = frame;
        const pose = frame.getViewerPose(xrRefSpace as ReferenceSpace);
        handlers.forEach(handler => handler(frame, pose));

        scene.startFrame();

        session.requestAnimationFrame(onXRFrame);

        scene.drawXRFrame(frame, pose);
        scene.endFrame();
    };

    return onXRFrame;
};

const initGl = () => {
    if (gl) return;
    gl = createWebGLContext({
        xrCompatible: true,
    });

    renderer = new Renderer(gl);

    scene.setRenderer(renderer);
};

type SessionHitTestOptions = {
    showTarget: boolean;
    targetImageUrl?: string;
    onHitTest?: (matrix: Float32Array | null) => void;
};

type SessionDomOverlayOptions = {
    rootElementId: string;
};

const initHitTest = (hitTestOptions: SessionHitTestOptions) => {
    const { showTarget, targetImageUrl } = hitTestOptions;
    if (showTarget) {
        xrHitTestTarget = new Gltf2Node({
            url:
                targetImageUrl ||
                "https://raw.githubusercontent.com/immersive-web/webxr-samples/master/media/gltf/reticle/reticle.gltf",
        });
        xrHitTestTarget.visible = false;
        scene.addNode(xrHitTestTarget);
    }

    xrSession?.requestReferenceSpace("viewer").then(refSpace => {
        xrViewerSpace = refSpace;
        xrSession?.requestHitTestSource({ space: xrViewerSpace }).then(hitTestSource => {
            xrHitTestSource = hitTestSource;
        });
    });
};

type SessionOptions = {
    hitTestOptions?: SessionHitTestOptions;
    domOverlayOptions?: SessionDomOverlayOptions;
};

const getHandlers = (options?: SessionOptions) => {
    if (!options) return [];
    const handlers = [];
    if (options.hitTestOptions) {
        handlers.push(handleHitTest(options.hitTestOptions.onHitTest));
    }

    return handlers;
};

const onSessionEnded = () => {
    xrHitTestSource?.cancel();
    xrHitTestSource = null;
    xrHitTestTarget = null;
};

const getRequiredFeatures = (options?: SessionOptions) => {
    if (!options) return [];
    const features = [];
    if (options.hitTestOptions) {
        features.push("local", "hit-test");
    }

    return features;
};

const getOptionalFeatures = (options?: SessionOptions) => {
    if (!options) return [];
    const features = [];
    if (options.domOverlayOptions) {
        features.push("dom-overlay");
    }

    return features;
};

const getInitOptions = (options?: SessionOptions) => {
    if (options && options.domOverlayOptions) {
        return { root: document.getElementById(options.domOverlayOptions.rootElementId) };
    }

    return {};
};

export const startSession = async (options?: SessionOptions) => {
    if (!navigator.xr) return null;
    const requestOptions = {
        requiredFeatures: getRequiredFeatures(options),
        optionalFeatures: getOptionalFeatures(options),
        ...getInitOptions(options),
    };

    scene.clearNodes();

    xrSession = await navigator.xr.requestSession(sessionType, requestOptions);
    xrSession.addEventListener("end", onSessionEnded);

    initGl();
    xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, gl) });

    if (options?.hitTestOptions) {
        initHitTest(options.hitTestOptions);
    }

    xrRefSpace = await xrSession.requestReferenceSpace("local");
    xrSession.requestAnimationFrame(handleXRFrame(getHandlers(options)));

    return xrSession;
};

export const endSession = () => {
    xrSession?.end();
};

export const enableStats = (enabled: boolean) => {
    scene.enableStats(enabled);
};

export const addImage = (imageNode: Gltf2Node, includeShadow?: boolean) => {
    if (!xrSession) return null;
    if (includeShadow) {
        const shadow = new DropShadowNode();
        vec3.set(shadow.scale, 0.15, 0.15, 0.15);

        const imageAndShadowNode = new Node();
        imageAndShadowNode.addNode(imageNode);
        imageAndShadowNode.addNode(shadow);
        scene.addNode(imageAndShadowNode);
        return imageAndShadowNode;
    }

    scene.addNode(imageNode);
    return imageNode;
};

export const removeImage = (imageNode: Gltf2Node | Node) => {
    if (!xrSession) return;
    scene.removeNode(imageNode);
};
