import { useState } from "react";

export default function RepairMenu({ position }) {
  const [selectedComponents, setSelectedComponents] = useState({
    roof: false,
    siding: false,
    windows: false,
    doors: false,
    gutters: false,
  });

  const handleCheckboxChange = (component) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  return (
    <>
      {/* Transparent background */}
      <div
        className="fixed inset-0 bg-black opacity-45"
        style={{ zIndex: 1000 }}
      ></div>

      {/* Menu container */}
      <div
        className="absolute bg-white p-4 rounded-lg shadow-lg flex flex-col space-y-2"
        style={{
          left: `${position.lng}px`,
          top: `${position.lat}px`,
          transform: `translate(10px, -50%)`, // Position to the right of the pin
          zIndex: 1001,
        }}
      >
        <h2 className="text-lg font-bold mb-2">Select Components to Repair</h2>
        {Object.keys(selectedComponents).map((component, index) => (
          <label
            key={component}
            className="flex items-center space-x-2"
            style={{
              marginLeft: index === 0 ? "20px" : "0", // First item to the right
            }}
          >
            <input
              type="checkbox"
              checked={selectedComponents[component]}
              onChange={() => handleCheckboxChange(component)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="capitalize">{component}</span>
          </label>
        ))}
      </div>
    </>
  );
}