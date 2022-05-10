import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MODEL_RADIUS } from "../Constants";

/**
 * The color of a {@link SpherePoint} when not hovered over.
 * @type {string}
 */
const NORMAL_COLOR = "#00ffbb";

/**
 * The color of a {@link SpherePoint} when hovered over.
 * @type {string}
 */
const HOVER_COLOR = "#ff0090";

/**
 * A small spherical point that can be placed at a given world position in the scene.
 * Changes color when hovered over.
 */
export function SpherePoint({ position }) {
    const materialRef = useRef();
    const [hover, setHover] = useState(false);

    useFrame(() => {
        materialRef.current.color.set(hover ? HOVER_COLOR : NORMAL_COLOR);
    });

    return (
        <mesh
            position={position}

            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <sphereBufferGeometry
                attach="geometry"
                args={[MODEL_RADIUS / 80, 10, 5]}
            />
            <meshStandardMaterial
                attach="material"
                ref={materialRef}
                color={NORMAL_COLOR}
            />
        </mesh>
    );
}