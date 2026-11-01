import { Canvas } from "@react-three/fiber";

import {
  OrbitControls,
  Stars,
  Preload
} from "@react-three/drei";

import Earth from "./Earth";
import StationMarker from "./StationMarker";

export default function GlobeScene({
  stations,
  onSelectStation
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
        fov: 45
      }}
    >
      <color attach="background" args={["#03070c"]} />

      <ambientLight intensity={1.2} />

      <directionalLight
        position={[5, 3, 5]}
        intensity={2}
      />

      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        fade
      />

      <Earth />

      {validStations.map((station) => (
        <StationMarker
          key={station.stationuuid}
          station={station}
          onSelect={onSelectStation}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={9}
        enableDamping
        dampingFactor={0.05}
      />

      <Preload all />
    </Canvas>
  );
}
