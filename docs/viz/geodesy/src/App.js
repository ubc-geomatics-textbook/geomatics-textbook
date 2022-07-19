import React from 'react'
import { Canvas } from '@react-three/fiber'
import './styles.css'
import { CameraAlignedLight, FreeControlsWithClickDetection, SetCameraLayers, } from "./Components/ControlsAndLight";
import { Visualization } from "./Components/Visualization";
import { Stats } from "@react-three/drei";
import { Leva } from 'leva';
import { MODEL_RADIUS } from "./Constants";
import { LinkBack } from "./Components/LinkBack";

function App() {
    return (
        <>
            <Canvas
                camera={{
                    position: [MODEL_RADIUS * 2 + 0.5, 0, 0]
                }}
            >
                <SetCameraLayers/>
                <ambientLight intensity={0.15}/>

                <Visualization/>

                <CameraAlignedLight/>
                <FreeControlsWithClickDetection/>

                <Stats />
                <LinkBack url={"https://ubc-geomatics-textbook.github.io/geomatics-textbook/mapping-data.html"}/>
            </Canvas>
            <Leva hideCopyButton={true} />
        </>
    );
}

export default App;
