import { useState } from "react";

export default function RepairMenu({ position }) {
  const [selectedComponents, setSelectedComponents] = useState({
    roof: false,
    siding: false,
    windows: false,
    doors: false,
    gutters: false,
  });

  // Log the position to verify it's being passed correctly
  console.log("Menu Position:", position);

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
        className="fixed inset-0 bg-black opacity-45 z-50"
        onClick={() => setMenuPosition(null)} // Close menu on background click
      ></div>

      {/* Menu container */}
      <div
        className="absolute bg-white p-4 rounded-lg shadow-lg flex flex-col space-y-2 z-50"
        style={{
          left: `${position.lng + 20}px`, // Position to the right of the pin
          top: `${position.lat}px`,
        }}
      >
        <h2 className="text-lg font-bold mb-2">Select Components to Repair</h2>
        {Object.keys(selectedComponents).map((component) => (
          <label key={component} className="flex items-center space-x-2">
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