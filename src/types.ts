export type GltfImage = {
    key: string;
    src: string;
    matrix?: Float32Array;
    includeShadow?: boolean;
};

export type HitTestOptions = {
    showTarget: boolean;
    targetImageUrl?: string;
};

export type XRSessionOptions = {
    hitTestOptions?: HitTestOptions;
};
