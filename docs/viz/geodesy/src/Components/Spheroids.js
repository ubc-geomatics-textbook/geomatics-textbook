import { SphereBufferGeometry } from "three";
import React, { useMemo } from "react";
import { HEIGHT_SEGMENTS, WIDTH_SEGMENTS } from "../Constants";

/**
 * Displays a sphere, one of the 3 primary models in the visualization.
 */
export function Sphere(props) {
    return (
        <ScaledSphere
            scale={1}
            {...props}
        />
    );
}

/**
 * Displays an ellipsoid, one of the 3 primary models in the visualization.
 */
export function Ellipsoid(props) {
    return (
        <ScaledSphere
            scale={[1, findSemiminorAxis(props.flattening, 1), 1]}
            {...props}
        />
    );
}

/**
 * Computes the y-scale of the ellipsoid from the flattening factor.
 * @param flattening Flattening factor.
 * @param semimajorAxis The ellipsoid's x/z scales, assumed to be equal (semimajor axis).
 * @returns {number} The y-scale (semiminor axis).
 */
function findSemiminorAxis(flattening, semimajorAxis) {
    return (1 - flattening) * semimajorAxis;
}

/**
 * Draws a transparent sphere-like object with arbitrary x, y, and z scales.
 * This component is the basis for the sphere and ellipsoid models.
 */
function ScaledSphere(props) {
    const sphereGeometry = useMemo(() => {
        return new SphereBufferGeometry(props.radius, WIDTH_SEGMENTS, HEIGHT_SEGMENTS);
    }, [props.radius]);

    return (
        <group
            scale={props.scale}
        >
            <mesh
                geometry={sphereGeometry}
                visible={props.opacity > 0}
            >
                <meshStandardMaterial
                    attach="material"
                    color={props.color}
                    transparent={true}
                    opacity={props.opacity}
                />
            </mesh>
            <lineSegments>
                <edgesGeometry
                    attach="geometry"
                    args={[sphereGeometry]}
                />
                <lineBasicMaterial
                    attach="material"
                    color={props.edgeColor}
                    transparent={true}
                    opacity={props.opacity}
                    depthWrite={false}
                />
            </lineSegments>
        </group>
    );
}