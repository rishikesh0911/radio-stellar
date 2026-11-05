import { useState } from "react";
import { Html } from "@react-three/drei";

import { latLongToVector3 } from "./globeUtils";

export default function StationMarker({
  station,
  onSelect,
  selected = false,
}) {
  const [hovered, setHovered] = useState(false);

  const position = latLongToVector3(
    Number(station.geo_lat),
    Number(station.geo_long),
    2.025
  );

  const highlighted = hovered || selected;

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
        <sphereGeometry
          args={[
            highlighted ? 0.052 : 0.026,
            16,
            16,
          ]}
        />

        <meshBasicMaterial
          color={highlighted ? "#ffffff" : "#39f5ad"}
        />
      </mesh>

      {highlighted && (
        <Html distanceFactor={8} center>
          <div className="globe-tooltip">
            {station.name}
          </div>
        </Html>
      )}
    </group>
  );
}