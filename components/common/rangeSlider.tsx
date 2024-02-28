import useTranslation from "next-translate/useTranslation";
import React, { useState, useCallback, useRef, useEffect } from "react";

interface RangeSliderProps {
  initialMin: number;
  initialMax: number;
  min: number;
  max: number;
  onChange: (minValue: number, maxValue: number) => void;
  minGap: number;
  prefix: string;
  label: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ initialMin, initialMax, min, max, onChange, minGap, prefix, label }) => {
  const { t } = useTranslation("common");
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  const [minLimit, setMinLimit] = useState(min);
  const [maxLimit, setMaxLimit] = useState(max);
  const rangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange(minValue, maxValue);
  }, [minValue, maxValue, onChange]);

  useEffect(() => {
    setMinLimit(min);
    setMinValue(min);
    setMaxLimit(max);
    setMaxValue(max);
  }, [min, max]);

  const getRelativePosition = useCallback((x: number): number => {
    const rangeRect = rangeRef.current?.getBoundingClientRect();
    if (!rangeRect) return 0;
    const relativeX = x - rangeRect.left;
    const width = rangeRect.width;
    return Math.max(0, Math.min(relativeX / width, 1));
  }, []);

  const handleMouseDown = useCallback(
    (handle: "min" | "max") => (event: React.MouseEvent<HTMLDivElement>) => {
      const updateValue = (event: MouseEvent) => {
        const relativePosition = getRelativePosition(event.clientX);
        let newValue = Math.round(relativePosition * (maxLimit - minLimit) + minLimit);
        if (handle === "min") {
          newValue = Math.min(newValue, maxValue - minGap);
          setMinValue(newValue);
        } else {
          newValue = Math.max(newValue, minValue + minGap);
          setMaxValue(newValue);
        }
      };

      const stopUpdate = () => {
        window.removeEventListener("mousemove", updateValue);
        window.removeEventListener("mouseup", stopUpdate);
      };

      window.addEventListener("mousemove", updateValue);
      window.addEventListener("mouseup", stopUpdate);
      event.preventDefault();
    },
    [getRelativePosition, maxLimit, minLimit, maxValue, minValue, minGap]
  );

  const handleBarClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const relativePosition = getRelativePosition(event.clientX);
      const clickedValue = Math.round(relativePosition * (maxLimit - minLimit) + minLimit);
      const distanceToMin = Math.abs(minValue - clickedValue);
      const distanceToMax = Math.abs(maxValue - clickedValue);

      if (distanceToMin < distanceToMax) {
        const newValue = Math.min(clickedValue, maxValue - minGap);
        setMinValue(newValue);
      } else {
        const newValue = Math.max(clickedValue, minValue + minGap);
        setMaxValue(newValue);
      }
    },
    [getRelativePosition, maxLimit, minLimit, minValue, maxValue, minGap]
  );

  return (
    <div className="w-full py-2 flex flex-col gap-2">
      <div ref={rangeRef} className="w-full h-4 lg:h-2 bg-gray-200 rounded-md relative" onMouseDown={handleBarClick}>
        <div
          className="absolute bg-blue-500 h-4 lg:h-2 rounded-md cursor-pointer"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            left: `${((minValue - minLimit) / (maxLimit - minLimit)) * 100}%`,
            right: `${100 - ((maxValue - minLimit) / (maxLimit - minLimit)) * 100}%`,
          }}
        />
        <div
          onMouseDown={handleMouseDown("min")}
          className="absolute w-6 h-6 lg:h-3 lg:w-3 bg-blue-500 rounded-full cursor-pointer"
          style={{
            top: "50%",
            transform: "translate(-50%, -50%)",
            left: `${((minValue - minLimit) / (maxLimit - minLimit)) * 100}%`,
          }}
        />
        <div
          onMouseDown={handleMouseDown("max")}
          className="absolute w-6 h-6 lg:h-3 lg:w-3 bg-blue-500 rounded-full cursor-pointer"
          style={{
            top: "50%",
            transform: "translate(-50%, -50%)",
            left: `${((maxValue - minLimit) / (maxLimit - minLimit)) * 100}%`,
          }}
        />
      </div>
      <div className="flex flex-row justify-between">
        <p>{minValue} - {maxValue}</p>
        <button className="ml-4"
                    onClick={() => {
                      setMinValue(minLimit);
                      setMaxValue(maxLimit);
                    }}
                  >
                    {t("Remettre")}
                  </button>
      </div>
    </div>
  );
};

export default RangeSlider;
