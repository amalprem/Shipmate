import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";
import "../css/maps.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const Maps = (props) => {
  const mapContainerRef = useRef(null);
  const { latlongs } = props;

  // Initialize map when component mounts
  console.log(latlongs);
  useEffect(() => {
    console.log(latlongs);
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center:
        latlongs === [undefined, undefined]
          ? latlongs
          : [-87.629799, 41.878113],
      zoom: 9,
    });

    // latlongs.forEach((latlong) => {
    //   new mapboxgl.Marker().setLngLat(latlong).addTo(map);
    // });

    map.on("load", () => {
      setMap(map);
      map.resize();
    });

    [[-86.536659, 39.168804]].map((loc) => {
      // console.log(loc);
      new mapboxgl.Marker().setLngLat(loc).addTo(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

const Map = (props) => {
  const { latlongs } = props;
  return (
    <div>
      <Maps latlongs={latlongs}></Maps>
    </div>
  );
};

export default Map;
