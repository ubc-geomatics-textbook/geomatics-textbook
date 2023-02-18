import { Html } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import "./styles/geoid_height.css";

const geoidHeightImageSrc = "./geoid-height-grid.png";
const geoidHeightCanvasId = "geoid-height-grid";

/**
 * A hidden canvas containing a grid of geoid heights.
 * This canvas is used as a lookup table for the geoid height, so it must be included in the scene.
 */
export function GeoidHeightCanvas() {
    const canvasRef = useRef();

    useEffect(() => {
        const image = new Image(361, 181);
        image.src = geoidHeightImageSrc;

        image.onload = () => {
            console.log("Finished loading geoid height image.");

            const context = canvasRef.current.getContext("2d");
            context.drawImage( image, 0, 0 );
        };
    }, []);

    return (
        <Html>
            <canvas
                ref={canvasRef}
                hidden
                id={geoidHeightCanvasId}
                width={361}
                height={181}
            />
        </Html>
    );
}

/**
 * Text overlaid on top of the scene, in the top center.
 */
function CenteredText({ text }) {
    return (
        <Html
            transform={false}
            zIndexRange={[0, 0]}
            className="geoid-height-label"
            style={{
                "position": "relative",
                "left": "-50%",
            }}
            calculatePosition={(el, camera, size) => [size.width / 2, 0]}
        >
            <p>
                {text}
            </p>
        </Html>
    )
}

/**
 * Displays the geoid height at the given latitude and longitude.
 */
export function GeoidHeightDisplay({ latitude, longitude }) {
    const canvas = document.getElementById(geoidHeightCanvasId);

    const context = canvas.getContext("2d");
    const geoidHeight = lookupGeoidHeight(context, latitude, longitude);

    return (
        <CenteredText
            text = {`Geoid height: ${geoidHeight} m`}
        />
    );
}

/**
 * Finds the geoid height at the given coordinates.
 * @param context The 2d context of the canvas where the lookup image is stored.
 * @param lat Latitude, in degrees.
 * @param lon Longitude, in degrees.
 * @returns {number} The geoid height, in meters, rounded to the nearest integer.
 */
function lookupGeoidHeight( context, lat, lon ) {
    const [ imgX, imgY ] = getImgXYFromCoordinates(lon, lat);

    const data = context.getImageData(imgX, imgY, 1, 1).data;

    return pixelToGeoidHeight(data[0]);
}

function getImgXYFromCoordinates(lon, lat) {
    return [lon + 180 , 90 - lat]
}

/**
 * Decodes the rounded geoid height from the stored pixel value.
 *
 * The geoid heights were stored according to a linear scale, where pixel=0 corresponds to the minimum geoid height
 * in the dataset, and pixel=255 corresponds to the maximum.
 * @param pixelValue The value of the pixel in the lookup image. Should be an integer in [0, 255].
 * @returns {number} The geoid height, in meters, rounded to the nearest integer.
 */
function pixelToGeoidHeight(pixelValue) {
    const maxHeight = 78.21;
    const minHeight = -106.57;

    const height = minHeight + pixelValue / 255 * (maxHeight - minHeight);

    return Math.round(height);
}