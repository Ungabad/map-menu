import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useState, useRef } from "react";
import RepairMenu from "./RepairMenu";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 37.7749, // Default center (San Francisco)
  lng: -122.4194,
};

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [menuPosition, setMenuPosition] = useState(null);
  const longPressTimer = useRef(null);
  const closeMenuTimer = useRef(null);

  // Handle mouse/touch start (long press initiation)
  const handleStart = (event) => {
    // Prevent default behavior for touch events
    if (event.touches) {
      event.preventDefault();
    }

    // Get the coordinates from the event
    const latLng = event.latLng || event.touches[0].latLng;

    // Start a timer to detect a long press (0.5 seconds)
    longPressTimer.current = setTimeout(() => {
      setMenuPosition({ lat: latLng.lat(), lng: latLng.lng() });
    }, 500); // 0.5-second delay for long press
  };

  // Handle mouse/touch end (cancel long press)
  const handleEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Handle mouse/touch start for closing the menu
  const handleCloseMenuStart = (event) => {
    if (menuPosition) {
      // Start a timer to close the menu (0.3 seconds)
      closeMenuTimer.current = setTimeout(() => {
        setMenuPosition(null);
      }, 300); // 0.3-second delay to close the menu
    }
  };

  // Handle mouse/touch end for closing the menu
  const handleCloseMenuEnd = () => {
    if (closeMenuTimer.current) {
      clearTimeout(closeMenuTimer.current);
      closeMenuTimer.current = null;
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onClick={() => setMenuPosition(null)} // Close menu on map click
      onMouseDown={handleStart} // Start long press detection (mouse)
      onMouseUp={handleEnd} // Cancel long press detection (mouse)
      onTouchStart={(event) => {
        if (menuPosition) {
          handleCloseMenuStart(event); // Start close menu timer
        } else {
          handleStart(event); // Start long press timer
        }
      }}
      onTouchEnd={handleCloseMenuEnd} // Cancel close menu timer
    >
      {menuPosition && (
        <>
          <Marker position={menuPosition} />
          <RepairMenu position={menuPosition} />
        </>
      )}
    </GoogleMap>
  ) : null;
}