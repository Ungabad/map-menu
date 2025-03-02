import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useState, useRef, useEffect } from "react";
import RepairMenu from "./RepairMenu";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 37.7749, // Default center (San Francisco)
  lng: -122.4194,
};

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geocoding"], // Add Geocoding library
  });

  const [menuPosition, setMenuPosition] = useState(null);
  const [address, setAddress] = useState(""); // State for the address
  const [center, setCenter] = useState(defaultCenter); // State for map center
  const longPressTimer = useRef(null);

  // Get the device's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude }); // Update center to device location
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch the address using Geocoding API
  const fetchAddress = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        setAddress(response.results[0].formatted_address); // Set the address
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }
  };

  // Handle long press
  const handleLongPress = (event) => {
    const latLng = event.latLng || event.touches[0].latLng;
    longPressTimer.current = setTimeout(() => {
      setMenuPosition({ lat: latLng.lat(), lng: latLng.lng() });
      fetchAddress(latLng.lat(), latLng.lng()); // Fetch address for the pinned location
    }, 500); // 0.5-second delay for long press
  };

  // Cancel long press
  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center} // Use device location as center
      zoom={15} // Zoom level for better visibility
      onClick={() => setMenuPosition(null)} // Close menu on map click
      onMouseDown={handleLongPress} // Start long press detection (mouse)
      onMouseUp={cancelLongPress} // Cancel long press detection (mouse)
      onTouchStart={handleLongPress} // Start long press detection (touch)
      onTouchEnd={cancelLongPress} // Cancel long press detection (touch)
    >
      {menuPosition && (
        <>
          <Marker position={menuPosition} />
          <RepairMenu position={menuPosition} address={address} /> {/* Pass address to RepairMenu */}
        </>
      )}
    </GoogleMap>
  ) : null;
}