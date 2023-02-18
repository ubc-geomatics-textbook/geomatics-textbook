import { buttonGroup, folder, useControls } from "leva";
import React, { useEffect, useMemo, useState } from "react";
import { Geoid } from "./Geoid";
import { Ellipsoid, Sphere } from "./Spheroids";
import { GeocentricCoordinateLine, GeodeticCoordinateLine } from "./CoordinateLine";
import { GeoidHeightCanvas, GeoidHeightDisplay } from "./GeoidHeightDisplay";
import {
    GeocentricEllipsoidIntersection,
    geocentricRaycast,
    GeodeticEllipsoidIntersection,
    geodeticRaycast,
    SphereIntersection
} from "./Intersections";
import {
    COORDINATES_FOLDER,
    ELLIPSOID_COLOR,
    ELLIPSOID_CONTROL_HINT,
    FLATTENING_CONTROL_HINT,
    GEOCENTRIC_CONTROL_HINT,
    GEOCENTRIC_LINE_COLOR,
    GEODETIC_CONTROL_HINT,
    GEODETIC_LINE_COLOR,
    GEOID_CONTROL,
    GEOID_CONTROL_HINT,
    GEOID_HEIGHT_CONTROL,
    GEOID_NAME,
    GRATICULE_COLOR,
    LATITUDE_CONTROL_HINT,
    LEGEND_ELLIPSOID,
    LEGEND_GEOCENTRIC,
    LEGEND_GEODETIC,
    LEGEND_GEOID,
    LEGEND_SPHERE,
    LONGITUDE_CONTROL_HINT,
    MODEL_LAYER,
    MODEL_RADIUS,
    MODELS_FOLDER,
    SPHERE_COLOR,
    SPHERE_CONTROL_HINT,
    VANCOUVER_LATITUDE,
    VANCOUVER_LONGITUDE,
    WGS_FLATTENING
} from "../Constants";
import { ColorBlock, GradientLegend, ImageBlock, Legend, LegendWrapper, LineBlock } from "./Legend";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SpherePoint } from "./SpherePoint";

/**
 * Renders the main content of the visualization, including coordinate lines, models, etc.
 */
export function Visualization() {
    const {latitude, longitude} = useControls(COORDINATES_FOLDER, {
        latitude: {
            value: VANCOUVER_LATITUDE,
            min: -90,
            max: 90,
            step: 1,
            hint: LATITUDE_CONTROL_HINT,
            label: "λ (latitude)",
        },
        longitude: {
            value: VANCOUVER_LONGITUDE,
            min: -180,
            max: 180,
            step: 1,
            hint: LONGITUDE_CONTROL_HINT,
            label: "φ (longitude)",
        }
    });

    const [{ [GEOID_HEIGHT_CONTROL]: geoidHeightMode, geodetic, geocentric }, set] = useControls(() => ({
        [MODELS_FOLDER]: folder(
            {
                [GEOID_HEIGHT_CONTROL]: {
                    value: false,
                    render: () => false,
                },
                "geoid height": buttonGroup({
                    "on": () => set({
                        [GEOID_HEIGHT_CONTROL]: true,
                        geodetic: true,
                        geocentric: false,
                    }),
                    "off": () => set({
                        [GEOID_HEIGHT_CONTROL]: false,
                    }),
                }),
            }
        ),
        [COORDINATES_FOLDER]: folder(
            {
                geodetic: {
                    value: true,
                    render: (get) => !get(`${MODELS_FOLDER}.${GEOID_HEIGHT_CONTROL}`),
                    hint: GEODETIC_CONTROL_HINT,
                },
                geocentric: {
                    value: false,
                    render: (get) => !get(`${MODELS_FOLDER}.${GEOID_HEIGHT_CONTROL}`),
                    hint: GEOCENTRIC_CONTROL_HINT,
                },
            }
        ),
    }));

    return (
        <>
            <GeoidHeightCanvas/>
            <Models
                latitude={latitude}
                longitude={longitude}
                geoidHeightMode={geoidHeightMode}
                geodetic={geodetic}
                geocentric={geocentric}
            />
            {
                geoidHeightMode ?
                <GeoidHeightDisplay
                    latitude={latitude}
                    longitude={longitude}
                /> : null
            }
        </>
    );
}

