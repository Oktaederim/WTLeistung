import React, { useState, useEffect } from 'react';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export const InputSlider: React.FC<InputSliderProps> = ({ label, value, onChange, min, max, step, unit }) => {
  const [displayValue, setDisplayValue] = useState(value.toString());

  useEffect(() => {
    // This effect synchronizes the input field when the `value` prop changes from the outside
    // (e.g., via the slider). It won't interfere with typing because the parent `value` prop
    // only changes when `onChange` is called on blur or slider move.
    setDisplayValue(value.toString());
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow any text to be entered for flexible input.
    // The validation and parent state update happens on blur.
    setDisplayValue(e.target.value);
  };
  
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let numValue = parseFloat(e.target.value);

    if (isNaN(numValue)) {
      // If the input is not a valid number (e.g., empty or text),
      // revert to the last known good value from props.
      setDisplayValue(value.toString());
    } else {
      // Clamp the value to the defined min/max range.
      if (numValue < min) numValue = min;
      if (numValue > max) numValue = max;
      
      // Update the parent component with the valid, clamped number.
      // The useEffect will then synchronize the displayValue.
      onChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm w-48">
           <input
              type="number"
              value={displayValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-full p-2 text-right border-0 rounded-l-md focus:ring-0"
              step={step}
              min={min}
              max={max}
           />
           <span className="px-3 text-gray-500 bg-gray-50 rounded-r-md">{unit}</span>
        </div>
      </div>
    </div>
  );
};