import { Html } from "@react-three/drei";
import "./styles/legend.css";

/**
 * Takes 2 legend elements and groups them with the proper position and alignment.
 */
export function LegendWrapper({gradientLegend, elementsLegend}) {
    return (
        <Html
            calculatePosition={(el, camera, size) => {
                return [0, size.height];
            }}
            prepend
            zIndexRange={[0, 0]}
            className="legends-root"
        >
            <div className="legends-wrapper">
                {elementsLegend}
                {gradientLegend}
            </div>
        </Html>
    )
}

/**
 * Legend for the colour gradient on the geoid.
 * @param top Label for the maximum value.
 * @param middle Label for the middle value.
 * @param bottom Label for the minimum value.
 */
export function GradientLegend({top, middle, bottom}) {
    return (
        <div className="gradient-legend-wrapper">
            <img
                id="horizontal-gradient"
                src={"geoid-gradient-legend-horizontal.png"}
                alt={"geoid gradient legend"}
            />
            <img
                id="vertical-gradient"
                src={"geoid-gradient-legend-vertical.png"}
                alt={"geoid gradient legend"}
            />

            <div className="gradient-labels-wrapper">
                <div className="legend-text">
                    {top}
                </div>
                <div className="legend-text">
                    {middle}
                </div>
                <div className="legend-text">
                    {bottom}
                </div>
            </div>
        </div>
    );
}

/**
 * Legend for the different objects in the visualization.
 * @param elements Items to show in the legend. Items should have structure
 * {
 *      label: <the item's label>,
 *      block: <the item's symbol; use a ___Block component>,
 * }
 */
export function Legend({elements}) {
    return (
        <ul className="list-legend-wrapper">
            {Object.keys(elements).map((label) => (
                <LegendElement key={label}
                               block={elements[label]}
                               label={label} />
            ))}
        </ul>
    );
}

function LegendElement({ block, label }) {
    return (
        <li className="legend-item-wrapper">
            {block}
            <span className="legend-text legend-value">
                {label}
            </span>
        </li>
    );
}

/**
 * Legend symbol of a line with the given colour.
 */
export function LineBlock({ color }) {
    return (
        <span className="legend-key">
            <hr
                style={{
                    borderWidth: "1px 0 0 0",
                    borderStyle: "solid",
                    borderColor: color,
                }}
            />
        </span>
    );
}

/**
 * Legend symbol from an image.
 */
export function ImageBlock({ src, alt }) {
    return (
        <img
            className="legend-key"
            src={src}
            alt={alt}
        />
    );
}

/**
 * Legend symbol for a colour.
 */
export function ColorBlock({ color }) {
    return (
        <span
            className="legend-key"
            style={{
                backgroundColor: color ?? "white",
            }}
        />
    );
}