function Models({ latitude, longitude, geoidHeightMode, geocentric, geodetic }) {
    const [ { sphere, ellipsoid, flattening }, setModels ] = useControls(MODELS_FOLDER, () => ({
        sphere: {
            value: 0,
            min: 0,
            max: 1,
            render: (get) => !get(`${MODELS_FOLDER}.${GEOID_HEIGHT_CONTROL}`),
            hint: SPHERE_CONTROL_HINT,
        },
        ellipsoid: {
            value: 0,
            min: 0,
            max: 1,
            hint: ELLIPSOID_CONTROL_HINT,
        },
        flattening: {
            value: 0.15,
            min: 0,
            max: 1,
            render: (get) => !get(`${MODELS_FOLDER}.${GEOID_HEIGHT_CONTROL}`),
            hint: FLATTENING_CONTROL_HINT,
        },
    }));

    const [{ [GEOID_CONTROL] : geoid }, setGeoid] = useControls(MODELS_FOLDER, () => ({
        [GEOID_CONTROL]: {
            value: true,
            render: (get) => !get(`${MODELS_FOLDER}.${GEOID_HEIGHT_CONTROL}`),
            hint: GEOID_CONTROL_HINT,
            onChange: (value) => {
                if (value) {
                    setModels({
                        sphere: 0,
                        ellipsoid: 0,
                    });
                }
            },
            transient: false,
        },
    }));

    // When the geoid height view is turned on, makes the geoid visible.
    useEffect(() => {
        if (geoidHeightMode) {
            setGeoid({ [GEOID_CONTROL]: true });
        }
    }, [geoidHeightMode, setGeoid]);

    // When the geoid height view is turned on, hides the sphere and sets a default flattening.
    useEffect(() => {
        if (geoidHeightMode) {
            setModels({
                sphere: 0,
                flattening: WGS_FLATTENING,
            });
        }
    }, [geoidHeightMode, setModels]);

    // When sphere is fully opaque, decreases the sphere opacity so it is clear that the ellipsoid is behind it.
    useEffect(() => {
        if (sphere === 1) {
            setModels({ sphere: 0.5 });
        }
    }, [ellipsoid, flattening, setModels]);

    const { scene } = useThree();

    const raycaster = useMemo(() => {
        const r = new THREE.Raycaster();
        r.layers.set(MODEL_LAYER);

        return r;
    }, []);

    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [geodeticIntersection, setGeodeticIntersection] = useState();
    const [geocentricIntersection, setGeocentricIntersection] = useState();

    useEffect(() => {
        if (geoid && geodetic) {
            setGeodeticIntersection(geodeticRaycast(scene, raycaster, latitude, longitude, flattening, GEOID_NAME));
        }
    }, [scene, raycaster, latitude, longitude, flattening, geoid, geodetic, shouldUpdate]);

    useEffect(() => {
        if (geoid && geocentric) {
            setGeocentricIntersection(geocentricRaycast(scene, raycaster, latitude, longitude, GEOID_NAME));
        }
    }, [scene, raycaster, latitude, longitude, geoid, geocentric, shouldUpdate]);

    const gradientLegend = (
        geoid ?
            <GradientLegend top={"78 m"} middle={"Ellipsoid"} bottom={"-106 m"}/>
            : null
    );

    const legend = <Legend elements={getLegendElements(sphere > 0, ellipsoid > 0, geoid, geocentric, geodetic)}/>;

    return (
        <>
            <Ellipsoid
                opacity={ellipsoid}
                flattening={flattening}
                color={ELLIPSOID_COLOR}
                edgeColor={GRATICULE_COLOR}
                radius={MODEL_RADIUS}
            />
            <Sphere
                opacity={sphere}
                color={SPHERE_COLOR}
                edgeColor={GRATICULE_COLOR}
                radius={MODEL_RADIUS}
            />
            {
                geocentric ? (
                    <GeocentricCoordinateLine
                        latitude={latitude}
                        longitude={longitude}
                        lineColor={GEOCENTRIC_LINE_COLOR}
                    />
                ) : null
            }
            {
                geodetic ? (
                    <GeodeticCoordinateLine
                        latitude={latitude}
                        longitude={longitude}
                        flattening={flattening}
                        lineColor={GEODETIC_LINE_COLOR}
                    />
                ) : null
            }
            {
                geocentric && (sphere > 0) ? (
                    <SphereIntersection
                        latitude={latitude}
                        longitude={longitude}
                    />
                ) : null
            }
            {
                geodetic && (ellipsoid > 0) ? (
                    <GeodeticEllipsoidIntersection
                        latitude={latitude}
                        longitude={longitude}
                        flattening={flattening}
                    />
                ) : null
            }
            {
                geocentric && (ellipsoid > 0) ? (
                    <GeocentricEllipsoidIntersection
                        latitude={latitude}
                        longitude={longitude}
                        flattening={flattening}
                    />
                ) : null
            }
            <Geoid
                isVisible={geoid}
                onGeoidLoad={() => {
                    setShouldUpdate(!shouldUpdate);
                }}
            />
            {
                geoid && geocentric ?
                    <SpherePoint position={geocentricIntersection}/>
                    : null
            }
            {
                geoid && geodetic ?
                    <SpherePoint position={geodeticIntersection}/>
                    : null
            }
            <LegendWrapper gradientLegend={gradientLegend} elementsLegend={legend}/>
        </>
    );
}

function getLegendElements(sphere, ellipsoid, geoid, geocentric, geodetic) {
    const elements = {};

    if (geoid) {
        elements[LEGEND_GEOID] = <ImageBlock src={"geoid-gradient.png"} alt={"A legend for the geoid colour gradient"}/>;
    }

    if (ellipsoid) {
        elements[LEGEND_ELLIPSOID] = <ColorBlock color={ELLIPSOID_COLOR}/>;
    }

    if (sphere) {
        elements[LEGEND_SPHERE] = <ColorBlock color={SPHERE_COLOR}/>;
    }

    if (geodetic) {
        elements[LEGEND_GEODETIC] = <LineBlock color={GEODETIC_LINE_COLOR}/>;
    }

    if (geocentric) {
        elements[LEGEND_GEOCENTRIC] = <LineBlock color={GEOCENTRIC_LINE_COLOR}/>;
    }

    return elements;
}