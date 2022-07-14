import { Html } from "@react-three/drei";
import "./styles/loading_screen.css";

/**
 * Loading screen. Covers the canvas when rendered.
 */
export function LoadingScreen() {
    return (
        <Html
            transform={false}
            fullscreen
            className="loading-screen"
        >
            <p className="loading-screen-text">
                Loading . . .
            </p>
        </Html>
    );
}