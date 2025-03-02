import { useState } from "react";

export default function RepairMenu({ position, address }) {
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
    <div
      style={{
        position: "absolute",
        backgroundColor: "white",
        margin: "0 0 0 500",
        padding: "10px",
        border: "1px solid #ccc",
        zIndex: 1000,
      }}
    >
      <h2>Select Components to Repair</h2>
      <p>{address}</p> {/* Display the address */}
      {Object.keys(selectedComponents).map((component) => (
        <label key={component} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selectedComponents[component]}
            onChange={() => handleCheckboxChange(component)}
          />
          {component}
        </label>
      ))}
    </div>
  );
}