import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  Stars,
} from "@react-three/drei";

import Earth from "./Earth";
import StationMarker from "./StationMarker";

export default function GlobeScene({
  stations = [],
  onSelectStation,
  selectedId,
}) {
  const validStations = stations.filter((station) => {
    const lat = Number(station.geo_lat);
    const lon = Number(station.geo_long);

    return (
      station.geo_lat !== null &&
      station.geo_long !== null &&
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      Math.abs(lat) <= 90 &&
      Math.abs(lon) <= 180
    );
  });

  return (
    <Canvas
      camera={{
        position: [0, 0, 6],
        fov: 45,
      }}
      dpr={[1, 1.75]}
    >
      <color attach="background" args={["#050b12"]} />

      <ambientLight intensity={1.25} />

      <directionalLight
        position={[5, 3, 5]}
        intensity={2.1}
      />

      <Suspense fallback={null}>
        <Stars
          radius={90}
          depth={45}
          count={2200}
          factor={3.5}
          fade
        />

        <Earth />

        {validStations.map((station) => (
          <StationMarker
            key={station.stationuuid}
            station={station}
            selected={station.stationuuid === selectedId}
            onSelect={onSelectStation}
          />
        ))}

        <Preload all />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2.6}
        maxDistance={8}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.55}
      />
    </Canvas>
  );
}