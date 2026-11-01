import { useState } from "react";
import { Html } from "@react-three/drei";
import { latLongToVector3 } from "./globeUtils";

export default function StationMarker({
  station,
  onSelect
}) {
  const [hovered, setHovered] = useState(false);

  const position = latLongToVector3(
    Number(station.geo_lat),
    Number(station.geo_long),
    2.025
  );

  return (
    <group position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(station);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial
          color={hovered ? "#ffffff" : "#20e889"}
        />
      </mesh>

      {hovered && (
        <Html distanceFactor={8}>
          <div className="globe-tooltip">
            {station.name}
          </div>
        </Html>
      )}
    </group>
  );
}
