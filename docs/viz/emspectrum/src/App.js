import { MovableGif } from "./Components/MovableGif";
import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [currentImage, setCurrentImage] = useState("./images/graph_river.png")
    const [currentPixel, setCurrentPixel] = useState("./pixels/river_pixel.png")
    const [matches, setMatches] = useState(window.matchMedia("(max-width: 520px)").matches)

    // data structure that connects pixel positions to images
    const imageData = { River: {graph: "./images/graph_river.png", pixel: "./pixels/river_pixel.png"}, 
                        Road: {graph:"./images/graph_road.png", pixel: "./pixels/road_pixel.png" },
                        Mine: {graph: "./images/graph_mine.png", pixel: "./pixels/mine_pixel.png"},
                        Pond: {graph: "./images/graph_pond.png", pixel: "./pixels/pond_pixel.png"},
                        Forest: {graph: "./images/graph_forest.png", pixel: "./pixels/forest_pixel.png"},
                        Soil: {graph: "./images/graph_soil.png", pixel: "./pixels/soil_pixel.png"}
    };

    useEffect(() => {
        window.matchMedia("(max-width: 520px)").addEventListener("change", e => setMatches(e.matches));
    });

    return (                  
        <div className="main">
            {matches && 
            <><div id="error-message">
                <h5>Sorry, this visualization cannot be displayed on your device</h5>
                <h5>Please try visiting this page on a tablet, laptop, or desktop</h5>
            </div>
            <div id="textbook-link">
                <a href="https://ubc-geomatics-textbook.github.io/geomatics-textbook/fundamentals-of-remote-sensing.html#electromagnetic-spectrum">
                    Back to textbook
                </a>
            </div>
            </>}  
            
            {!matches &&          
            <><div id="gif-slider-wrapper">
                <div id="textbook-link">
                    <a href="https://ubc-geomatics-textbook.github.io/geomatics-textbook/fundamentals-of-remote-sensing.html#electromagnetic-spectrum">
                        Back to textbook
                    </a>
                </div>
                <div id="gif-pixel-legend-wrapper">
                    <img id="pixel-frame" src={currentPixel} alt="pixel frame"></img>
                    <img id="legend" src="./images/colour-legend.png" alt="colour legend for reflectance values"></img>
                    <MovableGif />
                </div>

            </div><div id="button-menu">
                    <h5 id="menu-title">Click a button below to display a pixel and its spectral graph</h5>
                    {Object.keys(imageData).map((e) => {
                        return <button
                            type="button"
                            onClick={() => {
                                setCurrentImage(imageData[e].graph);
                                setCurrentPixel(imageData[e].pixel);
                            } }>{e}
                        </button>;
                    })}
                </div>
                <div id="graph">
                    <img id="graph-image" src={currentImage} alt="spectral graph"></img>
                </div></>}          
        </div>
    );
}

export default App;