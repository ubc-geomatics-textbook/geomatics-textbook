import { Html } from "@react-three/drei";
import "./styles/link_back.css";

export function LinkBack({ url }) {
    return (
        <Html
            calculatePosition={(el, camera, size) => [0, size.height]}
            zIndexRange={[0, 0]}
        >
            <div className="link-back" >
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    Back to textbook
                </a>
            </div>
        </Html>
    );
}