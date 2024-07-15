import React, { useEffect, useRef } from 'react';

function loadGoogleMapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  document.head.appendChild(script);
}

function GoogleMapComponent() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Load Google Maps script
    loadGoogleMapsScript();

    // Initialize the map once the script is loaded
    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 10,
        mapId: import.meta.env.VITE_MAP_ID
      });
      
      const featureLayer = map.getFeatureLayer(google.maps.FeatureType.LOCALITY);
      featureLayer.style = (options) => {
        return {
          strokeColor: "#810FCB",
          strokeOpacity: 1.0,
          strokeWeight: 3.0,
          fillColor: "#810FCB",
          fillOpacity: 0.5,
        };
      };
    };

    // Wait for the Google Maps script to load
    const intervalId = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(intervalId);
        initMap();
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>;
}

export default GoogleMapComponent;