import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";

import birdScene from "../assets/3d/plane2.glb";

// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export function Bird(props) {
  const birdRef = useRef();

  // Load the 3D model and animations from the provided GLTF file
  const { scene, animations, nodes, materials } = useGLTF(birdScene);

  // Get access to the animations for the bird
  const { actions } = useAnimations(animations, birdRef);

  // Play the "Take 001" animation when the component mounts
  // Note: Animation names can be found on the Sketchfab website where the 3D model is hosted.
  useEffect(() => {
    actions["Take 001"].play();
  }, []);

  useFrame(({ clock, camera }) => {
    // Update the Y position to simulate bird-like motion using a sine wave
    birdRef.current.position.y = Math.sin(clock.elapsedTime) * 0.2 + 2;

    // Check if the bird reached a certain endpoint relative to the camera
    if (birdRef.current.position.x > camera.position.x + 5) {
      // Change direction to backward and rotate the bird 180 degrees on the y-axis
      birdRef.current.rotation.y = Math.PI;
    } else if (birdRef.current.position.x < camera.position.x - 5) {
      // Change direction to forward and reset the bird's rotation
      birdRef.current.rotation.y = 0;
    }

    // Update the X and Z positions based on the direction
    if (birdRef.current.rotation.y === 0) {
      // Moving forward
      birdRef.current.position.x += 0.01;
      birdRef.current.position.z -= 0.01;
    } else {
      // Moving backward
      birdRef.current.position.x -= 0.01;
      birdRef.current.position.z += 0.01;
    }
  });

  return (
    <group ref={birdRef} {...props} dispose={null} position={[0, 2, 0]} scale={[0.1, 0.1, 0.1]}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="d0719fbe20e44dd1a778a1053cb64595fbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="Main_Cntrl"
                  position={[-6307.865, -1256.072, 420.334]}
                  rotation={[0.685, 0.171, 0.136]}
                  scale={1311.637}>
                  <group name="grp_plane" rotation={[-Math.PI / 2, 0, 0]} scale={0.002}>
                    <group
                      name="glass"
                      position={[-47.567, -344.889, 158.35]}
                      rotation={[0, 0, 1.576]}
                      scale={104.741}>
                      <mesh
                        name="glass_glass1_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.glass_glass1_0.geometry}
                        material={materials.glass1}
                      />
                    </group>
                    <group
                      name="body"
                      position={[-47.567, -344.889, 158.35]}
                      rotation={[0, 0, 1.576]}
                      scale={104.741}>
                      <group name="polySurface8">
                        <mesh
                          name="polySurface8_lambert2_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.polySurface8_lambert2_0.geometry}
                          material={materials.lambert2}
                        />
                      </group>
                      <group name="transform1" />
                    </group>
                    <group
                      name="banner"
                      position={[-47.567, -344.889, 158.35]}
                      rotation={[0, 0, 1.576]}
                      scale={104.741}>
                      <mesh
                        name="banner_lambert2_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.banner_lambert2_0.geometry}
                        material={materials.lambert2}
                      />
                    </group>
                    <group
                      name="polySurface1"
                      position={[-417.479, 26.47, 195.478]}
                      rotation={[-0.025, 0, 0]}
                      scale={0.394}>
                      <mesh
                        name="polySurface1_lambert2_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.polySurface1_lambert2_0.geometry}
                        material={materials.lambert2}
                      />
                    </group>
                  </group>
                  <group
                    name="Blade"
                    position={[-0.846, 0.385, -0.051]}
                    rotation={[-1.596, 0, 0]}
                    scale={0.001}
                  />
                </group>
                <group name="Flag_Control" position={[1885.18, 791.308, -69.879]}>
                  <group name="nurbsCircle2" position={[334.179, 0, 0]} rotation={[0, -0.29, 0]}>
                    <group
                      name="nurbsCircle3"
                      position={[341.846, -3.08, 0]}
                      rotation={[-0.002, -0.031, -0.059]}>
                      <group
                        name="nurbsCircle4"
                        position={[372.612, -9.132, -13.084]}
                        rotation={[-0.013, 0.182, -0.059]}>
                        <group
                          name="nurbsCircle5"
                          position={[264.884, -3.186, 13.084]}
                          rotation={[-0.011, 0.619, -0.056]}
                        />
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
