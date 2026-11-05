import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Earth() {
  const earthRef = useRef();

  const texture = useLoader(
    TextureLoader,
    "/textures/8k_earth_nightmap.jpg"
  );

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 96, 96]} />

      <meshStandardMaterial
        map={texture}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}