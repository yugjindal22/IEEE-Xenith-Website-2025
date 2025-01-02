import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import skyScene from "../assets/3d/sky.glb";

// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export function Sky({ isRotating, ...props }) {
  const sky = useGLTF(skyScene);
  const skyRef = useRef();
  const { nodes, materials } = useGLTF("../src/assets/3d/sky.glb");
  // Note: Animation names can be found on the Sketchfab website where the 3D model is hosted.
  // It ensures smooth animations by making the rotation frame rate-independent.
  // 'delta' represents the time in seconds since the last frame.
  useFrame((_, delta) => {
    if (isRotating) {
      skyRef.current.rotation.y += 0.25 * delta; // Adjust the rotation speed as needed
    }
  });

  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Sphere__0.geometry}
          material={materials['Scene_-_Root']}
          rotation={[-Math.PI / 2.2, 0, 0.6]}
          scale={50000}
        />
      </group>
    </group>
  );
}
