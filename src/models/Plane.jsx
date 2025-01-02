import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

import planeScene from "../assets/3d/plane.glb";

// 3D Model from: https://sketchfab.com/3d-models/stylized-ww1-plane-c4edeb0e410f46e8a4db320879f0a1db
export function Plane({ isRotating, ...props }) {
  const ref = useRef();
  // Load the 3D model and its animations
  const { scene, animations, nodes, materials } = useGLTF(planeScene);
  // Get animation actions associated with the plane
  const { actions } = useAnimations(animations, ref);

  // Use an effect to control the plane's animation based on 'isRotating'
  // Note: Animation names can be found on the Sketchfab website where the 3D model is hosted.
  useEffect(() => {
    if (isRotating) {
      actions["Main"].play();
    } else {
      actions["Main"].stop();
    }
  }, [actions, isRotating]);

  return (
    <group ref={ref} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          position={[-12.94, -3.362, -11.495]}
          rotation={[-1.495, 0, -0.258]}>
          <group name="4bbe6bcd6a0d45878e8b1c5271558302fbx" rotation={[Math.PI / 2, 3.5, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="plane" position={[0, 142.497, -101.59]}>
                  <group name="Null_1" position={[-3.791, 17.359, -154.685]}>
                    <group
                      name="xtras"
                      position={[3.791, -159.855, 256.275]}
                      rotation={[-Math.PI / 2, 0, 0]}>
                      <mesh
                        name="xtras_seats_and_stuff_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.xtras_seats_and_stuff_0.geometry}
                        material={materials.seats_and_stuff}
                      />
                    </group>
                  </group>
                  <group
                    name="xtras_2"
                    position={[0, -142.497, 101.59]}
                    rotation={[-Math.PI / 2, 0, 0]}>
                    <mesh
                      name="xtras_2_Altbody_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.xtras_2_Altbody_0.geometry}
                      material={materials.Altbody}
                    />
                    <mesh
                      name="xtras_2_interior_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.xtras_2_interior_0.geometry}
                      material={materials.interior}
                    />
                    <mesh
                      name="xtras_2_xtra_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.xtras_2_xtra_0.geometry}
                      material={materials.xtra}
                    />
                    <mesh
                      name="xtras_2_seats_and_stuff_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.xtras_2_seats_and_stuff_0.geometry}
                      material={materials.seats_and_stuff}
                    />
                    <mesh
                      name="xtras_2_windows_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.xtras_2_windows_0.geometry}
                      material={materials.windows}
                    />
                    <mesh
                      name="xtras_2_Main_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.xtras_2_Main_0.geometry}
                      material={materials.Main}
                    />
                  </group>
                  <group
                    name="halerorvert"
                    position={[0, 136.929, 484.607]}
                    rotation={[-0.022, 0, 0.015]}>
                    <group
                      name="halerorvert_2"
                      position={[0, -279.425, -383.016]}
                      rotation={[-Math.PI / 2, 0, 0]}>
                      <mesh
                        name="halerorvert_2_Altbody_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.halerorvert_2_Altbody_0.geometry}
                        material={materials.Altbody}
                      />
                    </group>
                  </group>
                  <group
                    name="haleror"
                    position={[0, 0, 421.476]}
                    rotation={[0.07, -0.001, -0.001]}>
                    <group
                      name="haleror_2"
                      position={[0, -142.497, -319.885]}
                      rotation={[-Math.PI / 2, 0, 0]}>
                      <mesh
                        name="haleror_2_Altbody_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.haleror_2_Altbody_0.geometry}
                        material={materials.Altbody}
                      />
                    </group>
                  </group>
                  <group name="frontting" position={[-1.258, 0.84, -364.598]}>
                    <group name="propelting">
                      <group
                        name="xtras_3"
                        position={[-0.07, -142.497, 466.188]}
                        rotation={[-Math.PI / 2, 0, 0]}>
                        <mesh
                          name="xtras_3_xtra_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.xtras_3_xtra_0.geometry}
                          material={materials.xtra}
                        />
                      </group>
                    </group>
                    <group
                      name="xtras_4"
                      position={[-0.07, -142.497, 466.188]}
                      rotation={[-Math.PI / 2, 0, 0]}>
                      <mesh
                        name="xtras_4_Altbody_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.xtras_4_Altbody_0.geometry}
                        material={materials.Altbody}
                      />
                      <mesh
                        name="xtras_4_xtra_0"
                        castShadow
                        receiveShadow
                        geometry={nodes.xtras_4_xtra_0.geometry}
                        material={materials.xtra}
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
  )
}
