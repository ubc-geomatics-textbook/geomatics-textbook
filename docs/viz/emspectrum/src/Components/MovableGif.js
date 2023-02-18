import gifImage from "../Hyperion_Oil_Sands_Rainbow.gif";
import { useState } from "react";
import SuperGif from "libgif";
import { Slider } from "./Slider";
import "./styles/MovableGif.css";

export const MIN_FRAME_INDEX = 0;
export const MAX_FRAME_INDEX = 241;
export const START_FRAME_INDEX = 9;

export function MovableGif() {
    const [gif, setGif] = useState(null);    
    const [instructions, setInstructions] = useState("Please wait while images are loading...");
 
    const handleSliderChange = (sliderValue) => {
        if (gif) {            
            gif.move_to(sliderValue - 1);
        }
    };
    
    return (
        <div id="gif-wrapper">
            <img id="gif-image"
                src={gifImage}
                alt=""                
                onLoad={(event) => {                   
                    
                    const superGif = new SuperGif({ gif: event.target, 
                                                    auto_play: 1, 
                                                    progressbar_height: 10, 
                                                    progressbar_foreground_color: "#4287f5"});                    
                    superGif.load(() => {                    
                        setGif(superGif);                        
                        superGif.pause();
                        superGif.move_to(START_FRAME_INDEX);                                    
                        setInstructions("Drag the slider below to change the band and wavelength");

                    });
                }}
            />
            <h5 id="slider-instructions">{instructions}</h5>
            <Slider
                min={MIN_FRAME_INDEX + 1}
                max={MAX_FRAME_INDEX + 1}
                initialValue = {START_FRAME_INDEX + 1}
                disabled={!gif}
                handleValueChange={handleSliderChange}
            />            
        </div>
    );
}