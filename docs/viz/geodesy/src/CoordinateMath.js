import * as THREE from "three";
import { MathUtils } from "three";
import { MODEL_RADIUS } from "./Constants";

/**
 * Converts a latitude angle between -90 and 90 degrees to polar angle in radians.
 * @param latitudeDeg Latitude, in degrees. Must be an integer value in [-90, 90].
 * @returns {*} Polar angle (spherical coordinates) in radians.
 */
export function convertLatitudeToSpherical(latitudeDeg) {
    return MathUtils.degToRad(90 - latitudeDeg);
}

/**
 * Converts a longitude angle between -180 and 180 degrees to azimuthal angle in radians.
 * @param longitudeDeg Longitude, in degrees. Must be an integer value in [-180, 180].
 * @returns {*} Azimuthal angle (spherical coordinates) in radians.
 */
export function convertLongitudeToSpherical(longitudeDeg) {
    return MathUtils.degToRad(longitudeDeg);
}

/**
 * Returns the point on the ellipsoid specified by the geocentric coordinates.
 * @param lat Latitude, in degrees.
 * @param lon Longitude, in degrees.
 * @param flattening Flattening factor of the ellipsoid.
 * @returns {Vector3} The world position of the intersection of the ellipsoid and the geocentric coordinates.
 */
export function geocentricEllipsoidIntersection(lat, lon, flattening) {
    // World space position on the surface of the ellipsoid, from geocentric coordinates
    // Formula source: https://en.wikipedia.org/wiki/Ellipsoid#Parameterization

    const latRad = MathUtils.degToRad(lat);
    const lonRad = MathUtils.degToRad(lon);

    const z = Math.cos(latRad) * Math.cos(lonRad);
    const x = Math.cos(latRad) * Math.sin(lonRad);
    const y = Math.sin(latRad);

    const R = (1 - flattening) * MODEL_RADIUS /
        Math.sqrt(((1 - flattening) * Math.cos(latRad)) ** 2 + Math.sin(latRad) ** 2);

    return new THREE.Vector3(x, y, z).multiplyScalar(R);
}

/**
 * Gets the world space coordinates from the geocentric latitude/longitude and height.
 * @param lat Latitude, in degrees.
 * @param lon Longitude, in degrees.
 * @param height Height (meters) above the sphere.
 * @returns {Vector3} The world position of the specified point.
 */
export function geocentricToWorld(lat, lon, height) {
    const theta = convertLongitudeToSpherical(lon);
    const phi = convertLatitudeToSpherical(lat);

    return new THREE.Vector3().setFromSphericalCoords(MODEL_RADIUS + height, phi, theta);
}

/**
 * Gets the world space coordinates from the geodetic coordinates (latitude, longitude, ellipsoidal height).
 * @param lat Latitude, in degrees.
 * @param lon Longitude, in degrees.
 * @param flattening Flattening factor of the ellipsoid.
 * @param height Height (meters) above the ellipsoid.
 * @returns {Vector3} The world position of the specified point.
 */
export function geodeticToWorld(lat, lon, flattening, height) {
    // Formula source: https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#Coordinate_system_conversion
    const latRad = MathUtils.degToRad(lat);
    const lonRad = MathUtils.degToRad(lon);

    const a = MODEL_RADIUS;
    const eSquared = flattening * (2 - flattening);
    const N = a / Math.sqrt(1 - eSquared * (Math.sin(latRad) ** 2));

    const z = (N + height) * Math.cos(latRad) * Math.cos(lonRad);
    const x = (N + height) * Math.cos(latRad) * Math.sin(lonRad);
    const y = (N * (1 - eSquared) + height) * Math.sin(latRad);

    return new THREE.Vector3(x, y, z);
}

/**
 * Returns the position of one endpoint of the geodetic coordinate line which lies on the equatorial plane.
 * @param lat Latitude, in degrees.
 * @param lon Longitude, in degrees.
 * @param flattening Flattening factor of the ellipsoid.
 * @returns {Vector3} The world position of this point.
 */
export function getGeodeticOrigin(lat, lon, flattening) {
    const latRad = MathUtils.degToRad(lat);
    const lonRad = MathUtils.degToRad(lon);

    const a = MODEL_RADIUS;
    const eSquared = flattening * (2 - flattening);
    const N = a / Math.sqrt(1 - eSquared * (Math.sin(latRad) ** 2));

    const z = eSquared * N * Math.cos(latRad) * Math.cos(lonRad);
    const x = eSquared * N * Math.cos(latRad) * Math.sin(lonRad);

    return new THREE.Vector3(x, 0, z);
}