import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { MathUtils } from "three";
import { useControls } from "leva";
import {
    AUTOROTATE_HINT,
    LIGHT_FOLLOW_HINT,
    LIGHT_INTENSITY_HINT,
    LIGHT_OFFSET_HINT,
    MODEL_LAYER,
    MODEL_RADIUS
} from "../Constants";

/**
 * Extends the default camera layers to include the layer we moved all models into.
 * This is required because we placed the primary models (sphere, ellipsoid, geoid) in a different layer to raycast
 * against them.
 */
export function SetCameraLayers() {
    const { camera } = useThree();

    useEffect(() => {
        camera.layers.enable(MODEL_LAYER);
    }, [camera.layers]);

    return null;
}

/**
 * OrbitControls with some predefined camera settings, including auto-rotation and disabling panning.
 * Auto-rotation is initially on, and the first click turns it off.
 *
 * Adds the Camera folder to the Leva controls to toggle the auto-rotation.
 */
export function FreeControlsWithClickDetection() {
    const [{ autoRotate }, set] = useControls("Camera", () => ({
        autoRotate: {
            value: true,
            hint: AUTOROTATE_HINT,
        },
    }));

    useEffect(() => {
        const stopRotating = () => {
            console.log("Turning off auto rotation");
            set({ autoRotate: false });
        };

        window.addEventListener("click", stopRotating, {"once": true});
    }, [set]);

    return (
        <FreeControls autoRotate={autoRotate}/>
    );
}

function FreeControls({ autoRotate }) {
    const { camera, gl } = useThree();
    const controls = useRef();

    useFrame(() => {
        controls.current.update();
    });

    return (
        <OrbitControls
            ref={controls}
            args={[camera, gl]}
            minDistance={MODEL_RADIUS + 0.5}
            maxDistance={MODEL_RADIUS * 10}

            enablePan={false}

            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
        />
    );
}

/**
 * A directional light that shines from a fixed angle relative to the camera.
 *
 * Adds the Lighting folder to the Leva controls.
 */
export function CameraAlignedLight() {

    const light = useRef();
    useEffect(() => {
        light.current.matrixAutoUpdate = false;
    }, []);

    const { camera } = useThree();

    const { intensity, followCamera, offset } = useControls("Lighting", {
        intensity: {
            value: 0.75,
            min: 0,
            max: 2,
            hint: LIGHT_INTENSITY_HINT,
        },
        followCamera: {
            value: true,
            hint: LIGHT_FOLLOW_HINT,
        },
        offset: {
            value: -65,
            min: -180,
            max: 180,
            step: 1,
            hint: LIGHT_OFFSET_HINT,
        }
    }, {
        collapsed: true
    });

    useFrame(() => {
        if (followCamera) {
            light.current.matrix.copy(calculateLightMatrix(camera.matrixWorld, offset));
        }
    });

    return (
        <directionalLight
            ref={light}
            intensity={intensity}
        />
    );
}

/**
 * Calculates a transformation matrix for the light such that it shines from a fixed offset angle from the camera.
 *
 * Creates the illusion of rotating the models, when the user is actually rotating the camera.
 *
 * @param cameraMatrix The camera matrix (matrix that transforms positions in the camera frame to the world frame).
 * @param offsetDegrees The angle, in degrees, to offset the light by. A number in [-180, 180].
 * @returns {*} The .matrix of the light.
 */
function calculateLightMatrix(cameraMatrix, offsetDegrees) {
    /*
    Get a frame f that has the same rotation as the camera, but is positioned at the origin of the world.
    The .matrix, F, of frame f is just the camera matrix, except with the position component set to 0.
     */
    const frameMatrix = cameraMatrix.clone().setPosition(0, 0, 0);
    const frameMatrixInv = frameMatrix.clone().invert();

    /*
    Construct a rotation matrix R that describes a rotation of offsetDegrees degrees about the y axis.
     */
    const rotationMatrix = new THREE.Matrix4().makeRotationY(MathUtils.degToRad(offsetDegrees));

    /*
    This matrix applies the rotation R with respect to the frame f. Applying it to the camera's local position gives the
    desired world position and rotation of the light.

    The matrix is calculated as F R F^(-1) C.
     */
    return frameMatrix.multiply(rotationMatrix).multiply(frameMatrixInv).multiply(cameraMatrix);
}