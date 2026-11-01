
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
} from '@react-three/drei';

const RADIUS = 2;

function StationMarkers({ stations, onSelect, selectedId }) {
  return stations.map((station) => {
    const lat = Number(station.geo_lat);
    const lon = Number(station.geo_long);

    // Convert latitude and longitude to 3D coordinates.
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;

    const position = [
      -RADIUS * Math.sin(phi) * Math.cos(theta),
      RADIUS * Math.cos(phi),
      RADIUS * Math.sin(phi) * Math.sin(theta),
    ];

    const selected = station.stationuuid === selectedId;

    return (
      <mesh
        key={station.stationuuid}
        position={position}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(station);
        }}
      >
        <sphereGeometry args={[selected ? 0.055 : 0.025, 12, 12]} />
        <meshStandardMaterial
          color={selected ? '#ffffff' : '#65e6b0'}
          emissive={selected ? '#ffffff' : '#1b9d70'}
          emissiveIntensity={selected ? 1.5 : 0.7}
        />
      </mesh>
    );
  });
}

function Earth({ stations, onSelect, selectedId }) {
  return (
    <>
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#174d69"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      <StationMarkers
        stations={stations}
        onSelect={onSelect}
        selectedId={selectedId}
      />
    </>
  );
}

export default function Globe({
  stations,
  onSelect,
  selectedId,
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      fallback={<p>Your browser cannot render the 3D globe.</p>}
    >
      <color attach="background" args={['#071116']} />

      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={2.5}
      />

      <Suspense fallback={null}>
        <Stars
          radius={80}
          depth={40}
          count={1500}
          factor={3}
          fade
        />

        <Earth
          stations={stations}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        rotateSpeed={0.6}
      />
    </Canvas>
  );
}
