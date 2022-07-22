import React from "react";
import { SpherePoint } from "./SpherePoint";
import { MODEL_RADIUS } from "../Constants";
import { geocentricEllipsoidIntersection, geocentricToWorld, geodeticToWorld, } from "../CoordinateMath";

/**
 * Draws the point on the sphere given by the geocentric latitude and longitude.
 */
export function SphereIntersection( {latitude, longitude} ) {
    return (
        <SpherePoint
            position={geocentricToWorld(latitude, longitude, 0)}
        />
    );
}

/**
 * Draws the point on the ellipsoid given by the geocentric latitude and longitude.
 */
export function GeocentricEllipsoidIntersection({latitude, longitude, flattening} ) {
    return (
        <SpherePoint
            position={geocentricEllipsoidIntersection(latitude, longitude, flattening)}
        />
    );
}

/**
 * Draws the point on the ellipsoid given by the geodetic latitude and longitude.
 */
export function GeodeticEllipsoidIntersection({latitude, longitude, flattening}) {
    return (
        <SpherePoint
            position={geodeticToWorld(latitude, longitude, flattening, 0)}
        />
    );
}

/**
 * Finds a point on the given model that corresponds to the geocentric latitude and longitude.
 *
 * Uses the first model in MODEL_LAYER whose .name equals the given name.
 */
export function geocentricRaycast(scene, raycaster, latitude, longitude, objectName) {
    const rayStart = geocentricToWorld(latitude, longitude, MODEL_RADIUS);
    const direction = rayStart.clone().negate();

    return raycast(scene, raycaster, rayStart, direction, objectName);
}

/**
 * Finds the point on the given model that corresponds to geodetic latitude and longitude.
 *
 * Uses the first model in MODEL_LAYER whose .name equals the given name.
 */
export function geodeticRaycast(scene, raycaster, latitude, longitude, flattening, objectName) {
    const rayStart = geodeticToWorld(latitude, longitude, flattening, MODEL_RADIUS);
    const direction = geodeticToWorld(latitude, longitude, flattening, -MODEL_RADIUS / 2).sub(rayStart);

    return raycast(scene, raycaster, rayStart, direction, objectName);
}

/**
 * Raycasts against the whole scene and finds the first intersection with an object that has the given name.
 * The raycasting uses the layer MODEL_LAYER.
 * @param scene Scene to perform raycasting in.
 * @param raycaster The raycaster to use.
 * @param rayStart Start position of the ray (Vector3).
 * @param direction Direction to raycast in (Vector3). Can be any length, the function will normalize it.
 * @param objectName .name of the Object3D to intersect.
 * @returns The point of intersection, as a Vector3 in world coordinates. If no intersection found, returns null.
 */
function raycast(scene, raycaster, rayStart, direction, objectName) {
    raycaster.set(rayStart, direction.normalize());

    const intersections = raycaster.intersectObjects(scene.children, true);
    const intersection = intersections.find((intersection) => intersection.object.name === objectName);

    console.log("Performed a raycast: ");
    console.log(intersection);

    return intersection ? intersection.point : null;
}