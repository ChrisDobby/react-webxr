import * as React from "react";
import AugmentedRealityHitTest from "./AugmentedRealityHitTest";
import { action } from "@storybook/addon-actions";
import { GltfImage } from "../types";

export default {
    component: AugmentedRealityHitTest,
    title: "AugmentedRealityHitTest",
    parameters: {
        componentSubtitle: "Immersive augmented reality view that reacts to hit tests",
    },
};

const availableImages = {
    sunflower: { title: "Sunflower", src: "sunflower/sunflower.gltf", includeShadow: true },
    waterbottle: { title: "Water bottle", src: "waterbottle/WaterBottle.gltf" },
    man: { title: "Cesium man", src: "cesiumman/CesiumMan.gltf" },
};

type SelectedImage = "sunflower" | "waterbottle" | "man";

export const Default = () => {
    const [selectedImage, setSelectedImage] = React.useState<SelectedImage>(
        Object.keys(availableImages)[0] as SelectedImage,
    );
    const [images, setImages] = React.useState<GltfImage[]>([]);
    const imageIndexRef = React.useRef(0);

    const onImageSelected = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        setSelectedImage(ev.target.value as SelectedImage);

    const onHitTestSelect = (matrix: Float32Array) => {
        imageIndexRef.current = imageIndexRef.current + 1;
        const image = availableImages[selectedImage];
        setImages([
            ...images,
            {
                matrix,
                ...image,
                key: imageIndexRef.current.toString(),
            },
        ]);
    };

    return (
        <>
            <label htmlFor="selectImage" style={{ marginRight: "10px" }}>
                Select image to show:
            </label>
            <select value={selectedImage} onBlur={onImageSelected} onChange={onImageSelected}>
                {Object.entries(availableImages).map(([value, image]) => (
                    <option key={value} value={value} aria-selected={value === selectedImage}>
                        {image.title}
                    </option>
                ))}
            </select>
            <AugmentedRealityHitTest onHitTestSelect={onHitTestSelect} showTarget images={images} />
        </>
    );
};

export const WithInvisibleTarget = () => (
    <AugmentedRealityHitTest showTarget={false} onHitTestSelect={action("selected")} />
);

export const WithCustomTargetImage = () => <AugmentedRealityHitTest showTarget onHitTestSelect={action("selected")} />;
