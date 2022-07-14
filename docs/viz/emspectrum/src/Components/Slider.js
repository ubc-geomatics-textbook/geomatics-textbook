import { useState } from "react";
import "./styles/Slider.css";

export function Slider({min, max, initialValue, disabled, handleValueChange}) {
    const [value, setValue] = useState(initialValue);

    const handleChange = (event) => {
        const newValue = event.target.value;
        if (min <= newValue <= max) {
            setValue(newValue);
            handleValueChange(newValue);
        }
    };

    return (
        <>
            <div>
                <input
                    id="slider"
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    disabled={disabled}
                    onInput={handleChange}
                />
                <table>
                    <tr>
                        <th>357</th>
                        <th id="padding">1567</th>
                        <th>2777</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>Wavelength (nm)</th>
                        <th></th>
                    </tr>
                </table>                
            </div>            
        </>
    );
}