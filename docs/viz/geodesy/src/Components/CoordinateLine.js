import * as THREE from "three";
import React, { useLayoutEffect, useRef } from "react";
import { MODEL_RADIUS } from "../Constants";
import { geocentricToWorld, geodeticToWorld, getGeodeticOrigin } from "../CoordinateMath";

/**
 * Draws a line visualizing the given latitude and longitude as geocentric coordinates.
 */
export function GeocentricCoordinateLine({ latitude, longitude, lineColor }) {
    return (
        <MovingLine
            start={new THREE.Vector3(0, 0, 0)}
            end={geocentricToWorld(latitude, longitude, MODEL_RADIUS)}
            lineColor={lineColor}

            // Don't have this line cover the geodetic coordinate line
            depthWrite={false}
        />
    );
}

/**
 * Draws a line visualizing the given latitude and longitude as geodetic coordinates.
 * (The flattening parametrizes the ellipsoid relative to which the geodetic coordinates are defined.)
 */
export function GeodeticCoordinateLine({latitude, longitude, flattening, lineColor}) {
    return (
        <MovingLine
            start={getGeodeticOrigin(latitude, longitude, flattening)}
            end={geodeticToWorld(latitude, longitude, flattening, MODEL_RADIUS)}
            lineColor={lineColor}

            renderOrder={2}
            depthWrite={true}
        />
    );
}

/**
 * A line segment with dynamic endpoints.
 */
function MovingLine(props) {
    const bufferGeometryRef = useRef();

    useLayoutEffect(() => {
            const vertices = [
                props.start,
                props.end
            ];
            bufferGeometryRef.current.setFromPoints(vertices);
        },
        [props.start, props.end]
    );

    return (
        <line
            renderOrder={props.renderOrder ?? 0}
        >
            <bufferGeometry
                attach="geometry"
                ref={bufferGeometryRef}
            />
            <lineBasicMaterial
                attach="material"
                color={props.lineColor}
                depthWrite={props.depthWrite}
            />
        </line>
    );
}
