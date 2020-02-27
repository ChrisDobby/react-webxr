import * as React from "react";
import { Renderer, createWebGLContext } from "./immersive-web/render/core/renderer";
import { Scene } from "./immersive-web/render/scenes/scene";
import { Gltf2Node } from "./immersive-web/render/nodes/gltf2";

const sessionType = "immersive-ar";

export type GltfImage = {
    src: string;
    scale?: [number, number, number];
};

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
    const currentSession = React.useRef<XRSession | null>(null);
    const glContext = React.useRef<any>(null);
    const renderer = React.useRef<Renderer | null>(null);
    const scene = React.useRef(new Scene());
    const xrRefSpace = React.useRef<ReferenceSpace | null>(null);

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

    React.useEffect(() => {
        onDeviceChange();
    }, []);

    const onResize = () => {
        if (!glContext.current) return;
        glContext.current.canvas.width = glContext.current.canvas.clientWidth * window.devicePixelRatio;
        glContext.current.canvas.height = glContext.current.canvas.clientHeight * window.devicePixelRatio;
    };

    const initGL = () => {
        if (glContext.current) return;
        glContext.current = createWebGLContext({ xrCompatible: true });
        document.body.appendChild(glContext.current.canvas);
        window.addEventListener("resize", onResize);
        window.addEventListener("devicechange", onDeviceChange);
        onResize();
        renderer.current = new Renderer(glContext.current);
        scene.current.setRenderer(renderer.current);
    };
    const onSessionEnd = () => {
        currentSession.current = null;
    };

    const onSessionStart = async (session: XRSession) => {
        currentSession.current = session;
        currentSession.current.addEventListener("end", onSessionEnd);

        initGL();
        currentSession.current.updateRenderState({
            baseLayer: new XRWebGLLayer(currentSession.current, glContext.current),
        });
        xrRefSpace.current = await currentSession.current.requestReferenceSpace("local");
        currentSession.current.requestAnimationFrame(onXRFrame);
    };

    const onXRFrame = (_: any, frame: Frame) => {
        if (!xrRefSpace.current) return;
        const pose = frame.getViewerPose(xrRefSpace.current);
        scene.current.startFrame();
        currentSession.current?.requestAnimationFrame(onXRFrame);
        scene.current.drawXRFrame(frame, pose);
        scene.current.endFrame();
    };

    const startSession = () => {
        if (!support.isSupported) return;
        navigator.xr?.requestSession(sessionType).then(onSessionStart);
    };

    const endSession = () => {
        if (currentSession.current) {
            currentSession.current.end();
        }
    };

    const viewStats = (view: boolean) => {
        if (scene.current) {
            scene.current.enableStats(view);
        }
    };

    const showImages = (images: GltfImage[]) => {
        if (!scene.current) {
            return;
        }

        scene.current.clear = true;
        for (const image of images) {
            const { src, scale } = image;
            const newImage = new Gltf2Node({ url: src });
            if (scale) {
                newImage.scale = scale;
            }
            scene.current.addNode(newImage);
        }
    };

    return { support, startSession, endSession, viewStats, showImages };
};

export default useAugmentedReality;
