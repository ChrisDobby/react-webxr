export type GltfImage = {
    key: string;
    src: string;
    scale?: [number, number, number];
    matrix?: any;
    includeShadow?: boolean;
};

export type HitTestOptions = {
    showTarget: boolean;
    targetImageUrl?: string;
    onSelect?: (matrix: Float32Array) => void;
    onHitTest?: (matrix: Float32Array) => void;
};

export type XRSessionOptions = {
    hitTestOptions?: HitTestOptions;
};
