import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Earth() {
  const earthRef = useRef();

  const texture = useLoader(
    TextureLoader,
    "/textures/earth.jpg"
  );

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />

      <meshStandardMaterial
        map={texture}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
