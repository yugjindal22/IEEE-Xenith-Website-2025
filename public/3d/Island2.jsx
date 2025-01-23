import { a } from "@react-spring/three";
import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

export function Island2({
    isRotating,
    setIsRotating,
    setCurrentStage,
    currentFocusPoint,
    ...props
  })  {
    const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF("/3d/island2.glb");
  const islandRef = useRef();
  const lastX = useRef(0);
  const lastY = useRef(0); // Add ref for last Y position
  const rotationSpeed = useRef(0);
  const verticalRotation = useRef(0.1); // Set initial vertical rotation to slightly elevated
  const verticalRotationSpeed = useRef(0); // Add this for vertical movement smoothing
  const dampingFactor = 0.95;
  const VERTICAL_ROTATION_LIMIT_UP = 0.65; // Upper limit (~28.6 degrees)
  const VERTICAL_ROTATION_LIMIT_DOWN = 0.35; // Lower limit (horizon)
  const isTouchDevice = useRef('ontouchstart' in window);
  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    // Store the current clientX position for reference
    lastX.current = clientX;
    lastY.current = clientY;
  };

  // Handle pointer (mouse or touch) up event
  const handlePointerUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  // Handle pointer (mouse or touch) move event
  const handlePointerMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (isRotating) {
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const deltaX = (clientX - lastX.current) / viewport.width;
      const deltaY = (clientY - lastY.current) / viewport.height;

      // Update the island's rotation based on the mouse/touch movement
      islandRef.current.rotation.y += deltaX * 0.01 * Math.PI;
      
      // Invert the deltaY by removing the negative sign
      const newVerticalRotation = verticalRotation.current + deltaY * 0.01 * Math.PI;
      const clampedVerticalRotation = Math.max(
        VERTICAL_ROTATION_LIMIT_DOWN,
        Math.min(VERTICAL_ROTATION_LIMIT_UP, newVerticalRotation)
      );
      
      verticalRotation.current = clampedVerticalRotation;
      islandRef.current.rotation.x = clampedVerticalRotation;

      // Update the reference for the last clientX position
      lastX.current = clientX;
      lastY.current = clientY;

      // Update the rotation speed
      rotationSpeed.current = deltaX * 0.01 * Math.PI;

      // Store vertical rotation speed
      verticalRotationSpeed.current = deltaY * 0.01 * Math.PI;
    }
  };

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  // Touch events for mobile devices
  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastX.current = clientX;
    lastY.current = clientY;
  }

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }

  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = (clientX - lastX.current) / viewport.width;
      const deltaY = (clientY - lastY.current) / viewport.height;

      islandRef.current.rotation.y += deltaX * 0.01 * Math.PI;
      
      // Invert the deltaY here too
      const newVerticalRotation = verticalRotation.current + deltaY * 0.01 * Math.PI;
      const clampedVerticalRotation = Math.max(
        VERTICAL_ROTATION_LIMIT_DOWN,
        Math.min(VERTICAL_ROTATION_LIMIT_UP, newVerticalRotation)
      );
      
      verticalRotation.current = clampedVerticalRotation;
      islandRef.current.rotation.x = clampedVerticalRotation;

      lastX.current = clientX;
      lastY.current = clientY;
      rotationSpeed.current = deltaX * 0.01 * Math.PI;

      // Store vertical rotation speed
      verticalRotationSpeed.current = deltaY * 0.01 * Math.PI;
    }
  }

  useEffect(() => {
    // Add event listeners for pointer and keyboard events
    const canvas = gl.domElement;
    if(isTouchDevice.current){
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchend", handleTouchEnd);
      canvas.addEventListener("touchmove", handleTouchMove);
    }
    else{
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);}


    // Remove event listeners when component unmounts
    return () => {
      if(isTouchDevice.current){
        canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);}
      else{
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

  // This function is called on each frame update
  useFrame(() => {
    // If not rotating, apply damping to slow down the rotation (smoothly)
    if (!isRotating) {
      // Apply damping factor
      rotationSpeed.current *= dampingFactor;

      // Stop rotation when speed is very small
      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      islandRef.current.rotation.y += rotationSpeed.current;

      // Apply damping to vertical rotation
      verticalRotationSpeed.current *= dampingFactor;
      if (Math.abs(verticalRotationSpeed.current) < 0.001) {
        verticalRotationSpeed.current = 0;
      }

      // Calculate new vertical rotation
      const newVerticalRotation = verticalRotation.current + verticalRotationSpeed.current;
      
      // Clamp the vertical rotation
      verticalRotation.current = Math.max(
        VERTICAL_ROTATION_LIMIT_DOWN,
        Math.min(VERTICAL_ROTATION_LIMIT_UP, newVerticalRotation)
      );

      // Apply the vertical rotation
      islandRef.current.rotation.x = verticalRotation.current;
    } else {
      // When rotating, determine the current stage based on island's orientation
      const rotation = islandRef.current.rotation.y;

      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        // console.log(normalizedRotation);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 4.28 && normalizedRotation <= 4.65 :
          setCurrentStage(5);
          break;

        case normalizedRotation >= 3.21 && normalizedRotation <= 3.59:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 2.013 && normalizedRotation <= 2.46:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 3.84 && normalizedRotation <= 4.12:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 6.080016464779419 || normalizedRotation <= 0.38 :
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }

      // When rotating, update vertical rotation based on current speed
      const newVerticalRotation = verticalRotation.current + verticalRotationSpeed.current;
      verticalRotation.current = Math.max(
        VERTICAL_ROTATION_LIMIT_DOWN,
        Math.min(VERTICAL_ROTATION_LIMIT_UP, newVerticalRotation)
      );

      // Apply the vertical rotation
      islandRef.current.rotation.x = verticalRotation.current;
    }
  });

  return (
    <group ref={islandRef} {...props} dispose={null}>
      <group name="Scene">
        <group name="Sketchfab_model" position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="536d5e8fa83a40a8a2c8b9e4662ed387fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Enviro">
                  <group name="Axe" position={[-15.448, 2.8, 0.545]} rotation={[-1.19, 0.123, -2.844]} scale={0.396}>
                    <mesh name="Axe_Bare_Metal_0" geometry={nodes.Axe_Bare_Metal_0.geometry} material={materials.Bare_Metal} />
                    <mesh name="Axe_Wood_1_0" geometry={nodes.Axe_Wood_1_0.geometry} material={materials.Wood_1} />
                  </group>
                  <group name="Center_Snow_Mound" position={[0, -1.56, 0]} scale={2.086}>
                    <mesh name="Center_Snow_Mound_Snow_0" geometry={nodes.Center_Snow_Mound_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Ground" position={[3.732, -0.027, -17.713]} rotation={[0, -0.21, 0]} scale={12.996}>
                    <mesh name="Ground_Rock_0" geometry={nodes.Ground_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Ground_Snow_0" geometry={nodes.Ground_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Ice_Sheet" position={[0, -1, 0]}>
                    <mesh name="Ice_Sheet_phong2_0" geometry={nodes.Ice_Sheet_phong2_0.geometry} material={materials.phong2} />
                  </group>
                  <group name="Snow_Border">
                    <mesh name="Snow_Border_Snow_0" geometry={nodes.Snow_Border_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Stump" position={[-15.093, 0.459, 1.125]} scale={0.281}>
                    <mesh name="Stump_Wood_1_0" geometry={nodes.Stump_Wood_1_0.geometry} material={materials.Wood_1} />
                    <mesh name="Stump_Wood_2_0" geometry={nodes.Stump_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Wood_Stack" position={[-15.722, 0.387, 3.445]} rotation={[-Math.PI, 1.126, -Math.PI]} scale={0.493}>
                    <mesh name="Wood_Stack_Wood_1_0" geometry={nodes.Wood_Stack_Wood_1_0.geometry} material={materials.Wood_1} />
                    <mesh name="Wood_Stack_Wood_2_0" geometry={nodes.Wood_Stack_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                </group>
                <group name="Houses">
                  <group name="House_1" position={[-2.409, -0.494, -0.507]} rotation={[0, -0.167, 0]}>
                    <group name="Smoke_Group_1" position={[2.46, 0.494, 0.1]} rotation={[0, 0.167, 0]}>
                      <group name="Smoke2" position={[5.854, 7.305, -18.794]} rotation={[1.322, -0.043, -0.565]} scale={0.485} />
                      <group name="Smoke3" position={[5.272, 5.96, -18.794]} rotation={[0.317, 1.174, -0.163]} scale={0.558} />
                      <mesh name="Smoke_Group_1_lambert1_0" geometry={nodes.Smoke_Group_1_lambert1_0.geometry} material={materials.lambert1} />
                    </group>
                    <mesh name="House_1_Brass_0" geometry={nodes.House_1_Brass_0.geometry} material={materials.Brass} />
                    <mesh name="House_1_Brick_1_0" geometry={nodes.House_1_Brick_1_0.geometry} material={materials.Brick_1} />
                    <mesh name="House_1_Brick_2_0" geometry={nodes.House_1_Brick_2_0.geometry} material={materials.Brick_2} />
                    <mesh name="House_1_phong2_0" geometry={nodes.House_1_phong2_0.geometry} material={materials.phong2} />
                    <mesh name="House_1_Snow_0" geometry={nodes.House_1_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="House_1_Window_Light_0" geometry={nodes.House_1_Window_Light_0.geometry} material={materials.Window_Light} />
                    <mesh name="House_1_Wood_1_0" geometry={nodes.House_1_Wood_1_0.geometry} material={materials.Wood_1} />
                    <mesh name="House_1_Wood_2_0" geometry={nodes.House_1_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="House_2" position={[6.773, 0, -7.625]} rotation={[0, 0.598, 0]}>
                    <group name="Chrimah_Lights" position={[-9.264, 2.77, -14.779]}>
                      <mesh name="Chrimah_Lights_Bulb_Blue_0" geometry={nodes.Chrimah_Lights_Bulb_Blue_0.geometry} material={materials.Bulb_Blue} />
                      <mesh name="Chrimah_Lights_Bulb_Green1_0" geometry={nodes.Chrimah_Lights_Bulb_Green1_0.geometry} material={materials.Bulb_Green1} />
                      <mesh name="Chrimah_Lights_Bulb_Green_0" geometry={nodes.Chrimah_Lights_Bulb_Green_0.geometry} material={materials.Bulb_Green} />
                      <mesh name="Chrimah_Lights_Bulb_red_0" geometry={nodes.Chrimah_Lights_Bulb_red_0.geometry} material={materials.Bulb_red} />
                      <mesh name="Chrimah_Lights_Bulb_Yeller1_0" geometry={nodes.Chrimah_Lights_Bulb_Yeller1_0.geometry} material={materials.Bulb_Yeller1} />
                      <mesh name="Chrimah_Lights_Bulb_Yeller_0" geometry={nodes.Chrimah_Lights_Bulb_Yeller_0.geometry} material={materials.Bulb_Yeller} />
                      <mesh name="Chrimah_Lights_Cable_0" geometry={nodes.Chrimah_Lights_Cable_0.geometry} material={materials.Cable} />
                      <mesh name="Chrimah_Lights_Lamp_Metal_0" geometry={nodes.Chrimah_Lights_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    </group>
                    <group name="Chrimah_Lights1" position={[-9.264, -2.502, -14.779]} />
                    <group name="Reef_1" position={[-10.347, 0.947, -9.216]} scale={0.187}>
                      <mesh name="Reef_1_Brass_0" geometry={nodes.Reef_1_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="Reef_1_Deco1_0" geometry={nodes.Reef_1_Deco1_0.geometry} material={materials.Deco1} />
                      <mesh name="Reef_1_Deco2_0" geometry={nodes.Reef_1_Deco2_0.geometry} material={materials.Deco2} />
                      <mesh name="Reef_1_Deco3_0" geometry={nodes.Reef_1_Deco3_0.geometry} material={materials.Deco3} />
                      <mesh name="Reef_1_Deco4_0" geometry={nodes.Reef_1_Deco4_0.geometry} material={materials.Deco4} />
                      <mesh name="Reef_1_Tree_1_0" geometry={nodes.Reef_1_Tree_1_0.geometry} material={materials.Tree_1} />
                      <mesh name="Reef_1_Wood_1_0" geometry={nodes.Reef_1_Wood_1_0.geometry} material={materials.Wood_1} />
                    </group>
                    <mesh name="House_2_Brass_0" geometry={nodes.House_2_Brass_0.geometry} material={materials.Brass} />
                    <mesh name="House_2_Brick_1_0" geometry={nodes.House_2_Brick_1_0.geometry} material={materials.Brick_1} />
                    <mesh name="House_2_Brick_2_0" geometry={nodes.House_2_Brick_2_0.geometry} material={materials.Brick_2} />
                    <mesh name="House_2_phong2_0" geometry={nodes.House_2_phong2_0.geometry} material={materials.phong2} />
                    <mesh name="House_2_Snow_0" geometry={nodes.House_2_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="House_2_Window_Light_0" geometry={nodes.House_2_Window_Light_0.geometry} material={materials.Window_Light} />
                    <mesh name="House_2_Wood_1_0" geometry={nodes.House_2_Wood_1_0.geometry} material={materials.Wood_1} />
                    <mesh name="House_2_Wood_2_0" geometry={nodes.House_2_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="House_3" position={[-8.862, 0, -2.87]} rotation={[-Math.PI, 0.581, -Math.PI]}>
                    <group name="Smoke_Group_3" position={[-13.277, -0.266, -35.297]} rotation={[Math.PI, -0.581, Math.PI]}>
                      <group name="Smoke4001" position={[5.213, 5.778, -18.794]} rotation={[-0.931, -1.324, 2.043]} scale={0.509} />
                      <group name="Smoke6001" position={[5.754, 7.114, -18.794]} rotation={[1.188, 0.386, 0.579]} scale={0.558} />
                      <mesh name="Smoke_Group_3_lambert1_0" geometry={nodes.Smoke_Group_3_lambert1_0.geometry} material={materials.lambert1} />
                    </group>
                    <mesh name="House_3_Brass_0" geometry={nodes.House_3_Brass_0.geometry} material={materials.Brass} />
                    <mesh name="House_3_Brick_1_0" geometry={nodes.House_3_Brick_1_0.geometry} material={materials.Brick_1} />
                    <mesh name="House_3_Brick_2_0" geometry={nodes.House_3_Brick_2_0.geometry} material={materials.Brick_2} />
                    <mesh name="House_3_phong2_0" geometry={nodes.House_3_phong2_0.geometry} material={materials.phong2} />
                    <mesh name="House_3_Snow_0" geometry={nodes.House_3_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="House_3_Window_Light_0" geometry={nodes.House_3_Window_Light_0.geometry} material={materials.Window_Light} />
                    <mesh name="House_3_Wood_1_0" geometry={nodes.House_3_Wood_1_0.geometry} material={materials.Wood_1} />
                    <mesh name="House_3_Wood_2_0" geometry={nodes.House_3_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="House_4" position={[-6.077, 0, -18.745]} rotation={[0, 1.28, 0]}>
                    <group name="Fence" position={[-16.211, 0, 11.203]} rotation={[0, -1.28, 0]}>
                      <mesh name="Fence_Snow_0" geometry={nodes.Fence_Snow_0.geometry} material={materials.Snow} />
                      <mesh name="Fence_Wood_1_0" geometry={nodes.Fence_Wood_1_0.geometry} material={materials.Wood_1} />
                    </group>
                    <group name="Smoke_Group_2" position={[-37.344, -0.394, -6.104]} rotation={[0, -1.28, 0]}>
                      <group name="Smoke4" position={[5.556, 6.695, -18.794]} rotation={[0.457, 1.078, 1.551]} scale={0.656} />
                      <group name="Smoke5" position={[5.103, 5.315, -18.794]} rotation={[2.906, -1.269, 0.457]} scale={0.364} />
                      <group name="Smoke6" position={[6.213, 7.953, -18.794]} rotation={[1.528, 0.421, 1.617]} scale={0.157} />
                      <mesh name="Smoke_Group_2_lambert1_0" geometry={nodes.Smoke_Group_2_lambert1_0.geometry} material={materials.lambert1} />
                    </group>
                    <mesh name="House_4_Brass_0" geometry={nodes.House_4_Brass_0.geometry} material={materials.Brass} />
                    <mesh name="House_4_Brick_1_0" geometry={nodes.House_4_Brick_1_0.geometry} material={materials.Brick_1} />
                    <mesh name="House_4_Brick_2_0" geometry={nodes.House_4_Brick_2_0.geometry} material={materials.Brick_2} />
                    <mesh name="House_4_Lamp_Metal_0" geometry={nodes.House_4_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    <mesh name="House_4_phong2_0" geometry={nodes.House_4_phong2_0.geometry} material={materials.phong2} />
                    <mesh name="House_4_Snow_0" geometry={nodes.House_4_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="House_4_Window_Light_0" geometry={nodes.House_4_Window_Light_0.geometry} material={materials.Window_Light} />
                    <mesh name="House_4_Wood_1_0" geometry={nodes.House_4_Wood_1_0.geometry} material={materials.Wood_1} />
                    <mesh name="House_4_Wood_2_0" geometry={nodes.House_4_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="House_5" position={[-4.72, 0, -5.936]} rotation={[0, 0.464, 0]}>
                    <group name="Chrimah_Lights_3" position={[-15.842, 2.779, 6.733]} rotation={[0, 1.571, 0]}>
                      <mesh name="Chrimah_Lights_3_Bulb_Blue_0" geometry={nodes.Chrimah_Lights_3_Bulb_Blue_0.geometry} material={materials.Bulb_Blue} />
                      <mesh name="Chrimah_Lights_3_Bulb_Green1_0" geometry={nodes.Chrimah_Lights_3_Bulb_Green1_0.geometry} material={materials.Bulb_Green1} />
                      <mesh name="Chrimah_Lights_3_Bulb_Green_0" geometry={nodes.Chrimah_Lights_3_Bulb_Green_0.geometry} material={materials.Bulb_Green} />
                      <mesh name="Chrimah_Lights_3_Bulb_red_0" geometry={nodes.Chrimah_Lights_3_Bulb_red_0.geometry} material={materials.Bulb_red} />
                      <mesh name="Chrimah_Lights_3_Bulb_Yeller1_0" geometry={nodes.Chrimah_Lights_3_Bulb_Yeller1_0.geometry} material={materials.Bulb_Yeller1} />
                      <mesh name="Chrimah_Lights_3_Cable_0" geometry={nodes.Chrimah_Lights_3_Cable_0.geometry} material={materials.Cable} />
                      <mesh name="Chrimah_Lights_3_Lamp_Metal_0" geometry={nodes.Chrimah_Lights_3_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    </group>
                    <group name="Reef_2" position={[-10.222, 0.947, 6.702]} rotation={[0, 1.571, 0]} scale={0.187}>
                      <mesh name="Reef_2_Brass_0" geometry={nodes.Reef_2_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="Reef_2_Deco1_0" geometry={nodes.Reef_2_Deco1_0.geometry} material={materials.Deco1} />
                      <mesh name="Reef_2_Deco2_0" geometry={nodes.Reef_2_Deco2_0.geometry} material={materials.Deco2} />
                      <mesh name="Reef_2_Deco3_0" geometry={nodes.Reef_2_Deco3_0.geometry} material={materials.Deco3} />
                      <mesh name="Reef_2_Deco4_0" geometry={nodes.Reef_2_Deco4_0.geometry} material={materials.Deco4} />
                      <mesh name="Reef_2_Tree_1_0" geometry={nodes.Reef_2_Tree_1_0.geometry} material={materials.Tree_1} />
                      <mesh name="Reef_2_Wood_1_0" geometry={nodes.Reef_2_Wood_1_0.geometry} material={materials.Wood_1} />
                    </group>
                    <mesh name="House_5_Brass_0" geometry={nodes.House_5_Brass_0.geometry} material={materials.Brass} />
                    <mesh name="House_5_Brick_1_0" geometry={nodes.House_5_Brick_1_0.geometry} material={materials.Brick_1} />
                    <mesh name="House_5_Brick_2_0" geometry={nodes.House_5_Brick_2_0.geometry} material={materials.Brick_2} />
                    <mesh name="House_5_phong2_0" geometry={nodes.House_5_phong2_0.geometry} material={materials.phong2} />
                    <mesh name="House_5_Rock_0" geometry={nodes.House_5_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="House_5_Snow_0" geometry={nodes.House_5_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="House_5_Stone_2_0" geometry={nodes.House_5_Stone_2_0.geometry} material={materials.Stone_2} />
                    <mesh name="House_5_Window_Light_0" geometry={nodes.House_5_Window_Light_0.geometry} material={materials.Window_Light} />
                    <mesh name="House_5_Wood_1_0" geometry={nodes.House_5_Wood_1_0.geometry} material={materials.Wood_1} />
                    <mesh name="House_5_Wood_2_0" geometry={nodes.House_5_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="house_6" position={[-5.629, 0, 4.166]} rotation={[-Math.PI, 1.15, -Math.PI]}>
                    <group name="Chrimah_Lights_2" position={[-15.819, 2.779, 6.721]} rotation={[0, -Math.PI / 2, 0]}>
                      <mesh name="Chrimah_Lights_2_Bulb_Blue_0" geometry={nodes.Chrimah_Lights_2_Bulb_Blue_0.geometry} material={materials.Bulb_Blue} />
                      <mesh name="Chrimah_Lights_2_Bulb_Green1_0" geometry={nodes.Chrimah_Lights_2_Bulb_Green1_0.geometry} material={materials.Bulb_Green1} />
                      <mesh name="Chrimah_Lights_2_Bulb_Green_0" geometry={nodes.Chrimah_Lights_2_Bulb_Green_0.geometry} material={materials.Bulb_Green} />
                      <mesh name="Chrimah_Lights_2_Bulb_red_0" geometry={nodes.Chrimah_Lights_2_Bulb_red_0.geometry} material={materials.Bulb_red} />
                      <mesh name="Chrimah_Lights_2_Bulb_Yeller1_0" geometry={nodes.Chrimah_Lights_2_Bulb_Yeller1_0.geometry} material={materials.Bulb_Yeller1} />
                      <mesh name="Chrimah_Lights_2_Bulb_Yeller_0" geometry={nodes.Chrimah_Lights_2_Bulb_Yeller_0.geometry} material={materials.Bulb_Yeller} />
                      <mesh name="Chrimah_Lights_2_Cable_0" geometry={nodes.Chrimah_Lights_2_Cable_0.geometry} material={materials.Cable} />
                      <mesh name="Chrimah_Lights_2_Lamp_Metal_0" geometry={nodes.Chrimah_Lights_2_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    </group>
                    <mesh name="house_6_Brass_0" geometry={nodes.house_6_Brass_0.geometry} material={materials.Brass} />
                    <mesh name="house_6_Brick_1_0" geometry={nodes.house_6_Brick_1_0.geometry} material={materials.Brick_1} />
                    <mesh name="house_6_Brick_2_0" geometry={nodes.house_6_Brick_2_0.geometry} material={materials.Brick_2} />
                    <mesh name="house_6_phong2_0" geometry={nodes.house_6_phong2_0.geometry} material={materials.phong2} />
                    <mesh name="house_6_Rock_0" geometry={nodes.house_6_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="house_6_Snow_0" geometry={nodes.house_6_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="house_6_Stone_2_0" geometry={nodes.house_6_Stone_2_0.geometry} material={materials.Stone_2} />
                    <mesh name="house_6_Window_Light_0" geometry={nodes.house_6_Window_Light_0.geometry} material={materials.Window_Light} />
                    <mesh name="house_6_Wood_1_0" geometry={nodes.house_6_Wood_1_0.geometry} material={materials.Wood_1} />
                    <mesh name="house_6_Wood_2_0" geometry={nodes.house_6_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="House_7" position={[0, -0.344, 0]}>
                    <group name="Chrimah_Lights_10" position={[19.871, 2.725, -1.808]}>
                      <mesh name="Chrimah_Lights_10_Bulb_Blue_0" geometry={nodes.Chrimah_Lights_10_Bulb_Blue_0.geometry} material={materials.Bulb_Blue} />
                      <mesh name="Chrimah_Lights_10_Bulb_Green1_0" geometry={nodes.Chrimah_Lights_10_Bulb_Green1_0.geometry} material={materials.Bulb_Green1} />
                      <mesh name="Chrimah_Lights_10_Bulb_Green_0" geometry={nodes.Chrimah_Lights_10_Bulb_Green_0.geometry} material={materials.Bulb_Green} />
                      <mesh name="Chrimah_Lights_10_Bulb_red_0" geometry={nodes.Chrimah_Lights_10_Bulb_red_0.geometry} material={materials.Bulb_red} />
                      <mesh name="Chrimah_Lights_10_Bulb_Yeller1_0" geometry={nodes.Chrimah_Lights_10_Bulb_Yeller1_0.geometry} material={materials.Bulb_Yeller1} />
                      <mesh name="Chrimah_Lights_10_Bulb_Yeller_0" geometry={nodes.Chrimah_Lights_10_Bulb_Yeller_0.geometry} material={materials.Bulb_Yeller} />
                      <mesh name="Chrimah_Lights_10_Cable_0" geometry={nodes.Chrimah_Lights_10_Cable_0.geometry} material={materials.Cable} />
                      <mesh name="Chrimah_Lights_10_Lamp_Metal_0" geometry={nodes.Chrimah_Lights_10_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    </group>
                    <group name="Reef_3" position={[13.666, 1.323, 1.545]} rotation={[0, -1.571, 0]} scale={0.187}>
                      <mesh name="Reef_3_Brass_0" geometry={nodes.Reef_3_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="Reef_3_Deco1_0" geometry={nodes.Reef_3_Deco1_0.geometry} material={materials.Deco1} />
                      <mesh name="Reef_3_Deco2_0" geometry={nodes.Reef_3_Deco2_0.geometry} material={materials.Deco2} />
                      <mesh name="Reef_3_Deco3_0" geometry={nodes.Reef_3_Deco3_0.geometry} material={materials.Deco3} />
                      <mesh name="Reef_3_Deco4_0" geometry={nodes.Reef_3_Deco4_0.geometry} material={materials.Deco4} />
                      <mesh name="Reef_3_Tree_1_0" geometry={nodes.Reef_3_Tree_1_0.geometry} material={materials.Tree_1} />
                      <mesh name="Reef_3_Wood_1_0" geometry={nodes.Reef_3_Wood_1_0.geometry} material={materials.Wood_1} />
                    </group>
                    <mesh name="House_7_Brass_0" geometry={nodes.House_7_Brass_0.geometry} material={materials.Brass} />
                    <mesh name="House_7_Brick_1_0" geometry={nodes.House_7_Brick_1_0.geometry} material={materials.Brick_1} />
                    <mesh name="House_7_Brick_2_0" geometry={nodes.House_7_Brick_2_0.geometry} material={materials.Brick_2} />
                    <mesh name="House_7_phong2_0" geometry={nodes.House_7_phong2_0.geometry} material={materials.phong2} />
                    <mesh name="House_7_Snow_0" geometry={nodes.House_7_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="House_7_Window_Light_0" geometry={nodes.House_7_Window_Light_0.geometry} material={materials.Window_Light} />
                    <mesh name="House_7_Wood_1_0" geometry={nodes.House_7_Wood_1_0.geometry} material={materials.Wood_1} />
                    <mesh name="House_7_Wood_2_0" geometry={nodes.House_7_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                </group>
                <group name="Lamps">
                  <group name="Lamp">
                    <mesh name="Lamp_Lamp_Metal_0" geometry={nodes.Lamp_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    <mesh name="Lamp_Window_Light_0" geometry={nodes.Lamp_Window_Light_0.geometry} material={materials.Window_Light} />
                  </group>
                  <group name="Lamp1" position={[2.831, 0, -9.288]} rotation={[0, 1.416, 0]}>
                    <mesh name="Lamp1_Lamp_Metal_0" geometry={nodes.Lamp1_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    <mesh name="Lamp1_Window_Light_0" geometry={nodes.Lamp1_Window_Light_0.geometry} material={materials.Window_Light} />
                  </group>
                  <group name="Lamp2" position={[-3.14, 0, 9.383]} rotation={[0, 0.694, 0]}>
                    <mesh name="Lamp2_Lamp_Metal_0" geometry={nodes.Lamp2_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    <mesh name="Lamp2_Window_Light_0" geometry={nodes.Lamp2_Window_Light_0.geometry} material={materials.Window_Light} />
                  </group>
                  <group name="Lamp3" position={[4.046, 0, 9.348]} rotation={[0, 1.38, 0]}>
                    <mesh name="Lamp3_Lamp_Metal_0" geometry={nodes.Lamp3_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    <mesh name="Lamp3_Window_Light_0" geometry={nodes.Lamp3_Window_Light_0.geometry} material={materials.Window_Light} />
                  </group>
                  <group name="Lamp4" position={[4.319, 0, 1.985]} rotation={[-Math.PI, 0.81, -Math.PI]}>
                    <mesh name="Lamp4_Lamp_Metal_0" geometry={nodes.Lamp4_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    <mesh name="Lamp4_Window_Light_0" geometry={nodes.Lamp4_Window_Light_0.geometry} material={materials.Window_Light} />
                  </group>
                  <group name="Lamp5" position={[11.232, 0, 2.275]} rotation={[-Math.PI, 0.81, -Math.PI]}>
                    <mesh name="Lamp5_Lamp_Metal_0" geometry={nodes.Lamp5_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    <mesh name="Lamp5_Window_Light_0" geometry={nodes.Lamp5_Window_Light_0.geometry} material={materials.Window_Light} />
                  </group>
                  <group name="Lamp6" position={[18.133, 0, -1.56]} rotation={[-Math.PI, 0.81, -Math.PI]}>
                    <mesh name="Lamp6_Lamp_Metal_0" geometry={nodes.Lamp6_Lamp_Metal_0.geometry} material={materials.Lamp_Metal} />
                    <mesh name="Lamp6_Window_Light_0" geometry={nodes.Lamp6_Window_Light_0.geometry} material={materials.Window_Light} />
                  </group>
                </group>
                <group name="Main_Chrimah_Tree" position={[27.308, 0.14, 19.148]} rotation={[0, 1.363, 0]} scale={1.48}>
                  <group name="Bulbs" position={[8.614, 0.34, -17.979]} rotation={[0, -0.765, 0]} scale={0.216}>
                    <group name="polySurface176" position={[3.787, 4.31, 3.851]} rotation={[-0.484, 0.564, 0.171]}>
                      <mesh name="polySurface176_Brass_0" geometry={nodes.polySurface176_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface176_Deco1_0" geometry={nodes.polySurface176_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface177" position={[-5.481, 3.672, 6.627]} rotation={[-0.164, 0.139, -0.075]}>
                      <mesh name="polySurface177_Brass_0" geometry={nodes.polySurface177_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface177_Deco2_0" geometry={nodes.polySurface177_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface178" position={[3.866, -2.46, -1.41]} rotation={[0.355, 0.509, 0.392]}>
                      <mesh name="polySurface178_Brass_0" geometry={nodes.polySurface178_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface178_Deco3_0" geometry={nodes.polySurface178_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface179" position={[-3.948, 1.694, 8.112]} rotation={[-0.132, 0.044, 0.173]}>
                      <mesh name="polySurface179_Brass_0" geometry={nodes.polySurface179_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface179_Deco4_0" geometry={nodes.polySurface179_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface180" position={[5.82, -5.281, -5.291]} rotation={[1.456, 1.028, -1.722]}>
                      <mesh name="polySurface180_Brass_0" geometry={nodes.polySurface180_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface180_Deco3_0" geometry={nodes.polySurface180_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface181" position={[-1.87, 2.785, 3.612]} rotation={[-0.132, 0.044, 0.173]}>
                      <mesh name="polySurface181_Brass_0" geometry={nodes.polySurface181_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface181_Deco4_0" geometry={nodes.polySurface181_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface182" position={[1.72, 4.31, -2.488]} rotation={[-0.484, 0.564, 0.171]}>
                      <mesh name="polySurface182_Brass_0" geometry={nodes.polySurface182_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface182_Deco1_0" geometry={nodes.polySurface182_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface183" position={[-3.667, -9.293, -9.332]} rotation={[1.127, 0.253, -0.144]}>
                      <mesh name="polySurface183_Brass_0" geometry={nodes.polySurface183_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface183_Deco2_0" geometry={nodes.polySurface183_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface184" position={[-6.225, 2.785, -0.092]} rotation={[-0.132, 0.044, 0.173]}>
                      <mesh name="polySurface184_Brass_0" geometry={nodes.polySurface184_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface184_Deco4_0" geometry={nodes.polySurface184_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface185" position={[-12.886, -8.151, -7.785]} rotation={[0.901, -0.418, 0.307]}>
                      <mesh name="polySurface185_Brass_0" geometry={nodes.polySurface185_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface185_Deco3_0" geometry={nodes.polySurface185_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface186" position={[0.91, -0.599, -2.194]} rotation={[0.355, 0.509, 0.392]}>
                      <mesh name="polySurface186_Brass_0" geometry={nodes.polySurface186_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface186_Deco3_0" geometry={nodes.polySurface186_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface187" position={[-8.69, 1.501, 7.725]} rotation={[-0.132, 0.044, 0.173]}>
                      <mesh name="polySurface187_Brass_0" geometry={nodes.polySurface187_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface187_Deco4_0" geometry={nodes.polySurface187_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface188" position={[4.332, -0.88, -1.33]} rotation={[0.442, 1.472, -1.039]}>
                      <mesh name="polySurface188_Brass_0" geometry={nodes.polySurface188_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface188_Deco1_0" geometry={nodes.polySurface188_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface189" position={[-5.239, -8.472, -9.606]} rotation={[1.929, 0.36, -2.694]}>
                      <mesh name="polySurface189_Brass_0" geometry={nodes.polySurface189_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface189_Deco3_0" geometry={nodes.polySurface189_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface190" position={[-8.969, 4.722, 5.485]} rotation={[-0.223, 0.287, -0.247]}>
                      <mesh name="polySurface190_Brass_0" geometry={nodes.polySurface190_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface190_Deco2_0" geometry={nodes.polySurface190_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface191" position={[-0.174, -3.067, -6.743]} rotation={[0.957, 1.381, -0.909]}>
                      <mesh name="polySurface191_Brass_0" geometry={nodes.polySurface191_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface191_Deco1_0" geometry={nodes.polySurface191_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface192" position={[-1.91, -3.591, -20.799]} rotation={[2.674, 1.031, -2.054]}>
                      <mesh name="polySurface192_Brass_0" geometry={nodes.polySurface192_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface192_Deco1_0" geometry={nodes.polySurface192_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface193" position={[-7.724, -8.814, -14.345]} rotation={[1.929, 0.36, -2.694]}>
                      <mesh name="polySurface193_Brass_0" geometry={nodes.polySurface193_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface193_Deco3_0" geometry={nodes.polySurface193_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface194" position={[-0.25, -3.867, -16.591]} rotation={[2.255, 1.023, -1.718]}>
                      <mesh name="polySurface194_Brass_0" geometry={nodes.polySurface194_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface194_Deco2_0" geometry={nodes.polySurface194_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface195" position={[-6.214, -5.909, -2.333]} rotation={[0.553, 0.647, -0.904]}>
                      <mesh name="polySurface195_Brass_0" geometry={nodes.polySurface195_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface195_Deco4_0" geometry={nodes.polySurface195_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface196" position={[-3.642, 13.115, 4.09]} rotation={[-0.644, 0.515, -0.148]}>
                      <mesh name="polySurface196_Brass_0" geometry={nodes.polySurface196_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface196_Deco2_0" geometry={nodes.polySurface196_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface197" position={[0.766, 4.644, -2.495]} rotation={[-0.246, 1.21, -0.589]}>
                      <mesh name="polySurface197_Brass_0" geometry={nodes.polySurface197_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface197_Deco4_0" geometry={nodes.polySurface197_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface198" position={[-14.943, -5.98, -7.031]} rotation={[1.737, -0.32, -3.037]}>
                      <mesh name="polySurface198_Brass_0" geometry={nodes.polySurface198_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface198_Deco3_0" geometry={nodes.polySurface198_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface199" position={[1.281, 8.9, 4.377]} rotation={[-0.484, 0.564, 0.171]}>
                      <mesh name="polySurface199_Brass_0" geometry={nodes.polySurface199_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface199_Deco1_0" geometry={nodes.polySurface199_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface200" position={[6.814, 4.746, -4.405]} rotation={[-0.246, 1.21, -0.589]}>
                      <mesh name="polySurface200_Brass_0" geometry={nodes.polySurface200_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface200_Deco4_0" geometry={nodes.polySurface200_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface201" position={[-8.324, -6.348, -9.424]} rotation={[1.737, -0.32, -3.037]}>
                      <mesh name="polySurface201_Brass_0" geometry={nodes.polySurface201_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface201_Deco3_0" geometry={nodes.polySurface201_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface202" position={[3.239, 8.13, 0.278]} rotation={[-0.484, 0.564, 0.171]}>
                      <mesh name="polySurface202_Brass_0" geometry={nodes.polySurface202_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface202_Deco1_0" geometry={nodes.polySurface202_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface203" position={[0.175, 10.929, 5.346]} rotation={[-0.644, 0.515, -0.148]}>
                      <mesh name="polySurface203_Brass_0" geometry={nodes.polySurface203_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface203_Deco2_0" geometry={nodes.polySurface203_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface204" position={[3.243, 2.908, -18.899]} rotation={[2.908, 0.503, 1.995]}>
                      <mesh name="polySurface204_Brass_0" geometry={nodes.polySurface204_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface204_Deco4_0" geometry={nodes.polySurface204_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface205" position={[-5.383, 8.091, -26.575]} rotation={[-2.905, 0.156, 3.047]}>
                      <mesh name="polySurface205_Brass_0" geometry={nodes.polySurface205_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface205_Deco3_0" geometry={nodes.polySurface205_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface206" position={[2.937, 2.638, -7.384]} rotation={[0.379, 0.929, 0.2]}>
                      <mesh name="polySurface206_Brass_0" geometry={nodes.polySurface206_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface206_Deco4_0" geometry={nodes.polySurface206_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface207" position={[-13.581, -2.756, -2.444]} rotation={[0.462, -0.04, -0.521]}>
                      <mesh name="polySurface207_Brass_0" geometry={nodes.polySurface207_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface207_Deco1_0" geometry={nodes.polySurface207_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface208" position={[-4.948, -0.944, -2.304]} rotation={[0.342, 0.166, -0.175]}>
                      <mesh name="polySurface208_Brass_0" geometry={nodes.polySurface208_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface208_Deco2_0" geometry={nodes.polySurface208_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface209" position={[-5.086, 13.115, -0.073]} rotation={[-0.644, 0.515, -0.148]}>
                      <mesh name="polySurface209_Brass_0" geometry={nodes.polySurface209_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface209_Deco2_0" geometry={nodes.polySurface209_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface210" position={[-22.15, -1.655, -10.745]} rotation={[1.729, -1.012, 1.967]}>
                      <mesh name="polySurface210_Brass_0" geometry={nodes.polySurface210_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface210_Deco3_0" geometry={nodes.polySurface210_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface211" position={[1.061, 0.836, -14.396]} rotation={[2.908, 0.503, 1.995]}>
                      <mesh name="polySurface211_Brass_0" geometry={nodes.polySurface211_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface211_Deco4_0" geometry={nodes.polySurface211_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface212" position={[-2.212, -0.707, -14.839]} rotation={[2.908, 0.503, 1.995]}>
                      <mesh name="polySurface212_Brass_0" geometry={nodes.polySurface212_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface212_Deco4_0" geometry={nodes.polySurface212_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface213" position={[-2.212, 12.49, 3.931]} rotation={[-0.484, 0.564, 0.171]}>
                      <mesh name="polySurface213_Brass_0" geometry={nodes.polySurface213_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface213_Deco1_0" geometry={nodes.polySurface213_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface214" position={[-12.051, -2.637, -6.49]} rotation={[1.737, -0.32, -3.037]}>
                      <mesh name="polySurface214_Brass_0" geometry={nodes.polySurface214_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface214_Deco3_0" geometry={nodes.polySurface214_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface215" position={[-0.493, 2.856, -12.061]} rotation={[2.258, 0.939, -2.476]}>
                      <mesh name="polySurface215_Brass_0" geometry={nodes.polySurface215_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface215_Deco2_0" geometry={nodes.polySurface215_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface216" position={[8.44, 5.768, -5.423]} rotation={[0.463, 1.482, -0.977]}>
                      <mesh name="polySurface216_Brass_0" geometry={nodes.polySurface216_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface216_Deco1_0" geometry={nodes.polySurface216_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface217" position={[7.507, 11.159, -5.314]} rotation={[-0.852, 1.296, 0.734]}>
                      <mesh name="polySurface217_Brass_0" geometry={nodes.polySurface217_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface217_Deco2_0" geometry={nodes.polySurface217_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface218" position={[6.371, 15.583, -12.136]} rotation={[-1.297, 0.918, 1.59]}>
                      <mesh name="polySurface218_Brass_0" geometry={nodes.polySurface218_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface218_Deco4_0" geometry={nodes.polySurface218_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface219" position={[-8.699, 5.165, -24.539]} rotation={[2.846, 0.009, 3.116]}>
                      <mesh name="polySurface219_Brass_0" geometry={nodes.polySurface219_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface219_Deco3_0" geometry={nodes.polySurface219_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface220" position={[1.036, 1.749, -19.969]} rotation={[2.528, 0.509, -2.883]}>
                      <mesh name="polySurface220_Brass_0" geometry={nodes.polySurface220_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface220_Deco3_0" geometry={nodes.polySurface220_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface221" position={[-7.002, 3.558, -0.695]} rotation={[0.22, 0.383, -0.507]}>
                      <mesh name="polySurface221_Brass_0" geometry={nodes.polySurface221_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface221_Deco1_0" geometry={nodes.polySurface221_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface222" position={[-0.324, 1.772, -9.622]} rotation={[1.082, 0.951, -0.646]}>
                      <mesh name="polySurface222_Brass_0" geometry={nodes.polySurface222_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface222_Deco4_0" geometry={nodes.polySurface222_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface223" position={[0.385, 8.349, -13.679]} rotation={[2.589, 0.835, 3.137]}>
                      <mesh name="polySurface223_Brass_0" geometry={nodes.polySurface223_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface223_Deco2_0" geometry={nodes.polySurface223_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface224" position={[-17.955, 16.121, -21.38]} rotation={[-2.742, -0.306, -2.532]}>
                      <mesh name="polySurface224_Brass_0" geometry={nodes.polySurface224_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface224_Deco4_0" geometry={nodes.polySurface224_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface225" position={[-17.517, 4.816, -5.282]} rotation={[0.902, -0.677, 0.58]}>
                      <mesh name="polySurface225_Brass_0" geometry={nodes.polySurface225_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface225_Deco3_0" geometry={nodes.polySurface225_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface226" position={[3.667, 9.855, -3.386]} rotation={[0.463, 1.482, -0.977]}>
                      <mesh name="polySurface226_Brass_0" geometry={nodes.polySurface226_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface226_Deco1_0" geometry={nodes.polySurface226_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface227" position={[-12.851, 4.255, -0.654]} rotation={[1.018, -0.633, 1.237]}>
                      <mesh name="polySurface227_Brass_0" geometry={nodes.polySurface227_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface227_Deco3_0" geometry={nodes.polySurface227_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface228" position={[-0.894, 2.422, -15.176]} rotation={[2.457, 0.308, 2.795]}>
                      <mesh name="polySurface228_Brass_0" geometry={nodes.polySurface228_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface228_Deco4_0" geometry={nodes.polySurface228_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface229" position={[7.557, 19.083, -10.415]} rotation={[-2.075, 0.979, 1.67]}>
                      <mesh name="polySurface229_Brass_0" geometry={nodes.polySurface229_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface229_Deco2_0" geometry={nodes.polySurface229_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface230" position={[7.125, 16.462, -5.56]} rotation={[-0.897, 0.842, 0.989]}>
                      <mesh name="polySurface230_Brass_0" geometry={nodes.polySurface230_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface230_Deco1_0" geometry={nodes.polySurface230_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface231" position={[-13.082, 2.091, -18.371]} rotation={[2.144, -0.542, 2.246]}>
                      <mesh name="polySurface231_Brass_0" geometry={nodes.polySurface231_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface231_Deco3_0" geometry={nodes.polySurface231_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface232" position={[3.264, 9.688, -9.814]} rotation={[0.882, 1.386, -0.709]}>
                      <mesh name="polySurface232_Brass_0" geometry={nodes.polySurface232_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface232_Deco2_0" geometry={nodes.polySurface232_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface233" position={[-14.595, 8.294, -3.114]} rotation={[0.305, -0.788, -0.062]}>
                      <mesh name="polySurface233_Brass_0" geometry={nodes.polySurface233_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface233_Deco4_0" geometry={nodes.polySurface233_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface234" position={[-11.956, 5.846, -7.64]} rotation={[1.346, -0.577, 1.528]}>
                      <mesh name="polySurface234_Brass_0" geometry={nodes.polySurface234_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface234_Deco3_0" geometry={nodes.polySurface234_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface235" position={[-0.877, 12.909, -19.557]} rotation={[2.847, 0.499, 2.903]}>
                      <mesh name="polySurface235_Brass_0" geometry={nodes.polySurface235_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface235_Deco4_0" geometry={nodes.polySurface235_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface236" position={[-6.828, 11.561, -19.287]} rotation={[2.772, -0.024, 2.818]}>
                      <mesh name="polySurface236_Brass_0" geometry={nodes.polySurface236_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface236_Deco2_0" geometry={nodes.polySurface236_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface237" position={[6.88, 17.049, -4.545]} rotation={[-1.017, 1.323, 0.494]}>
                      <mesh name="polySurface237_Brass_0" geometry={nodes.polySurface237_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface237_Deco1_0" geometry={nodes.polySurface237_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface238" position={[2.284, 13.368, -2.359]} rotation={[-0.05, 0.735, 0.192]}>
                      <mesh name="polySurface238_Brass_0" geometry={nodes.polySurface238_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface238_Deco1_0" geometry={nodes.polySurface238_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface239" position={[-2.77, 16.485, -23.419]} rotation={[-2.991, 0.513, 3.011]}>
                      <mesh name="polySurface239_Brass_0" geometry={nodes.polySurface239_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface239_Deco4_0" geometry={nodes.polySurface239_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface240" position={[-6.643, 21.36, -23.474]} rotation={[-2.833, 0.025, -3.07]}>
                      <mesh name="polySurface240_Brass_0" geometry={nodes.polySurface240_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface240_Deco2_0" geometry={nodes.polySurface240_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface241" position={[1.201, 12.412, -21.081]} rotation={[2.981, 0.286, 2.59]}>
                      <mesh name="polySurface241_Brass_0" geometry={nodes.polySurface241_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface241_Deco2_0" geometry={nodes.polySurface241_Deco2_0.geometry} material={materials.Deco2} />
                    </group>
                    <group name="polySurface242" position={[-12.681, 4.533, -3.932]} rotation={[1.346, -0.577, 1.528]}>
                      <mesh name="polySurface242_Brass_0" geometry={nodes.polySurface242_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface242_Deco3_0" geometry={nodes.polySurface242_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                    <group name="polySurface243" position={[-10.136, 17.157, -22.261]} rotation={[-3.088, -0.007, -3.098]}>
                      <mesh name="polySurface243_Brass_0" geometry={nodes.polySurface243_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface243_Deco4_0" geometry={nodes.polySurface243_Deco4_0.geometry} material={materials.Deco4} />
                    </group>
                    <group name="polySurface244" position={[-3.093, 11.552, 2.535]} rotation={[0.067, 0.641, -0.197]}>
                      <mesh name="polySurface244_Brass_0" geometry={nodes.polySurface244_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface244_Deco1_0" geometry={nodes.polySurface244_Deco1_0.geometry} material={materials.Deco1} />
                    </group>
                    <group name="polySurface245" position={[-19.975, 8.201, -7.034]} rotation={[1.112, -0.972, 1.2]}>
                      <mesh name="polySurface245_Brass_0" geometry={nodes.polySurface245_Brass_0.geometry} material={materials.Brass} />
                      <mesh name="polySurface245_Deco3_0" geometry={nodes.polySurface245_Deco3_0.geometry} material={materials.Deco3} />
                    </group>
                  </group>
                  <group name="Chrimas_Star" position={[7.803, -0.094, -20.514]} rotation={[0, -1.363, 0]} scale={0.676} />
                  <group name="Star" position={[16.575, -5.106, -22.221]} rotation={[-1.227, -1.011, 0.4]} scale={[0.206, 0.268, 0.206]} />
                  <group name="Tinsel" position={[8.814, 1.07, -20.649]} rotation={[Math.PI, -1.551, Math.PI]} scale={0.026}>
                    <mesh name="Tinsel_blinn1_0" geometry={nodes.Tinsel_blinn1_0.geometry} material={materials.blinn1} />
                  </group>
                  <group name="Tinsel1" position={[8.851, 1.793, -20.594]} rotation={[Math.PI, -1.551, Math.PI]} scale={0.026}>
                    <mesh name="Tinsel1_blinn1_0" geometry={nodes.Tinsel1_blinn1_0.geometry} material={materials.blinn1} />
                  </group>
                  <group name="Tinsel2" position={[8.814, 2.557, -20.649]} rotation={[Math.PI, -1.551, Math.PI]} scale={0.026}>
                    <mesh name="Tinsel2_blinn1_0" geometry={nodes.Tinsel2_blinn1_0.geometry} material={materials.blinn1} />
                  </group>
                  <group name="Tinsel3" position={[8.791, 3.215, -20.646]} rotation={[Math.PI, -1.506, Math.PI]} scale={0.026}>
                    <mesh name="Tinsel3_blinn1_0" geometry={nodes.Tinsel3_blinn1_0.geometry} material={materials.blinn1} />
                  </group>
                  <group name="Tinsel4" position={[8.819, 4.055, -20.626]} rotation={[Math.PI, -1.551, Math.PI]} scale={0.026}>
                    <mesh name="Tinsel4_blinn1_0" geometry={nodes.Tinsel4_blinn1_0.geometry} material={materials.blinn1} />
                  </group>
                  <mesh name="Main_Chrimah_Tree_Snow_0" geometry={nodes.Main_Chrimah_Tree_Snow_0.geometry} material={materials.Snow} />
                  <mesh name="Main_Chrimah_Tree_Wood_2_0" geometry={nodes.Main_Chrimah_Tree_Wood_2_0.geometry} material={materials.Wood_2} />
                </group>
                <group name="Presents">
                  <group name="Bow_10" position={[-1.999, 0.201, 3.718]} rotation={[0, 0, 0.402]} scale={0.623}>
                    <mesh name="Bow_10_Ribbon_white_0" geometry={nodes.Bow_10_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Bow_10_Wrapping_Purple_0" geometry={nodes.Bow_10_Wrapping_Purple_0.geometry} material={materials.Wrapping_Purple} />
                  </group>
                  <group name="Bow_11" position={[1.348, 0.08, 1.877]} rotation={[0.084, -0.08, -0.22]} scale={0.623}>
                    <mesh name="Bow_11_Ribbon_white_0" geometry={nodes.Bow_11_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Bow_11_Wrapping_Green_0" geometry={nodes.Bow_11_Wrapping_Green_0.geometry} material={materials.Wrapping_Green} />
                  </group>
                  <group name="Bow_12" position={[0.936, 0.417, 1.306]} rotation={[-0.049, -0.048, -0.106]} scale={0.519}>
                    <mesh name="Bow_12_Ribbon_white_0" geometry={nodes.Bow_12_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Bow_12_Wrapping_Purple_0" geometry={nodes.Bow_12_Wrapping_Purple_0.geometry} material={materials.Wrapping_Purple} />
                  </group>
                  <group name="Bow_13" position={[-1.633, 0.092, 3]} rotation={[0.052, -0.203, 0.022]} scale={0.623}>
                    <mesh name="Bow_13_Ribbon_white_0" geometry={nodes.Bow_13_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Bow_13_Wrapping_Green_0" geometry={nodes.Bow_13_Wrapping_Green_0.geometry} material={materials.Wrapping_Green} />
                  </group>
                  <group name="Bow_14" position={[-0.412, 0.752, 1.201]} rotation={[-0.189, 0.111, 0.384]} scale={0.4}>
                    <mesh name="Bow_14_Ribbon_white_0" geometry={nodes.Bow_14_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Bow_14_Wrapping_Green_0" geometry={nodes.Bow_14_Wrapping_Green_0.geometry} material={materials.Wrapping_Green} />
                  </group>
                  <group name="Bow_15" position={[1.833, 0.108, 3.15]} rotation={[0, 0.827, 0]} scale={0.458}>
                    <mesh name="Bow_15_Ribbon_white_0" geometry={nodes.Bow_15_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Bow_15_Wrapping_Purple_0" geometry={nodes.Bow_15_Wrapping_Purple_0.geometry} material={materials.Wrapping_Purple} />
                  </group>
                  <group name="Bow_6" position={[0.125, 0.169, -0.025]} rotation={[-0.036, -0.032, -0.068]} scale={0.623}>
                    <mesh name="Bow_6_Ribbon_white_0" geometry={nodes.Bow_6_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Bow_6_Wrapping_Green_0" geometry={nodes.Bow_6_Wrapping_Green_0.geometry} material={materials.Wrapping_Green} />
                  </group>
                  <group name="Bow_8" position={[-0.689, 0.047, 0.366]} rotation={[0.185, 1.288, -0.249]} scale={0.623}>
                    <mesh name="Bow_8_Ribbon_white_0" geometry={nodes.Bow_8_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Bow_8_Wrapping_Blue_0" geometry={nodes.Bow_8_Wrapping_Blue_0.geometry} material={materials.Wrapping_Blue} />
                  </group>
                  <group name="Present_10" position={[1.221, 0.051, 1.895]} rotation={[-0.01, -0.161, -0.382]} scale={0.623}>
                    <mesh name="Present_10_Ribbon_white_0" geometry={nodes.Present_10_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Present_10_Wrapping_Blue_0" geometry={nodes.Present_10_Wrapping_Blue_0.geometry} material={materials.Wrapping_Blue} />
                  </group>
                  <group name="Present_6" position={[1.427, 0.187, 0.017]} rotation={[0, 0.71, 0]} scale={0.623}>
                    <mesh name="Present_6_Ribbon_white_0" geometry={nodes.Present_6_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Present_6_Wrapping_Red_0" geometry={nodes.Present_6_Wrapping_Red_0.geometry} material={materials.Wrapping_Red} />
                  </group>
                  <group name="Present_7" position={[0.442, 0.304, 1.241]} rotation={[0.199, -0.074, -0.165]} scale={0.623}>
                    <mesh name="Present_7_Ribbon_white_0" geometry={nodes.Present_7_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Present_7_Wrapping_Red_0" geometry={nodes.Present_7_Wrapping_Red_0.geometry} material={materials.Wrapping_Red} />
                  </group>
                  <group name="Present_8" position={[0.041, 0.308, -0.458]} rotation={[-0.09, 0.055, -0.015]} scale={0.623}>
                    <mesh name="Present_8_Ribbon_white_0" geometry={nodes.Present_8_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Present_8_Wrapping_Blue_0" geometry={nodes.Present_8_Wrapping_Blue_0.geometry} material={materials.Wrapping_Blue} />
                  </group>
                  <group name="Present_9" position={[-1.687, 0.177, -0.955]} rotation={[0, -0.353, 0]} scale={0.623}>
                    <mesh name="Present_9_Ribbon_white_0" geometry={nodes.Present_9_Ribbon_white_0.geometry} material={materials.Ribbon_white} />
                    <mesh name="Present_9_Wrapping_Red_0" geometry={nodes.Present_9_Wrapping_Red_0.geometry} material={materials.Wrapping_Red} />
                  </group>
                </group>
                <group name="Rocks">
                  <group name="Rock1" position={[3.15, -0.47, -2.376]} rotation={[0.05, 0.262, -0.045]} scale={0.923}>
                    <mesh name="Rock1_Rock_0" geometry={nodes.Rock1_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock1_Snow_0" geometry={nodes.Rock1_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock10" position={[5.849, 0.091, -11.081]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock10_Rock_0" geometry={nodes.Rock10_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock10_Snow_0" geometry={nodes.Rock10_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock11" position={[8.124, -0.506, -2.492]} rotation={[0.056, 0.544, -0.061]} scale={0.985}>
                    <mesh name="Rock11_Rock_0" geometry={nodes.Rock11_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock11_Snow_0" geometry={nodes.Rock11_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock12" position={[-10.386, -0.47, -2.815]} rotation={[0.05, 0.262, -0.045]} scale={0.923}>
                    <mesh name="Rock12_Rock_0" geometry={nodes.Rock12_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock12_Snow_0" geometry={nodes.Rock12_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock13" position={[-15.294, -0.145, -3.337]} rotation={[0.043, -0.08, -0.087]} scale={0.923}>
                    <mesh name="Rock13_Rock_0" geometry={nodes.Rock13_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock13_Snow_0" geometry={nodes.Rock13_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock14" position={[-11.352, 0.307, -7.374]} rotation={[-0.042, 0, 0]} scale={0.676}>
                    <mesh name="Rock14_Rock_0" geometry={nodes.Rock14_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock14_Snow_0" geometry={nodes.Rock14_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock15" position={[-4.512, -0.696, -9.974]} rotation={[2.298, 1.412, -2.113]} scale={0.22}>
                    <mesh name="Rock15_Rock_0" geometry={nodes.Rock15_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock15_Snow_0" geometry={nodes.Rock15_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock16" position={[-6.906, -0.586, -7.324]} rotation={[0.215, 0.631, -0.124]} scale={0.22}>
                    <mesh name="Rock16_Rock_0" geometry={nodes.Rock16_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock16_Snow_0" geometry={nodes.Rock16_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock17" position={[-4.978, 0.113, -8.955]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock17_Rock_0" geometry={nodes.Rock17_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock17_Snow_0" geometry={nodes.Rock17_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock18" position={[-18.214, -0.881, 25.98]} rotation={[0.056, 0.544, -0.061]} scale={1.613}>
                    <mesh name="Rock18_Rock_0" geometry={nodes.Rock18_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock18_Snow_0" geometry={nodes.Rock18_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock19" position={[-25.487, -1.712, 21.998]} rotation={[0.064, 0.207, 0.043]} scale={1.323}>
                    <mesh name="Rock19_Rock_0" geometry={nodes.Rock19_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock19_Snow_0" geometry={nodes.Rock19_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock2" position={[2.397, 0.399, -8.172]} rotation={[-0.042, 0, 0]} scale={0.676}>
                    <mesh name="Rock2_Rock_0" geometry={nodes.Rock2_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock2_Snow_0" geometry={nodes.Rock2_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock20" position={[-18.164, -0.567, 21.996]} rotation={[0.056, 0.544, -0.061]} scale={1.087}>
                    <mesh name="Rock20_Rock_0" geometry={nodes.Rock20_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock20_Snow_0" geometry={nodes.Rock20_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock21" position={[-12.446, 0.209, 2.892]} rotation={[0.026, 0.545, -0.053]} scale={1.087}>
                    <mesh name="Rock21_Rock_0" geometry={nodes.Rock21_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock21_Snow_0" geometry={nodes.Rock21_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock22" position={[-1.928, -0.087, 1.307]} rotation={[0.036, 0.539, -0.057]} scale={1.269}>
                    <mesh name="Rock22_Rock_0" geometry={nodes.Rock22_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock22_Snow_0" geometry={nodes.Rock22_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock23" position={[-4.983, -0.881, 45.705]} rotation={[0.056, 0.544, -0.061]} scale={1.613}>
                    <mesh name="Rock23_Rock_0" geometry={nodes.Rock23_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock23_Snow_0" geometry={nodes.Rock23_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock24" position={[-4.174, -3.46, 47.458]} rotation={[0.153, 0.544, -0.061]} scale={1.613}>
                    <mesh name="Rock24_Rock_0" geometry={nodes.Rock24_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock24_Snow_0" geometry={nodes.Rock24_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock25" position={[-3.745, -3.835, 46.308]} rotation={[0.153, 0.544, -0.061]} scale={1.613}>
                    <mesh name="Rock25_Rock_0" geometry={nodes.Rock25_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock25_Snow_0" geometry={nodes.Rock25_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock26" position={[-10.476, 0.223, -2.063]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock26_Rock_0" geometry={nodes.Rock26_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock26_Snow_0" geometry={nodes.Rock26_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock27" position={[-10.113, -0.587, -1.546]} rotation={[2.298, 1.412, -2.113]} scale={0.22}>
                    <mesh name="Rock27_Rock_0" geometry={nodes.Rock27_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock27_Snow_0" geometry={nodes.Rock27_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock28" position={[-12.602, -0.529, 0.214]} rotation={[0.215, 0.631, -0.124]} scale={0.22}>
                    <mesh name="Rock28_Rock_0" geometry={nodes.Rock28_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock28_Snow_0" geometry={nodes.Rock28_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock29" position={[-10.72, 0.223, -1.449]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock29_Rock_0" geometry={nodes.Rock29_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock29_Snow_0" geometry={nodes.Rock29_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock30" position={[-9.747, 0.223, 7.516]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock30_Rock_0" geometry={nodes.Rock30_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock30_Snow_0" geometry={nodes.Rock30_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock31" position={[-9.14, -0.587, 7.42]} rotation={[2.298, 1.412, -2.113]} scale={0.22}>
                    <mesh name="Rock31_Rock_0" geometry={nodes.Rock31_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock31_Snow_0" geometry={nodes.Rock31_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock32" position={[-11.629, -0.529, 9.179]} rotation={[0.215, 0.631, -0.124]} scale={0.22}>
                    <mesh name="Rock32_Rock_0" geometry={nodes.Rock32_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock32_Snow_0" geometry={nodes.Rock32_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock33" position={[-9.502, 0.223, 6.903]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock33_Rock_0" geometry={nodes.Rock33_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock33_Snow_0" geometry={nodes.Rock33_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock34" position={[-3.423, 0.223, 14.231]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock34_Rock_0" geometry={nodes.Rock34_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock34_Snow_0" geometry={nodes.Rock34_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock35" position={[-2.47, -0.663, 14.078]} rotation={[2.298, 1.412, -2.113]} scale={0.22}>
                    <mesh name="Rock35_Rock_0" geometry={nodes.Rock35_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock35_Snow_0" geometry={nodes.Rock35_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock36" position={[-5.305, -0.529, 15.894]} rotation={[0.215, 0.631, -0.124]} scale={0.22}>
                    <mesh name="Rock36_Rock_0" geometry={nodes.Rock36_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock36_Snow_0" geometry={nodes.Rock36_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock37" position={[-3.179, 0.223, 13.618]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock37_Rock_0" geometry={nodes.Rock37_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock37_Snow_0" geometry={nodes.Rock37_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock38" position={[9.572, -0.663, 14.417]} rotation={[2.298, 1.412, -2.113]} scale={0.22}>
                    <mesh name="Rock38_Rock_0" geometry={nodes.Rock38_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock38_Snow_0" geometry={nodes.Rock38_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock39" position={[8.619, 0.223, 14.57]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock39_Rock_0" geometry={nodes.Rock39_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock39_Snow_0" geometry={nodes.Rock39_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock4" position={[-7.673, -0.054, -4.957]}>
                    <mesh name="Rock4_Rock_0" geometry={nodes.Rock4_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock4_Snow_0" geometry={nodes.Rock4_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock40" position={[8.863, 0.223, 13.957]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock40_Rock_0" geometry={nodes.Rock40_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock40_Snow_0" geometry={nodes.Rock40_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock41" position={[1.398, -1.332, 43.393]} rotation={[0.056, 0.544, -0.061]} scale={1.613}>
                    <mesh name="Rock41_Rock_0" geometry={nodes.Rock41_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock41_Snow_0" geometry={nodes.Rock41_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock43" position={[16.246, -0.529, 5.12]} rotation={[0.215, 0.631, -0.124]} scale={0.22}>
                    <mesh name="Rock43_Rock_0" geometry={nodes.Rock43_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock43_Snow_0" geometry={nodes.Rock43_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock44" position={[19.081, -0.663, 3.304]} rotation={[2.298, 1.412, -2.113]} scale={0.22}>
                    <mesh name="Rock44_Rock_0" geometry={nodes.Rock44_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock44_Snow_0" geometry={nodes.Rock44_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock45" position={[18.128, 0.223, 3.457]} rotation={[3.052, 1.517, Math.PI]} scale={0.22}>
                    <mesh name="Rock45_Rock_0" geometry={nodes.Rock45_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock45_Snow_0" geometry={nodes.Rock45_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock46" position={[14.966, 0.223, -1.768]} rotation={[3.137, 0.052, 3.053]} scale={0.22}>
                    <mesh name="Rock46_Rock_0" geometry={nodes.Rock46_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock46_Snow_0" geometry={nodes.Rock46_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock48" position={[15.456, -0.663, -1.128]} rotation={[3.023, -0.001, -2.951]} scale={0.22}>
                    <mesh name="Rock48_Rock_0" geometry={nodes.Rock48_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock48_Snow_0" geometry={nodes.Rock48_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock49" position={[14.722, 0.223, -1.155]} rotation={[3.137, 0.052, 3.053]} scale={0.22}>
                    <mesh name="Rock49_Rock_0" geometry={nodes.Rock49_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock49_Snow_0" geometry={nodes.Rock49_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock5" position={[-5.407, 0.399, -9.031]} rotation={[-0.042, 0, 0]} scale={0.676}>
                    <mesh name="Rock5_Rock_0" geometry={nodes.Rock5_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock5_Snow_0" geometry={nodes.Rock5_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock50" position={[12.178, 0.223, -3.731]} rotation={[3.136, -0.666, 3.049]} scale={0.22}>
                    <mesh name="Rock50_Rock_0" geometry={nodes.Rock50_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock50_Snow_0" geometry={nodes.Rock50_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock51" position={[17.259, -0.529, -1.904]} rotation={[2.96, 0.311, -3.082]} scale={0.22}>
                    <mesh name="Rock51_Rock_0" geometry={nodes.Rock51_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock51_Snow_0" geometry={nodes.Rock51_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock52" position={[13.116, -0.663, -2.334]} rotation={[2.985, -0.712, -3.054]} scale={0.22}>
                    <mesh name="Rock52_Rock_0" geometry={nodes.Rock52_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock52_Snow_0" geometry={nodes.Rock52_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock53" position={[12.209, 0.223, -2.914]} rotation={[3.136, -0.666, 3.049]} scale={0.22}>
                    <mesh name="Rock53_Rock_0" geometry={nodes.Rock53_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock53_Snow_0" geometry={nodes.Rock53_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock54" position={[18.955, -0.881, 22.494]} rotation={[0.056, 0.544, -0.061]} scale={1.613}>
                    <mesh name="Rock54_Rock_0" geometry={nodes.Rock54_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock54_Snow_0" geometry={nodes.Rock54_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock55" position={[14.884, -0.799, 14.455]} rotation={[0.034, 0.457, -0.013]} scale={1.195}>
                    <mesh name="Rock55_Rock_0" geometry={nodes.Rock55_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock55_Snow_0" geometry={nodes.Rock55_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock56" position={[16.592, 1.063, 5.574]} rotation={[-0.043, 0.428, -0.132]} scale={0.558}>
                    <mesh name="Rock56_Rock_0" geometry={nodes.Rock56_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock56_Snow_0" geometry={nodes.Rock56_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock6" position={[-8.897, -1.968, -4.128]} rotation={[0, 0, 0.252]}>
                    <mesh name="Rock6_Rock_0" geometry={nodes.Rock6_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock6_Snow_0" geometry={nodes.Rock6_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock7" position={[-11.938, 0.399, -14.278]} rotation={[-0.048, -0.535, -0.025]} scale={0.676}>
                    <mesh name="Rock7_Rock_0" geometry={nodes.Rock7_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock7_Snow_0" geometry={nodes.Rock7_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock8" position={[3.488, -0.053, -9.556]} rotation={[0, 0.562, 0]} scale={0.22}>
                    <mesh name="Rock8_Rock_0" geometry={nodes.Rock8_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock8_Snow_0" geometry={nodes.Rock8_Snow_0.geometry} material={materials.Snow} />
                  </group>
                  <group name="Rock9" position={[5.982, -0.053, -12.033]} rotation={[-Math.PI, 1.517, -Math.PI]} scale={0.22}>
                    <mesh name="Rock9_Rock_0" geometry={nodes.Rock9_Rock_0.geometry} material={materials.Rock} />
                    <mesh name="Rock9_Snow_0" geometry={nodes.Rock9_Snow_0.geometry} material={materials.Snow} />
                  </group>
                </group>
                <group name="Smoke_Group_4" position={[17.321, 0.18, 12.734]}>
                  <group name="Smoke4002" position={[5.213, 5.778, -18.794]} rotation={[-0.931, -1.324, 2.043]} scale={0.509} />
                  <mesh name="Smoke_Group_4_lambert1_0" geometry={nodes.Smoke_Group_4_lambert1_0.geometry} material={materials.lambert1} />
                </group>
                <group name="Trees">
                  <group name="Tree">
                    <mesh name="Tree_Snow_0" geometry={nodes.Tree_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree_Tree_1_0" geometry={nodes.Tree_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree_Wood_2_0" geometry={nodes.Tree_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree10" position={[16.071, 0, 0.595]} rotation={[0, 0.732, 0]}>
                    <mesh name="Tree10_Snow_0" geometry={nodes.Tree10_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree10_Tree_1_0" geometry={nodes.Tree10_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree10_Wood_2_0" geometry={nodes.Tree10_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree102" position={[-7.473, 0.42, 20.995]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree102_Snow_0" geometry={nodes.Tree102_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree102_Tree_1_0" geometry={nodes.Tree102_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree102_Wood_2_0" geometry={nodes.Tree102_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree104" position={[4.309, 0.157, 7.809]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree104_Snow_0" geometry={nodes.Tree104_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree104_Tree_1_0" geometry={nodes.Tree104_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree104_Wood_2_0" geometry={nodes.Tree104_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree106" position={[-4.681, -0.663, 22.286]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree106_Snow_0" geometry={nodes.Tree106_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree106_Tree_1_0" geometry={nodes.Tree106_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree106_Wood_2_0" geometry={nodes.Tree106_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree107" position={[-1.305, 0.664, 5.742]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree107_Snow_0" geometry={nodes.Tree107_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree107_Tree_1_0" geometry={nodes.Tree107_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree107_Wood_2_0" geometry={nodes.Tree107_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree108" position={[-13.011, 0.995, 22.954]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree108_Snow_0" geometry={nodes.Tree108_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree108_Tree_1_0" geometry={nodes.Tree108_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree108_Wood_2_0" geometry={nodes.Tree108_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree109" position={[3.201, 0.157, -3.303]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree109_Snow_0" geometry={nodes.Tree109_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree109_Tree_1_0" geometry={nodes.Tree109_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree109_Wood_2_0" geometry={nodes.Tree109_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree112" position={[0.168, -0.251, 28.603]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree112_Snow_0" geometry={nodes.Tree112_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree112_Tree_1_0" geometry={nodes.Tree112_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree112_Wood_2_0" geometry={nodes.Tree112_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree114" position={[8.682, -0.38, 18.313]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree114_Snow_0" geometry={nodes.Tree114_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree114_Tree_1_0" geometry={nodes.Tree114_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree114_Wood_2_0" geometry={nodes.Tree114_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree119" position={[-6.547, 0.101, 34.411]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree119_Snow_0" geometry={nodes.Tree119_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree119_Tree_1_0" geometry={nodes.Tree119_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree119_Wood_2_0" geometry={nodes.Tree119_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree120" position={[-7.879, 0.251, 29.089]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree120_Snow_0" geometry={nodes.Tree120_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree120_Tree_1_0" geometry={nodes.Tree120_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree120_Wood_2_0" geometry={nodes.Tree120_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree124" position={[10.12, -0.297, 41.563]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree124_Snow_0" geometry={nodes.Tree124_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree124_Tree_1_0" geometry={nodes.Tree124_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree124_Wood_2_0" geometry={nodes.Tree124_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree125" position={[18.897, 0.157, 27.904]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree125_Snow_0" geometry={nodes.Tree125_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree125_Tree_1_0" geometry={nodes.Tree125_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree125_Wood_2_0" geometry={nodes.Tree125_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree127" position={[18.245, 0.269, 25.67]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree127_Snow_0" geometry={nodes.Tree127_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree127_Tree_1_0" geometry={nodes.Tree127_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree127_Wood_2_0" geometry={nodes.Tree127_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree13" position={[10.053, 0.157, -13.874]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree13_Snow_0" geometry={nodes.Tree13_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree13_Tree_1_0" geometry={nodes.Tree13_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree13_Wood_2_0" geometry={nodes.Tree13_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree131" position={[8.248, -0.109, 37.688]} rotation={[0, 0.981, 0]}>
                    <mesh name="Tree131_Snow_0" geometry={nodes.Tree131_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree131_Tree_1_0" geometry={nodes.Tree131_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree131_Wood_2_0" geometry={nodes.Tree131_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree133" position={[-12.86, 1.054, 44.118]} rotation={[0, -0.197, 0]}>
                    <mesh name="Tree133_Snow_0" geometry={nodes.Tree133_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree133_Tree_1_0" geometry={nodes.Tree133_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree133_Wood_2_0" geometry={nodes.Tree133_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree137" position={[1.947, 2.66, 41.145]} rotation={[0, 0.536, 0]}>
                    <mesh name="Tree137_Snow_0" geometry={nodes.Tree137_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree137_Tree_1_0" geometry={nodes.Tree137_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree137_Wood_2_0" geometry={nodes.Tree137_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree138" position={[-14.467, 0.449, -12.7]} rotation={[-Math.PI, 0.227, -Math.PI]}>
                    <mesh name="Tree138_Snow_0" geometry={nodes.Tree138_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree138_Tree_1_0" geometry={nodes.Tree138_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree138_Wood_2_0" geometry={nodes.Tree138_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree140" position={[33.45, 0, -32.743]} rotation={[-Math.PI, 0.483, -Math.PI]}>
                    <mesh name="Tree140_Snow_0" geometry={nodes.Tree140_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree140_Tree_1_0" geometry={nodes.Tree140_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree140_Wood_2_0" geometry={nodes.Tree140_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree141" position={[28.106, 0, -30.719]} rotation={[-Math.PI, 0.483, -Math.PI]}>
                    <mesh name="Tree141_Snow_0" geometry={nodes.Tree141_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree141_Tree_1_0" geometry={nodes.Tree141_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree141_Wood_2_0" geometry={nodes.Tree141_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree142" position={[35.056, 0, -19.005]} rotation={[-Math.PI, 1.215, -Math.PI]}>
                    <mesh name="Tree142_Snow_0" geometry={nodes.Tree142_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree142_Tree_1_0" geometry={nodes.Tree142_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree142_Wood_2_0" geometry={nodes.Tree142_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree143" position={[24.015, 0, -34.167]} rotation={[-Math.PI, 0.483, -Math.PI]}>
                    <mesh name="Tree143_Snow_0" geometry={nodes.Tree143_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree143_Tree_1_0" geometry={nodes.Tree143_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree143_Wood_2_0" geometry={nodes.Tree143_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree144" position={[5.461, -0.379, -40.927]} rotation={[Math.PI, -0.902, Math.PI]}>
                    <mesh name="Tree144_Snow_0" geometry={nodes.Tree144_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree144_Tree_1_0" geometry={nodes.Tree144_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree144_Wood_2_0" geometry={nodes.Tree144_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree145" position={[3.828, 0, -33.021]} rotation={[Math.PI, -0.902, Math.PI]}>
                    <mesh name="Tree145_Snow_0" geometry={nodes.Tree145_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree145_Tree_1_0" geometry={nodes.Tree145_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree145_Wood_2_0" geometry={nodes.Tree145_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree146" position={[17.377, 1.104, -39.526]} rotation={[Math.PI, -0.169, Math.PI]}>
                    <mesh name="Tree146_Snow_0" geometry={nodes.Tree146_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree146_Tree_1_0" geometry={nodes.Tree146_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree146_Wood_2_0" geometry={nodes.Tree146_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree147" position={[-3.151, 0, -32.389]} rotation={[Math.PI, -0.902, Math.PI]}>
                    <mesh name="Tree147_Snow_0" geometry={nodes.Tree147_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree147_Tree_1_0" geometry={nodes.Tree147_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree147_Wood_2_0" geometry={nodes.Tree147_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree148" position={[7.078, 0, -38.302]} rotation={[Math.PI, -0.902, Math.PI]}>
                    <mesh name="Tree148_Snow_0" geometry={nodes.Tree148_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree148_Tree_1_0" geometry={nodes.Tree148_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree148_Wood_2_0" geometry={nodes.Tree148_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree149" position={[1.743, 0, -30.23]} rotation={[Math.PI, -0.902, Math.PI]}>
                    <mesh name="Tree149_Snow_0" geometry={nodes.Tree149_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree149_Tree_1_0" geometry={nodes.Tree149_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree149_Wood_2_0" geometry={nodes.Tree149_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree150" position={[15.788, 0, -36.16]} rotation={[Math.PI, -0.169, Math.PI]}>
                    <mesh name="Tree150_Snow_0" geometry={nodes.Tree150_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree150_Tree_1_0" geometry={nodes.Tree150_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree150_Wood_2_0" geometry={nodes.Tree150_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree151" position={[-4.081, 0, -29.386]} rotation={[Math.PI, -0.902, Math.PI]}>
                    <mesh name="Tree151_Snow_0" geometry={nodes.Tree151_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree151_Tree_1_0" geometry={nodes.Tree151_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree151_Wood_2_0" geometry={nodes.Tree151_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree152" position={[-0.614, 0, 11.603]} rotation={[0, -0.235, 0]}>
                    <mesh name="Tree152_Snow_0" geometry={nodes.Tree152_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree152_Tree_1_0" geometry={nodes.Tree152_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree152_Wood_2_0" geometry={nodes.Tree152_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree153" position={[3.389, 0, 10.872]} rotation={[0, -0.235, 0]}>
                    <mesh name="Tree153_Snow_0" geometry={nodes.Tree153_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree153_Tree_1_0" geometry={nodes.Tree153_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree153_Wood_2_0" geometry={nodes.Tree153_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree154" position={[-9, 0, -1.623]} rotation={[0, -0.968, 0]}>
                    <mesh name="Tree154_Snow_0" geometry={nodes.Tree154_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree154_Tree_1_0" geometry={nodes.Tree154_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree154_Wood_2_0" geometry={nodes.Tree154_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree155" position={[-6.13, 0, -19.991]} rotation={[Math.PI, -1.522, Math.PI]}>
                    <mesh name="Tree155_Snow_0" geometry={nodes.Tree155_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree155_Tree_1_0" geometry={nodes.Tree155_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree155_Wood_2_0" geometry={nodes.Tree155_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree156" position={[-7.212, 1.104, -2.912]} rotation={[0, -0.968, 0]}>
                    <mesh name="Tree156_Snow_0" geometry={nodes.Tree156_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree156_Tree_1_0" geometry={nodes.Tree156_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree156_Wood_2_0" geometry={nodes.Tree156_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree158" position={[-4.495, 0, -23.551]} rotation={[Math.PI, -1.522, Math.PI]}>
                    <mesh name="Tree158_Snow_0" geometry={nodes.Tree158_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree158_Tree_1_0" geometry={nodes.Tree158_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree158_Wood_2_0" geometry={nodes.Tree158_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree159" position={[3.101, 0, 10.393]} rotation={[0, -0.235, 0]}>
                    <mesh name="Tree159_Snow_0" geometry={nodes.Tree159_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree159_Tree_1_0" geometry={nodes.Tree159_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree159_Wood_2_0" geometry={nodes.Tree159_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree16" position={[0.432, 0.812, -1.901]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree16_Snow_0" geometry={nodes.Tree16_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree16_Tree_1_0" geometry={nodes.Tree16_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree16_Wood_2_0" geometry={nodes.Tree16_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree160" position={[0.375, 0, -28.619]} rotation={[Math.PI, -0.902, Math.PI]}>
                    <mesh name="Tree160_Snow_0" geometry={nodes.Tree160_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree160_Tree_1_0" geometry={nodes.Tree160_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree160_Wood_2_0" geometry={nodes.Tree160_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree161" position={[1.232, 0, 3.433]} rotation={[0, -0.395, 0]}>
                    <mesh name="Tree161_Snow_0" geometry={nodes.Tree161_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree161_Tree_1_0" geometry={nodes.Tree161_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree161_Wood_2_0" geometry={nodes.Tree161_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree162" position={[-6.945, 0, -10.927]} rotation={[0, -1.128, 0]}>
                    <mesh name="Tree162_Snow_0" geometry={nodes.Tree162_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree162_Tree_1_0" geometry={nodes.Tree162_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree162_Wood_2_0" geometry={nodes.Tree162_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree163" position={[16.534, 0, 13.715]} rotation={[0, 0.257, 0]}>
                    <mesh name="Tree163_Snow_0" geometry={nodes.Tree163_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree163_Tree_1_0" geometry={nodes.Tree163_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree163_Wood_2_0" geometry={nodes.Tree163_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree164" position={[-2.625, -0.413, -3.873]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree164_Snow_0" geometry={nodes.Tree164_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree164_Tree_1_0" geometry={nodes.Tree164_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree164_Wood_2_0" geometry={nodes.Tree164_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree167" position={[-4.161, 0.722, -0.688]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree167_Snow_0" geometry={nodes.Tree167_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree167_Tree_1_0" geometry={nodes.Tree167_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree167_Wood_2_0" geometry={nodes.Tree167_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree168" position={[4.352, 0.073, -10.978]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree168_Snow_0" geometry={nodes.Tree168_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree168_Tree_1_0" geometry={nodes.Tree168_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree168_Wood_2_0" geometry={nodes.Tree168_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree17" position={[14.963, 1.303, -11.644]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree17_Snow_0" geometry={nodes.Tree17_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree17_Tree_1_0" geometry={nodes.Tree17_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree17_Wood_2_0" geometry={nodes.Tree17_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree170" position={[1.041, 0.809, -8.19]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree170_Snow_0" geometry={nodes.Tree170_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree170_Tree_1_0" geometry={nodes.Tree170_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree170_Wood_2_0" geometry={nodes.Tree170_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree171" position={[-0.032, 0.463, -1.743]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree171_Snow_0" geometry={nodes.Tree171_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree171_Tree_1_0" geometry={nodes.Tree171_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree171_Wood_2_0" geometry={nodes.Tree171_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree172" position={[0.769, 0.179, -3.303]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree172_Snow_0" geometry={nodes.Tree172_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree172_Tree_1_0" geometry={nodes.Tree172_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree172_Wood_2_0" geometry={nodes.Tree172_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree175" position={[-3.737, 0.425, 5.742]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree175_Snow_0" geometry={nodes.Tree175_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree175_Tree_1_0" geometry={nodes.Tree175_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree175_Wood_2_0" geometry={nodes.Tree175_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree176" position={[-1.391, -0.723, 10.705]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree176_Snow_0" geometry={nodes.Tree176_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree176_Tree_1_0" geometry={nodes.Tree176_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree176_Wood_2_0" geometry={nodes.Tree176_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree177" position={[-2.538, 0.49, 5.352]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree177_Snow_0" geometry={nodes.Tree177_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree177_Tree_1_0" geometry={nodes.Tree177_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree177_Wood_2_0" geometry={nodes.Tree177_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree179" position={[-15.444, 0.193, 22.954]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree179_Snow_0" geometry={nodes.Tree179_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree179_Tree_1_0" geometry={nodes.Tree179_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree179_Wood_2_0" geometry={nodes.Tree179_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree18" position={[1.67, 0.946, 0.955]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree18_Snow_0" geometry={nodes.Tree18_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree18_Tree_1_0" geometry={nodes.Tree18_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree18_Wood_2_0" geometry={nodes.Tree18_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree19" position={[13.783, 0.437, -8.865]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree19_Snow_0" geometry={nodes.Tree19_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree19_Tree_1_0" geometry={nodes.Tree19_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree19_Wood_2_0" geometry={nodes.Tree19_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree21" position={[17.424, 0.253, -21.856]} rotation={[-Math.PI, 1.146, -Math.PI]}>
                    <mesh name="Tree21_Snow_0" geometry={nodes.Tree21_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree21_Tree_1_0" geometry={nodes.Tree21_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree21_Wood_2_0" geometry={nodes.Tree21_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree22" position={[-0.982, -0.839, 4.343]}>
                    <mesh name="Tree22_Snow_0" geometry={nodes.Tree22_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree22_Tree_1_0" geometry={nodes.Tree22_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree22_Wood_2_0" geometry={nodes.Tree22_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree227" position={[17.507, 0.31, -34.008]} rotation={[-Math.PI, 0.788, -Math.PI]}>
                    <mesh name="Tree227_Snow_0" geometry={nodes.Tree227_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree227_Tree_1_0" geometry={nodes.Tree227_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree227_Wood_2_0" geometry={nodes.Tree227_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree23" position={[0.175, -0.407, 6.414]}>
                    <mesh name="Tree23_Snow_0" geometry={nodes.Tree23_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree23_Tree_1_0" geometry={nodes.Tree23_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree23_Wood_2_0" geometry={nodes.Tree23_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree230" position={[10.614, 0.311, -36.886]} rotation={[-Math.PI, 0.788, -Math.PI]}>
                    <mesh name="Tree230_Snow_0" geometry={nodes.Tree230_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree230_Tree_1_0" geometry={nodes.Tree230_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree230_Wood_2_0" geometry={nodes.Tree230_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree24" position={[-1.729, 0.42, -0.688]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree24_Snow_0" geometry={nodes.Tree24_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree24_Tree_1_0" geometry={nodes.Tree24_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree24_Wood_2_0" geometry={nodes.Tree24_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree25" position={[5.638, 0.342, -16.33]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree25_Snow_0" geometry={nodes.Tree25_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree25_Tree_1_0" geometry={nodes.Tree25_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree25_Wood_2_0" geometry={nodes.Tree25_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree262" position={[39.88, 0.447, 10.227]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree262_Snow_0" geometry={nodes.Tree262_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree262_Tree_1_0" geometry={nodes.Tree262_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree262_Wood_2_0" geometry={nodes.Tree262_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree263" position={[17.852, -0.44, -10.702]} rotation={[-Math.PI, 0.069, -Math.PI]}>
                    <mesh name="Tree263_Snow_0" geometry={nodes.Tree263_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree263_Tree_1_0" geometry={nodes.Tree263_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree263_Wood_2_0" geometry={nodes.Tree263_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree264" position={[28.629, -0.187, -1.08]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree264_Snow_0" geometry={nodes.Tree264_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree264_Tree_1_0" geometry={nodes.Tree264_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree264_Wood_2_0" geometry={nodes.Tree264_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree265" position={[30.984, -0.103, -0.161]} rotation={[-Math.PI, 0.64, -Math.PI]}>
                    <mesh name="Tree265_Snow_0" geometry={nodes.Tree265_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree265_Tree_1_0" geometry={nodes.Tree265_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree265_Wood_2_0" geometry={nodes.Tree265_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree266" position={[31.802, -0.429, 1.647]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree266_Snow_0" geometry={nodes.Tree266_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree266_Tree_1_0" geometry={nodes.Tree266_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree266_Wood_2_0" geometry={nodes.Tree266_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree267" position={[17.268, 0.275, -6.947]} rotation={[-Math.PI, 0.069, -Math.PI]}>
                    <mesh name="Tree267_Snow_0" geometry={nodes.Tree267_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree267_Tree_1_0" geometry={nodes.Tree267_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree267_Wood_2_0" geometry={nodes.Tree267_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree268" position={[20.229, 0.163, -6.752]} rotation={[-Math.PI, 0.258, -Math.PI]}>
                    <mesh name="Tree268_Snow_0" geometry={nodes.Tree268_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree268_Tree_1_0" geometry={nodes.Tree268_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree268_Wood_2_0" geometry={nodes.Tree268_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree269" position={[32.513, 0.905, 4]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree269_Snow_0" geometry={nodes.Tree269_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree269_Tree_1_0" geometry={nodes.Tree269_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree269_Wood_2_0" geometry={nodes.Tree269_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree270" position={[33.687, 0.152, 6.145]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree270_Snow_0" geometry={nodes.Tree270_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree270_Tree_1_0" geometry={nodes.Tree270_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree270_Wood_2_0" geometry={nodes.Tree270_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree271" position={[35.759, 0.9, -8.73]} rotation={[-Math.PI, 0.285, -Math.PI]}>
                    <mesh name="Tree271_Snow_0" geometry={nodes.Tree271_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree271_Tree_1_0" geometry={nodes.Tree271_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree271_Wood_2_0" geometry={nodes.Tree271_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree272" position={[5.931, -0.608, -13.61]} rotation={[Math.PI, -0.637, Math.PI]}>
                    <mesh name="Tree272_Snow_0" geometry={nodes.Tree272_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree272_Tree_1_0" geometry={nodes.Tree272_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree272_Wood_2_0" geometry={nodes.Tree272_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree273" position={[20.307, -0.187, -13.061]} rotation={[-Math.PI, 0.285, -Math.PI]}>
                    <mesh name="Tree273_Snow_0" geometry={nodes.Tree273_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree273_Tree_1_0" geometry={nodes.Tree273_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree273_Wood_2_0" geometry={nodes.Tree273_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree274" position={[22.175, -0.103, -15.495]} rotation={[Math.PI, -0.066, Math.PI]}>
                    <mesh name="Tree274_Snow_0" geometry={nodes.Tree274_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree274_Tree_1_0" geometry={nodes.Tree274_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree274_Wood_2_0" geometry={nodes.Tree274_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree275" position={[22.926, -0.429, -11.529]} rotation={[-Math.PI, 0.285, -Math.PI]}>
                    <mesh name="Tree275_Snow_0" geometry={nodes.Tree275_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree275_Tree_1_0" geometry={nodes.Tree275_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree275_Wood_2_0" geometry={nodes.Tree275_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree276" position={[4.206, 0.034, -11.82]} rotation={[Math.PI, -0.637, Math.PI]}>
                    <mesh name="Tree276_Snow_0" geometry={nodes.Tree276_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree276_Tree_1_0" geometry={nodes.Tree276_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree276_Wood_2_0" geometry={nodes.Tree276_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree277" position={[7.091, 0.163, -9.472]} rotation={[Math.PI, -0.448, Math.PI]}>
                    <mesh name="Tree277_Snow_0" geometry={nodes.Tree277_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree277_Tree_1_0" geometry={nodes.Tree277_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree277_Wood_2_0" geometry={nodes.Tree277_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree278" position={[25.596, 1.664, -7.415]} rotation={[-Math.PI, 0.285, -Math.PI]}>
                    <mesh name="Tree278_Snow_0" geometry={nodes.Tree278_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree278_Tree_1_0" geometry={nodes.Tree278_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree278_Wood_2_0" geometry={nodes.Tree278_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree279" position={[24.811, 0.176, -7.031]} rotation={[-Math.PI, 0.285, -Math.PI]}>
                    <mesh name="Tree279_Snow_0" geometry={nodes.Tree279_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree279_Tree_1_0" geometry={nodes.Tree279_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree279_Wood_2_0" geometry={nodes.Tree279_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree28" position={[-8.667, 0.946, 10.151]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree28_Snow_0" geometry={nodes.Tree28_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree28_Tree_1_0" geometry={nodes.Tree28_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree28_Wood_2_0" geometry={nodes.Tree28_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree280" position={[29.906, 0.152, 6.309]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree280_Snow_0" geometry={nodes.Tree280_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree280_Tree_1_0" geometry={nodes.Tree280_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree280_Wood_2_0" geometry={nodes.Tree280_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree281" position={[27.769, 0.152, 8.329]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree281_Snow_0" geometry={nodes.Tree281_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree281_Tree_1_0" geometry={nodes.Tree281_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree281_Wood_2_0" geometry={nodes.Tree281_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree282" position={[23.733, 0.152, 8.259]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree282_Snow_0" geometry={nodes.Tree282_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree282_Tree_1_0" geometry={nodes.Tree282_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree282_Wood_2_0" geometry={nodes.Tree282_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree283" position={[-0.747, 0.152, 1.077]} rotation={[Math.PI, -0.263, Math.PI]}>
                    <mesh name="Tree283_Snow_0" geometry={nodes.Tree283_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree283_Tree_1_0" geometry={nodes.Tree283_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree283_Wood_2_0" geometry={nodes.Tree283_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree284" position={[14.229, 0.11, -0.553]} rotation={[-Math.PI, 0.258, -Math.PI]}>
                    <mesh name="Tree284_Snow_0" geometry={nodes.Tree284_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree284_Tree_1_0" geometry={nodes.Tree284_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree284_Wood_2_0" geometry={nodes.Tree284_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree285" position={[25.802, 0.049, 7.846]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree285_Snow_0" geometry={nodes.Tree285_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree285_Tree_1_0" geometry={nodes.Tree285_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree285_Wood_2_0" geometry={nodes.Tree285_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree286" position={[17.703, 0.163, -1.694]} rotation={[-Math.PI, 0.258, -Math.PI]}>
                    <mesh name="Tree286_Snow_0" geometry={nodes.Tree286_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree286_Tree_1_0" geometry={nodes.Tree286_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree286_Wood_2_0" geometry={nodes.Tree286_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree287" position={[29.987, 1.356, 9.058]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree287_Snow_0" geometry={nodes.Tree287_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree287_Tree_1_0" geometry={nodes.Tree287_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree287_Wood_2_0" geometry={nodes.Tree287_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree288" position={[37.354, 1.043, 15.285]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree288_Snow_0" geometry={nodes.Tree288_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree288_Tree_1_0" geometry={nodes.Tree288_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree288_Wood_2_0" geometry={nodes.Tree288_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree29" position={[9.627, -0.139, -18.367]} rotation={[-Math.PI, 0.858, -Math.PI]}>
                    <mesh name="Tree29_Snow_0" geometry={nodes.Tree29_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree29_Tree_1_0" geometry={nodes.Tree29_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree29_Wood_2_0" geometry={nodes.Tree29_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree294" position={[-3.348, -0.171, -3.255]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree294_Snow_0" geometry={nodes.Tree294_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree294_Tree_1_0" geometry={nodes.Tree294_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree294_Wood_2_0" geometry={nodes.Tree294_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree298" position={[12.811, -0.12, -13.765]} rotation={[Math.PI, -0.637, Math.PI]}>
                    <mesh name="Tree298_Snow_0" geometry={nodes.Tree298_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree298_Tree_1_0" geometry={nodes.Tree298_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree298_Wood_2_0" geometry={nodes.Tree298_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree299" position={[38.636, 0.546, -11.468]} rotation={[-Math.PI, 0.285, -Math.PI]}>
                    <mesh name="Tree299_Snow_0" geometry={nodes.Tree299_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree299_Tree_1_0" geometry={nodes.Tree299_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree299_Wood_2_0" geometry={nodes.Tree299_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree3">
                    <mesh name="Tree3_Snow_0" geometry={nodes.Tree3_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree3_Tree_1_0" geometry={nodes.Tree3_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree3_Wood_2_0" geometry={nodes.Tree3_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree300" position={[26.902, -0.03, -13.809]} rotation={[-Math.PI, 0.285, -Math.PI]}>
                    <mesh name="Tree300_Snow_0" geometry={nodes.Tree300_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree300_Tree_1_0" geometry={nodes.Tree300_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree300_Wood_2_0" geometry={nodes.Tree300_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree301" position={[24.283, 0.3, -15.341]} rotation={[-Math.PI, 0.285, -Math.PI]}>
                    <mesh name="Tree301_Snow_0" geometry={nodes.Tree301_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree301_Tree_1_0" geometry={nodes.Tree301_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree301_Wood_2_0" geometry={nodes.Tree301_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree302" position={[21.829, -0.199, -12.983]} rotation={[-Math.PI, 0.069, -Math.PI]}>
                    <mesh name="Tree302_Snow_0" geometry={nodes.Tree302_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree302_Tree_1_0" geometry={nodes.Tree302_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree302_Wood_2_0" geometry={nodes.Tree302_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree303" position={[12.381, -0.186, -11.922]} rotation={[Math.PI, -0.448, Math.PI]}>
                    <mesh name="Tree303_Snow_0" geometry={nodes.Tree303_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree303_Tree_1_0" geometry={nodes.Tree303_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree303_Wood_2_0" geometry={nodes.Tree303_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree304" position={[43.857, 1.063, 7.947]} rotation={[-Math.PI, 0.991, -Math.PI]}>
                    <mesh name="Tree304_Snow_0" geometry={nodes.Tree304_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree304_Tree_1_0" geometry={nodes.Tree304_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree304_Wood_2_0" geometry={nodes.Tree304_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree306" position={[1.874, 0, -19.875]} rotation={[Math.PI, -1.522, Math.PI]}>
                    <mesh name="Tree306_Snow_0" geometry={nodes.Tree306_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree306_Tree_1_0" geometry={nodes.Tree306_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree306_Wood_2_0" geometry={nodes.Tree306_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree307" position={[-0.576, 0.315, -7.252]} rotation={[0, -1.128, 0]}>
                    <mesh name="Tree307_Snow_0" geometry={nodes.Tree307_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree307_Tree_1_0" geometry={nodes.Tree307_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree307_Wood_2_0" geometry={nodes.Tree307_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree309" position={[11.331, 0, -34.249]} rotation={[Math.PI, -0.902, Math.PI]}>
                    <mesh name="Tree309_Snow_0" geometry={nodes.Tree309_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree309_Tree_1_0" geometry={nodes.Tree309_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree309_Wood_2_0" geometry={nodes.Tree309_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree31" position={[2.401, 0.246, -1.743]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree31_Snow_0" geometry={nodes.Tree31_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree31_Tree_1_0" geometry={nodes.Tree31_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree31_Wood_2_0" geometry={nodes.Tree31_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree310" position={[10.35, 0, -30.276]} rotation={[Math.PI, -0.789, Math.PI]}>
                    <mesh name="Tree310_Snow_0" geometry={nodes.Tree310_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree310_Tree_1_0" geometry={nodes.Tree310_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree310_Wood_2_0" geometry={nodes.Tree310_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree311" position={[23.45, 0.253, 18.832]} rotation={[0, 0.257, 0]}>
                    <mesh name="Tree311_Snow_0" geometry={nodes.Tree311_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree311_Tree_1_0" geometry={nodes.Tree311_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree311_Wood_2_0" geometry={nodes.Tree311_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree33" position={[-0.025, 0.342, -3.323]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree33_Snow_0" geometry={nodes.Tree33_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree33_Tree_1_0" geometry={nodes.Tree33_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree33_Wood_2_0" geometry={nodes.Tree33_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree34" position={[-9.106, 0.42, 12.685]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree34_Snow_0" geometry={nodes.Tree34_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree34_Tree_1_0" geometry={nodes.Tree34_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree34_Wood_2_0" geometry={nodes.Tree34_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree36" position={[-13.011, -0.109, 22.954]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree36_Snow_0" geometry={nodes.Tree36_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree36_Tree_1_0" geometry={nodes.Tree36_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree36_Wood_2_0" geometry={nodes.Tree36_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree361" position={[23.197, -0.103, -19.272]} rotation={[Math.PI, -0.066, Math.PI]}>
                    <mesh name="Tree361_Snow_0" geometry={nodes.Tree361_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree361_Tree_1_0" geometry={nodes.Tree361_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree361_Wood_2_0" geometry={nodes.Tree361_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree362" position={[-3.29, -0.011, 37.292]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree362_Snow_0" geometry={nodes.Tree362_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree362_Tree_1_0" geometry={nodes.Tree362_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree362_Wood_2_0" geometry={nodes.Tree362_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree363" position={[13.819, -0.512, -18.393]} rotation={[Math.PI, -0.637, Math.PI]}>
                    <mesh name="Tree363_Snow_0" geometry={nodes.Tree363_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree363_Tree_1_0" geometry={nodes.Tree363_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree363_Wood_2_0" geometry={nodes.Tree363_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree37" position={[-0.106, 0.189, 5.352]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree37_Snow_0" geometry={nodes.Tree37_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree37_Tree_1_0" geometry={nodes.Tree37_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree37_Wood_2_0" geometry={nodes.Tree37_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree39" position={[1.479, -0.251, 10.115]} rotation={[0, 1.114, 0]}>
                    <mesh name="Tree39_Snow_0" geometry={nodes.Tree39_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree39_Tree_1_0" geometry={nodes.Tree39_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree39_Wood_2_0" geometry={nodes.Tree39_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree40" position={[1.041, 0.157, 10.705]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree40_Snow_0" geometry={nodes.Tree40_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree40_Tree_1_0" geometry={nodes.Tree40_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree40_Wood_2_0" geometry={nodes.Tree40_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree44" position={[2.252, 0.753, 16.599]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree44_Snow_0" geometry={nodes.Tree44_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree44_Tree_1_0" geometry={nodes.Tree44_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree44_Wood_2_0" geometry={nodes.Tree44_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree45" position={[5.414, 0.157, 21.209]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree45_Snow_0" geometry={nodes.Tree45_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree45_Tree_1_0" geometry={nodes.Tree45_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree45_Wood_2_0" geometry={nodes.Tree45_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree46" position={[4.267, 0.189, 15.856]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree46_Snow_0" geometry={nodes.Tree46_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree46_Tree_1_0" geometry={nodes.Tree46_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree46_Wood_2_0" geometry={nodes.Tree46_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree47" position={[-3.1, 1.524, 31.499]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree47_Snow_0" geometry={nodes.Tree47_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree47_Tree_1_0" geometry={nodes.Tree47_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree47_Wood_2_0" geometry={nodes.Tree47_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree49" position={[-18.045, 1.577, 38.558]} rotation={[0, -0.197, 0]}>
                    <mesh name="Tree49_Snow_0" geometry={nodes.Tree49_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree49_Tree_1_0" geometry={nodes.Tree49_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree49_Wood_2_0" geometry={nodes.Tree49_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree5">
                    <mesh name="Tree5_Snow_0" geometry={nodes.Tree5_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree5_Tree_1_0" geometry={nodes.Tree5_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree5_Wood_2_0" geometry={nodes.Tree5_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree50" position={[-0.308, -0.318, 32.791]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree50_Snow_0" geometry={nodes.Tree50_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree50_Tree_1_0" geometry={nodes.Tree50_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree50_Wood_2_0" geometry={nodes.Tree50_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree53" position={[0.366, 1.242, 37.986]} rotation={[0, 0.725, 0]}>
                    <mesh name="Tree53_Snow_0" geometry={nodes.Tree53_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree53_Tree_1_0" geometry={nodes.Tree53_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree53_Wood_2_0" geometry={nodes.Tree53_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree54" position={[-0.257, 0.984, 39.465]} rotation={[0, 0.536, 0]}>
                    <mesh name="Tree54_Snow_0" geometry={nodes.Tree54_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree54_Tree_1_0" geometry={nodes.Tree54_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree54_Wood_2_0" geometry={nodes.Tree54_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree56" position={[-11.006, 1.158, 40.15]} rotation={[0, -0.197, 0]}>
                    <mesh name="Tree56_Snow_0" geometry={nodes.Tree56_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree56_Tree_1_0" geometry={nodes.Tree56_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree56_Wood_2_0" geometry={nodes.Tree56_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree60" position={[19.444, 1.293, 25.28]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree60_Snow_0" geometry={nodes.Tree60_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree60_Tree_1_0" geometry={nodes.Tree60_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree60_Wood_2_0" geometry={nodes.Tree60_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree62" position={[11.461, -0.193, 32.946]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree62_Snow_0" geometry={nodes.Tree62_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree62_Tree_1_0" geometry={nodes.Tree62_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree62_Wood_2_0" geometry={nodes.Tree62_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree63" position={[12.984, -0.434, 37.716]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree63_Snow_0" geometry={nodes.Tree63_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree63_Tree_1_0" geometry={nodes.Tree63_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree63_Wood_2_0" geometry={nodes.Tree63_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree64" position={[23.859, 0.157, 27.736]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree64_Snow_0" geometry={nodes.Tree64_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree64_Tree_1_0" geometry={nodes.Tree64_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree64_Wood_2_0" geometry={nodes.Tree64_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree65" position={[12.077, 0.42, 40.922]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree65_Snow_0" geometry={nodes.Tree65_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree65_Tree_1_0" geometry={nodes.Tree65_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree65_Wood_2_0" geometry={nodes.Tree65_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree66" position={[14.869, 0.915, 43.143]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree66_Snow_0" geometry={nodes.Tree66_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree66_Tree_1_0" geometry={nodes.Tree66_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree66_Wood_2_0" geometry={nodes.Tree66_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree67" position={[15.345, 0.522, 38.026]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree67_Snow_0" geometry={nodes.Tree67_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree67_Tree_1_0" geometry={nodes.Tree67_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree67_Wood_2_0" geometry={nodes.Tree67_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree68" position={[6.538, -0.109, 42.882]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree68_Snow_0" geometry={nodes.Tree68_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree68_Tree_1_0" geometry={nodes.Tree68_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree68_Wood_2_0" geometry={nodes.Tree68_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree69" position={[-0.925, 0, -2.048]}>
                    <mesh name="Tree69_Snow_0" geometry={nodes.Tree69_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree69_Tree_1_0" geometry={nodes.Tree69_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree69_Wood_2_0" geometry={nodes.Tree69_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree70" position={[17.72, 0, 2.747]} rotation={[0, 0.732, 0]}>
                    <mesh name="Tree70_Snow_0" geometry={nodes.Tree70_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree70_Tree_1_0" geometry={nodes.Tree70_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree70_Wood_2_0" geometry={nodes.Tree70_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree71">
                    <mesh name="Tree71_Snow_0" geometry={nodes.Tree71_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree71_Tree_1_0" geometry={nodes.Tree71_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree71_Wood_2_0" geometry={nodes.Tree71_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree73">
                    <mesh name="Tree73_Snow_0" geometry={nodes.Tree73_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree73_Tree_1_0" geometry={nodes.Tree73_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree73_Wood_2_0" geometry={nodes.Tree73_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree75">
                    <mesh name="Tree75_Snow_0" geometry={nodes.Tree75_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree75_Tree_1_0" geometry={nodes.Tree75_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree75_Wood_2_0" geometry={nodes.Tree75_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree76">
                    <mesh name="Tree76_Snow_0" geometry={nodes.Tree76_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree76_Tree_1_0" geometry={nodes.Tree76_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree76_Wood_2_0" geometry={nodes.Tree76_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree77" position={[15.933, 0, -1.741]} rotation={[0, 0.732, 0]}>
                    <mesh name="Tree77_Snow_0" geometry={nodes.Tree77_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree77_Tree_1_0" geometry={nodes.Tree77_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree77_Wood_2_0" geometry={nodes.Tree77_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree80" position={[1.063, -0.362, 0.604]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree80_Snow_0" geometry={nodes.Tree80_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree80_Tree_1_0" geometry={nodes.Tree80_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree80_Wood_2_0" geometry={nodes.Tree80_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree81" position={[1.539, 0.42, -3.584]} rotation={[0, 0.63, 0]}>
                    <mesh name="Tree81_Snow_0" geometry={nodes.Tree81_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree81_Tree_1_0" geometry={nodes.Tree81_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree81_Wood_2_0" geometry={nodes.Tree81_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree84" position={[12.737, 0.246, -10.939]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree84_Snow_0" geometry={nodes.Tree84_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree84_Tree_1_0" geometry={nodes.Tree84_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree84_Wood_2_0" geometry={nodes.Tree84_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree89" position={[-3.342, -0.407, 4.215]}>
                    <mesh name="Tree89_Snow_0" geometry={nodes.Tree89_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree89_Tree_1_0" geometry={nodes.Tree89_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree89_Wood_2_0" geometry={nodes.Tree89_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree9">
                    <mesh name="Tree9_Snow_0" geometry={nodes.Tree9_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree9_Tree_1_0" geometry={nodes.Tree9_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree9_Wood_2_0" geometry={nodes.Tree9_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree93" position={[3.474, 0.664, -7.44]} rotation={[0, 1.552, 0]}>
                    <mesh name="Tree93_Snow_0" geometry={nodes.Tree93_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree93_Tree_1_0" geometry={nodes.Tree93_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree93_Wood_2_0" geometry={nodes.Tree93_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                  <group name="Tree99" position={[4.626, 0.512, -2.448]} rotation={[0, 1.363, 0]}>
                    <mesh name="Tree99_Snow_0" geometry={nodes.Tree99_Snow_0.geometry} material={materials.Snow} />
                    <mesh name="Tree99_Tree_1_0" geometry={nodes.Tree99_Tree_1_0.geometry} material={materials.Tree_1} />
                    <mesh name="Tree99_Wood_2_0" geometry={nodes.Tree99_Wood_2_0.geometry} material={materials.Wood_2} />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
        <group name="3b06556c784d4ed4b17bcfc12c15f331fbx" rotation={[Math.PI / 2, 0, 0]} />
        <group name="bucket2" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="centre_cylinder" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="75cd1960652249f08e91141b4e673d48fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="RootNode001">
              <group name="pCube179" scale={0.01} />
              <group name="pCube248" scale={0.01} />
              <group name="pCube26" scale={0.01} />
              <group name="pCube300" scale={0.01} />
              <group name="pCylinder20" scale={0.01} />
              <group name="pCylinder58" scale={0.01} />
              <group name="pDisc2" scale={0.01}>
                <mesh name="pDisc2_lambert2_0" geometry={nodes.pDisc2_lambert2_0.geometry} material={materials.lambert2} position={[-12.7, -4.84, 18.47]} scale={2} />
              </group>
              <group name="polySurface1739" scale={0.01} />
              <group name="polySurface1758" scale={0.01} />
              <group name="polySurface1769" scale={0.01} />
              <group name="polySurface1771" scale={0.01} />
              <group name="polySurface1789" scale={0.01} />
              <group name="polySurface1791" scale={0.01} />
              <group name="polySurface2067" scale={0.01}>
                <group name="polySurface2218" position={[0.302, 0, -0.213]} />
              </group>
              <group name="polySurface2407" scale={0.01} />
              <group name="polySurface2486" scale={0.01} />
              <group name="polySurface2534" scale={0.01} />
              <group name="polySurface2572" scale={0.01} />
              <group name="polySurface2594" position={[0, 0.005, 0.002]} rotation={[-0.021, 0.002, -0.006]} scale={0.01} />
              <group name="polySurface2598" scale={0.01} />
              <group name="polySurface280" scale={0.01} />
              <group name="polySurface2811" position={[0, -0.001, 0]} scale={0.01} />
              <group name="polySurface2903" scale={0.01} />
              <group name="polySurface542" scale={0.01} />
              <group name="polySurface579" scale={0.01}>
                <group name="polySurface1790" />
              </group>
              <group name="polySurface882" scale={0.01} />
              <group name="pPlane4" scale={0.01}>
                <group name="polySurface878" position={[0, -0.012, 0]} />
                <group name="polySurface879" />
              </group>
            </group>
          </group>
        </group>
        <group name="chair" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="modelfbx" rotation={[Math.PI, 0, 0]}>
            <group name="RootNode005">
              <group name="model001" />
            </group>
          </group>
        </group>
        <group name="Empty" position={[-0.022, 0.053, -0.612]} rotation={[1.575, -0.039, 2.232]} scale={0.001} />
        <group name="pCylinder1" position={[0, 0.574, 0.011]} rotation={[0.152, 0, 0]} scale={0.038} />
        <group name="pCylinder2" position={[0, 0.571, 0.011]} rotation={[0.152, 0, 0]} scale={0.037} />
        <group name="polySurface287001" position={[-0.159, 0.362, -0.142]} rotation={[-3.138, -1.476, -Math.PI]} scale={[0.02, 0.015, 0.01]} />
        <group name="polySurface289001" position={[-0.159, 0.362, -0.142]} rotation={[-3.138, -1.476, -Math.PI]} scale={[0.02, 0.015, 0.01]} />
        <group name="polySurface451002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface452002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface453002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface454002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface455002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface456002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface457002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface458002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface459002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface460002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface461002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface462002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface463002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface464002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface465002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface466002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface467002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface468002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface469002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface470002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="polySurface471002" position={[-0.089, 0.35, -0.025]} rotation={[2.86, -1.088, -0.732]} scale={0.01} />
        <group name="Sketchfab_model001" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="38575791c9ea45829a20597652646555fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="RootNode002">
              <group name="model_pack_02" rotation={[-Math.PI / 2, 0, 0]} />
            </group>
          </group>
        </group>
        <group name="Sketchfab_model002" rotation={[-Math.PI / 2, 0, 0]} scale={0.01}>
          <group name="7f085f867b61422cab2da24b7161a7feobjcleanergles" />
        </group>
        <group name="Sketchfab_model003" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="7b027088e14a438895313da217380f68fbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="RootNode003">
              <group name="Cube" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
            </group>
          </group>
        </group>
        <group name="Sketchfab_model004" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="Collada_visual_scene_group">
            <group name="model" />
          </group>
        </group>
        <group name="Sketchfab_model005" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="8eaf0caa7310477a81c442071a7d0c89fbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="RootNode004" />
          </group>
        </group>
        <group name="Sketchfab_model006" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="df109a9a0dd14e71b7ea1b83cdc2e51bfbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="RootNode006" />
          </group>
        </group>
        <group name="Sketchfab_model007" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="DIETANNEobjcleanermaterialmergergles" />
        </group>
        <group name="Sketchfab_model008" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="Root">
            <group name="BANCA" position={[0, 0.78, 0.397]} scale={[1.5, 0.025, 0.025]} />
            <group name="Lamp001" position={[4.076, 1.005, 5.904]} rotation={[-0.268, 0.602, 1.931]}>
              <group name="Lamp002" />
            </group>
          </group>
        </group>
        <group name="Circle001" position={[-0.029, 2.226, 0.011]} rotation={[-1.586, 0.05, -0.131]} scale={[0.378, 0.378, 0.504]} />
        <group name="Sketchfab_model009" rotation={[-Math.PI / 2, 0, 0]} scale={1.196}>
          <group name="8089c798d0bf4502951e26a1939000a9fbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="RootNode007">
              <group name="Circle005" position={[-2.41, 180.504, 0.903]} rotation={[-1.586, 0.05, -0.131]} scale={[33.352, 33.332, 44.43]} />
              <group name="Cube001" position={[0, 23.267, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={10.781} />
            </group>
          </group>
        </group>
        <group name="Centre_tree" position={[0.027, 0.113, -0.124]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root001">
            <group name="Lamp003" position={[7.269, 2.237, 10.384]} rotation={[-0.268, 0.602, 1.931]}>
              <group name="Lamp004" />
            </group>
            <group name="main_tree" scale={0.168}>
              <group name="Plane_1" position={[-18.885, -23.545, -0.046]} scale={0.5}>
                <mesh name="Plane_1_1" geometry={nodes.Plane_1_1.geometry} material={materials['Material.008']} />
                <mesh name="Plane_1_2" geometry={nodes.Plane_1_2.geometry} material={materials['Material.007']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Lattice001" position={[-0.312, 0.149, 0.272]} rotation={[0, -0.873, 0]} scale={0.4}>
          <mesh name="g" geometry={nodes.g.geometry} material={materials['Material.003']} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 2.157]} />
        </group>
        <group name="Sketchfab_model011" position={[-0.039, 0.184, -0.178]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root002">
            <group name="Plane001" scale={0.168} />
          </group>
        </group>
        <group name="Centre_tree001" position={[0.121, 0.12, -0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root003">
            <group name="main_tree001" scale={0.168} />
          </group>
        </group>
        <group name="Sketchfab_model010" position={[0.077, 0.117, -0.159]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="536d5e8fa83a40a8a2c8b9e4662ed387fbx001" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2001">
              <group name="RootNode008">
                <group name="Main_Chrimah_Tree001" position={[27.308, 0.14, 19.148]} rotation={[0, 1.363, 0]} scale={1.48}>
                  <group name="Bulbs001" position={[8.614, 0.34, -17.979]} rotation={[0, -0.765, 0]} scale={0.216}>
                    <group name="polySurface212001" position={[-2.212, -0.707, -14.839]} rotation={[2.908, 0.503, 1.995]} />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree002" position={[0.105, 0.13, -0.283]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root004">
            <group name="main_tree002" scale={0.168}>
              <group name="Plane_1001" position={[27.659, -42.251, -2.573]} scale={0.7}>
                <mesh name="Plane_1002_1" geometry={nodes.Plane_1002_1.geometry} material={materials['Material.028']} />
                <mesh name="Plane_1002_2" geometry={nodes.Plane_1002_2.geometry} material={materials['Material.029']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree003" position={[0.277, 0.12, 0.123]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root005">
            <group name="main_tree003" scale={0.168} />
          </group>
        </group>
        <group name="Centre_tree004" position={[0.326, 0.121, 0.07]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root006">
            <group name="main_tree004" scale={0.168} />
          </group>
        </group>
        <group name="Centre_tree005" position={[0.293, 0.12, 0.14]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root007">
            <group name="main_tree005" scale={0.168} />
          </group>
        </group>
        <group name="Centre_tree006" position={[0.365, 0.114, 0.136]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root008">
            <group name="main_tree006" scale={0.168} />
          </group>
        </group>
        <group name="Centre_tree007" position={[0.338, 0.11, 0.237]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root009">
            <group name="main_tree007" scale={0.168} />
          </group>
        </group>
        <group name="Centre_tree008" position={[0.341, 0.113, 0.231]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root010">
            <group name="main_tree008" scale={0.168} />
          </group>
        </group>
        <group name="Centre_tree009" position={[-0.018, 0.114, -0.193]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root011">
            <group name="main_tree009" scale={0.168}>
              <group name="Plane_1008" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1009_1" geometry={nodes.Plane_1009_1.geometry} material={materials['Material.042']} />
                <mesh name="Plane_1009_2" geometry={nodes.Plane_1009_2.geometry} material={materials['Material.043']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree010" position={[0.069, 0.12, -0.201]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root012">
            <group name="main_tree010" scale={0.168}>
              <group name="Plane_1009" position={[21.68, 7.834, -1.067]} scale={0.7}>
                <mesh name="Plane_1010_1" geometry={nodes.Plane_1010_1.geometry} material={materials['Material.044']} />
                <mesh name="Plane_1010_2" geometry={nodes.Plane_1010_2.geometry} material={materials['Material.045']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree011" position={[0.114, 0.12, -0.194]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root013">
            <group name="main_tree011" scale={0.168}>
              <group name="Plane_1010" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1011_1" geometry={nodes.Plane_1011_1.geometry} material={materials['Material.046']} />
                <mesh name="Plane_1011_2" geometry={nodes.Plane_1011_2.geometry} material={materials['Material.047']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree012" position={[-0.188, 0.116, -0.329]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root014">
            <group name="main_tree012" scale={0.168}>
              <group name="Plane_1011" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1012_1" geometry={nodes.Plane_1012_1.geometry} material={materials['Material.048']} />
                <mesh name="Plane_1012_2" geometry={nodes.Plane_1012_2.geometry} material={materials['Material.049']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree013" position={[-0.139, 0.114, -0.365]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root015">
            <group name="main_tree013" scale={0.168}>
              <group name="Plane_1012" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1013_1" geometry={nodes.Plane_1013_1.geometry} material={materials['Material.050']} />
                <mesh name="Plane_1013_2" geometry={nodes.Plane_1013_2.geometry} material={materials['Material.051']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree014" position={[-0.094, 0.116, -0.393]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root016">
            <group name="main_tree014" scale={0.168}>
              <group name="Plane_1013" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1014_1" geometry={nodes.Plane_1014_1.geometry} material={materials['Material.052']} />
                <mesh name="Plane_1014_2" geometry={nodes.Plane_1014_2.geometry} material={materials['Material.053']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree015" position={[-0.029, 0.114, -0.421]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root017">
            <group name="main_tree015" scale={0.168}>
              <group name="Plane_1014" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1015_1" geometry={nodes.Plane_1015_1.geometry} material={materials['Material.054']} />
                <mesh name="Plane_1015_2" geometry={nodes.Plane_1015_2.geometry} material={materials['Material.055']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree016" position={[0.013, 0.119, -0.234]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root018">
            <group name="main_tree016" scale={0.168} />
          </group>
        </group>
        <group name="Centre_tree017" position={[0.126, 0.119, -0.129]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root019">
            <group name="main_tree017" scale={0.168}>
              <group name="Plane_1016" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1017_1" geometry={nodes.Plane_1017_1.geometry} material={materials['Material.058']} />
                <mesh name="Plane_1017_2" geometry={nodes.Plane_1017_2.geometry} material={materials['Material.059']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree018" position={[0.143, 0.125, 0.053]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root020">
            <group name="main_tree018" scale={0.168}>
              <group name="Plane_1017" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1018_1" geometry={nodes.Plane_1018_1.geometry} material={materials['Material.060']} />
                <mesh name="Plane_1018_2" geometry={nodes.Plane_1018_2.geometry} material={materials['Material.061']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree019" position={[0.177, 0.121, 0.068]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root021">
            <group name="main_tree019" scale={0.168}>
              <group name="Plane_1018" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1019_1" geometry={nodes.Plane_1019_1.geometry} material={materials['Material.062']} />
                <mesh name="Plane_1019_2" geometry={nodes.Plane_1019_2.geometry} material={materials['Material.063']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree020" position={[0.027, 0.113, -0.124]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root022">
            <group name="main_tree020" scale={0.168}>
              <group name="Plane_1002" position={[-18.885, -23.025, -0.046]} scale={0.5}>
                <mesh name="Plane_1020_1" geometry={nodes.Plane_1020_1.geometry} material={materials['Material.064']} />
                <mesh name="Plane_1020_2" geometry={nodes.Plane_1020_2.geometry} material={materials['Material.065']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree021" position={[0.027, 0.113, -0.124]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root023">
            <group name="main_tree021" scale={0.168}>
              <group name="Plane_1003" position={[-18.885, -23.545, -0.046]} scale={0.7}>
                <mesh name="Plane_1021_1" geometry={nodes.Plane_1021_1.geometry} material={materials['Material.066']} />
                <mesh name="Plane_1021_2" geometry={nodes.Plane_1021_2.geometry} material={materials['Material.067']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree022" position={[0.126, 0.119, -0.129]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root024">
            <group name="main_tree022" scale={0.168}>
              <group name="Plane_1004" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1022_1" geometry={nodes.Plane_1022_1.geometry} material={materials['Material.068']} />
                <mesh name="Plane_1022_2" geometry={nodes.Plane_1022_2.geometry} material={materials['Material.069']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree023" position={[0.126, 0.119, -0.129]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root025">
            <group name="main_tree023" scale={0.168}>
              <group name="Plane_1005" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1023_1" geometry={nodes.Plane_1023_1.geometry} material={materials['Material.070']} />
                <mesh name="Plane_1023_2" geometry={nodes.Plane_1023_2.geometry} material={materials['Material.071']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree024" position={[-0.055, 0.117, 0.006]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root026">
            <group name="main_tree024" scale={0.168}>
              <group name="Plane_1006_2" position={[-23.863, -7.557, -0.981]} scale={0.5}>
                <mesh name="Plane_1001_1" geometry={nodes.Plane_1001_1.geometry} material={materials['Material.072']} />
                <mesh name="Plane_1001_2" geometry={nodes.Plane_1001_2.geometry} material={materials['Material.073']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree025" position={[0.027, 0.113, -0.124]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root027">
            <group name="main_tree025" scale={0.168}>
              <group name="Plane_1007" position={[-18.885, -23.545, -0.046]} scale={0.5}>
                <mesh name="Plane_1003_1" geometry={nodes.Plane_1003_1.geometry} material={materials['Material.074']} />
                <mesh name="Plane_1003_2" geometry={nodes.Plane_1003_2.geometry} material={materials['Material.075']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree026" position={[0.027, 0.113, -0.124]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root028">
            <group name="main_tree026" scale={0.168}>
              <group name="Plane_1019" position={[-18.885, -23.545, -0.046]} scale={0.5}>
                <mesh name="Plane_1004_1" geometry={nodes.Plane_1004_1.geometry} material={materials['Material.076']} />
                <mesh name="Plane_1004_2" geometry={nodes.Plane_1004_2.geometry} material={materials['Material.077']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree027" position={[-0.041, 0.166, -0.219]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root029">
            <group name="main_tree027" scale={0.168}>
              <group name="Plane_1020" position={[-12.227, 7.879, -7.538]} scale={0.5}>
                <mesh name="Plane_1005_1" geometry={nodes.Plane_1005_1.geometry} material={materials['Material.078']} />
                <mesh name="Plane_1005_2" geometry={nodes.Plane_1005_2.geometry} material={materials['Material.079']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Root030" position={[0.114, 0.12, -0.194]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05} />
        <group name="main_tree028" position={[0.114, 0.12, -0.194]} rotation={[-Math.PI / 2, 0, 0]} scale={0.008} />
        <group name="Centre_tree028" position={[0.114, 0.12, -0.194]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05} />
        <group name="Centre_tree029" position={[0.17, 0.123, -0.378]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root031">
            <group name="main_tree029" scale={0.168}>
              <group name="Plane_1022" position={[-6.286, -3.046, -1.357]} scale={0.6}>
                <mesh name="Plane_1007_1" geometry={nodes.Plane_1007_1.geometry} material={materials['Material.082']} />
                <mesh name="Plane_1007_2" geometry={nodes.Plane_1007_2.geometry} material={materials['Material.083']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree030" position={[0.203, 0.122, -0.232]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root032">
            <group name="main_tree030" scale={0.168}>
              <group name="Plane_1015" position={[-6.286, -2.626, -1.357]} scale={0.7}>
                <mesh name="Plane_1008_1" geometry={nodes.Plane_1008_1.geometry} material={materials['Material.084']} />
                <mesh name="Plane_1008_2" geometry={nodes.Plane_1008_2.geometry} material={materials['Material.085']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree031" position={[-0.143, 0.13, -0.164]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root033">
            <group name="main_tree031" scale={0.168}>
              <group name="Plane_1023" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1024_1" geometry={nodes.Plane_1024_1.geometry} material={materials['Material.086']} />
                <mesh name="Plane_1024_2" geometry={nodes.Plane_1024_2.geometry} material={materials['Material.087']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree032" position={[-0.071, 0.113, -0.224]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root034">
            <group name="main_tree032" scale={0.168}>
              <group name="Plane_1024" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1025_1" geometry={nodes.Plane_1025_1.geometry} material={materials['Material.088']} />
                <mesh name="Plane_1025_2" geometry={nodes.Plane_1025_2.geometry} material={materials['Material.089']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree033" position={[0.027, 0.121, -0.295]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root035">
            <group name="main_tree033" scale={0.168}>
              <group name="Plane_1025" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1026_1" geometry={nodes.Plane_1026_1.geometry} material={materials['Material.090']} />
                <mesh name="Plane_1026_2" geometry={nodes.Plane_1026_2.geometry} material={materials['Material.091']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree034" position={[0.114, 0.12, -0.194]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root036">
            <group name="main_tree034" scale={0.168}>
              <group name="Plane_1026" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1027_1" geometry={nodes.Plane_1027_1.geometry} material={materials['Material.092']} />
                <mesh name="Plane_1027_2" geometry={nodes.Plane_1027_2.geometry} material={materials['Material.093']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree035" position={[0.081, 0.126, -0.336]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root037">
            <group name="main_tree035" scale={0.168}>
              <group name="Plane_1027" position={[-0.336, -7.675, -1.52]} scale={0.7}>
                <mesh name="Plane_1028_1" geometry={nodes.Plane_1028_1.geometry} material={materials['Material.094']} />
                <mesh name="Plane_1028_2" geometry={nodes.Plane_1028_2.geometry} material={materials['Material.095']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree036" position={[0.194, 0.121, -0.149]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root038">
            <group name="main_tree036" scale={0.168}>
              <group name="Plane_1028" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1029_1" geometry={nodes.Plane_1029_1.geometry} material={materials['Material.096']} />
                <mesh name="Plane_1029_2" geometry={nodes.Plane_1029_2.geometry} material={materials['Material.097']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree037" position={[0.243, 0.114, -0.18]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root039">
            <group name="main_tree037" scale={0.168}>
              <group name="Plane_1029" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1030_1" geometry={nodes.Plane_1030_1.geometry} material={materials['Material.098']} />
                <mesh name="Plane_1030_2" geometry={nodes.Plane_1030_2.geometry} material={materials['Material.099']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree038" position={[0.222, 0.123, -0.003]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root040">
            <group name="main_tree038" scale={0.168}>
              <group name="Plane_1030" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1031_1" geometry={nodes.Plane_1031_1.geometry} material={materials['Material.100']} />
                <mesh name="Plane_1031_2" geometry={nodes.Plane_1031_2.geometry} material={materials['Material.101']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree039" position={[0.25, 0.116, -0.084]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root041">
            <group name="main_tree039" scale={0.168}>
              <group name="Plane_1031" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1032_1" geometry={nodes.Plane_1032_1.geometry} material={materials['Material.102']} />
                <mesh name="Plane_1032_2" geometry={nodes.Plane_1032_2.geometry} material={materials['Material.103']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree040" position={[0.338, 0.121, -0.157]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root042">
            <group name="main_tree040" scale={0.168}>
              <group name="Plane_1032" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1033_1" geometry={nodes.Plane_1033_1.geometry} material={materials['Material.104']} />
                <mesh name="Plane_1033_2" geometry={nodes.Plane_1033_2.geometry} material={materials['Material.105']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree041" position={[0.116, 0.136, -0.334]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root043">
            <group name="main_tree041" scale={0.168}>
              <group name="Plane_1033" position={[27.659, -42.251, -2.573]} scale={0.5}>
                <mesh name="Plane_1034_1" geometry={nodes.Plane_1034_1.geometry} material={materials['Material.106']} />
                <mesh name="Plane_1034_2" geometry={nodes.Plane_1034_2.geometry} material={materials['Material.107']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree042" position={[0.295, 0.119, -0.034]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root044">
            <group name="main_tree042" scale={0.168}>
              <group name="Plane_1034" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1035_1" geometry={nodes.Plane_1035_1.geometry} material={materials['Material.108']} />
                <mesh name="Plane_1035_2" geometry={nodes.Plane_1035_2.geometry} material={materials['Material.109']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree043" position={[0.279, 0.121, 0.035]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root045">
            <group name="main_tree043" scale={0.168}>
              <group name="Plane_1035" position={[-6.286, -3.046, -1.357]} scale={0.5}>
                <mesh name="Plane_1036_1" geometry={nodes.Plane_1036_1.geometry} material={materials['Material.110']} />
                <mesh name="Plane_1036_2" geometry={nodes.Plane_1036_2.geometry} material={materials['Material.111']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree044" position={[0.105, 0.13, -0.283]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root046">
            <group name="main_tree044" scale={0.168}>
              <group name="Plane_1036" position={[27.659, -42.251, -2.573]} scale={0.5}>
                <mesh name="Plane_1037_1" geometry={nodes.Plane_1037_1.geometry} material={materials['Material.112']} />
                <mesh name="Plane_1037_2" geometry={nodes.Plane_1037_2.geometry} material={materials['Material.113']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree045" position={[0.337, 0.116, 0.211]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root047">
            <group name="main_tree045" scale={0.168}>
              <group name="Plane_1037" position={[-2.554, 3.055, -1.098]} scale={0.7}>
                <mesh name="Plane_1038_1" geometry={nodes.Plane_1038_1.geometry} material={materials['Material.114']} />
                <mesh name="Plane_1038_2" geometry={nodes.Plane_1038_2.geometry} material={materials['Material.115']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree046" position={[0.356, 0.118, 0.165]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root048">
            <group name="main_tree046" scale={0.168}>
              <group name="Plane_1038" position={[-5.171, 4.332, -0.716]} scale={0.5}>
                <mesh name="Plane_1039_1" geometry={nodes.Plane_1039_1.geometry} material={materials['Material.116']} />
                <mesh name="Plane_1039_2" geometry={nodes.Plane_1039_2.geometry} material={materials['Material.117']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree047" position={[0.254, 0.122, 0.08]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root049">
            <group name="main_tree047" scale={0.168}>
              <group name="Plane_1039" position={[-6.286, -3.046, -1.357]} scale={0.6}>
                <mesh name="Plane_1040_1" geometry={nodes.Plane_1040_1.geometry} material={materials['Material.118']} />
                <mesh name="Plane_1040_2" geometry={nodes.Plane_1040_2.geometry} material={materials['Material.119']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree048" position={[0.218, 0.134, 0.203]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root050">
            <group name="main_tree048" scale={0.168}>
              <group name="Plane_1040" position={[-6.286, -3.046, -3.224]} scale={0.7}>
                <mesh name="Plane_1041_1" geometry={nodes.Plane_1041_1.geometry} material={materials['Material.120']} />
                <mesh name="Plane_1041_2" geometry={nodes.Plane_1041_2.geometry} material={materials['Material.121']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree049" position={[-0.062, 0.13, -0.085]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root051">
            <group name="main_tree049" scale={0.168}>
              <group name="Plane_1041" position={[-25.807, -9.178, -2.967]} scale={0.7}>
                <mesh name="Plane_1042_1" geometry={nodes.Plane_1042_1.geometry} material={materials['Material.122']} />
                <mesh name="Plane_1042_2" geometry={nodes.Plane_1042_2.geometry} material={materials['Material.123']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree050" position={[-0.125, 0.121, -0.028]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root052">
            <group name="main_tree050" scale={0.168}>
              <group name="Plane_1042" position={[-6.286, -3.046, -1.357]} scale={0.7}>
                <mesh name="Plane_1043_1" geometry={nodes.Plane_1043_1.geometry} material={materials['Material.124']} />
                <mesh name="Plane_1043_2" geometry={nodes.Plane_1043_2.geometry} material={materials['Material.125']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree051" position={[-0.066, 0.126, -0.049]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root053">
            <group name="main_tree051" scale={0.168}>
              <group name="Plane_1043" position={[-18.885, -23.965, -2.526]} scale={0.7}>
                <mesh name="Plane_1044_1" geometry={nodes.Plane_1044_1.geometry} material={materials['Material.126']} />
                <mesh name="Plane_1044_2" geometry={nodes.Plane_1044_2.geometry} material={materials['Material.127']} />
              </group>
            </group>
          </group>
        </group>
        <group name="Centre_tree052" position={[-0.221, 0.12, 0.173]} rotation={[-Math.PI / 2, 0, 0]} scale={0.05}>
          <group name="Root054">
            <group name="main_tree052" scale={0.168}>
              <group name="Plane_1044" position={[1.843, 45.559, -0.125]} scale={0.7}>
                <mesh name="Plane_1016_1" geometry={nodes.Plane_1016_1.geometry} material={materials['Material.004']} />
                <mesh name="Plane_1016_2" geometry={nodes.Plane_1016_2.geometry} material={materials['Material.005']} />
              </group>
            </group>
          </group>
        </group>
        <mesh name="notice_board" geometry={nodes.notice_board.geometry} material={materials['Scene_-_Root']} position={[-0.301, 0.152, -0.24]} rotation={[-1.588, 0.028, 2.376]} scale={0.03} />
        <mesh name="car" geometry={nodes.car.geometry} material={materials['default.012']} position={[0.219, 0.116, 0.199]} rotation={[-1.735, -0.178, -1.776]} scale={0.05} />
        <group name="defaultMaterial015" position={[0.043, 0.136, -0.397]} rotation={[2.714, 1.517, -2.729]} scale={0.005}>
          <mesh name="defaultMaterial015_1" geometry={nodes.defaultMaterial015_1.geometry} material={materials['lambert4.001']} />
          <mesh name="defaultMaterial015_2" geometry={nodes.defaultMaterial015_2.geometry} material={materials['lambert2.001']} />
          <mesh name="defaultMaterial015_3" geometry={nodes.defaultMaterial015_3.geometry} material={materials['lambert7.001']} />
          <mesh name="defaultMaterial015_4" geometry={nodes.defaultMaterial015_4.geometry} material={materials['lambert3.001']} />
          <mesh name="defaultMaterial015_5" geometry={nodes.defaultMaterial015_5.geometry} material={materials['lambert8.001']} />
          <mesh name="defaultMaterial015_6" geometry={nodes.defaultMaterial015_6.geometry} material={materials['lambert5.001']} />
          <mesh name="defaultMaterial015_7" geometry={nodes.defaultMaterial015_7.geometry} material={materials['lambert6.001']} />
          <mesh name="defaultMaterial015_8" geometry={nodes.defaultMaterial015_8.geometry} material={materials['lambert1.001']} />
        </group>
        <mesh name="Igloo_Material_0" geometry={nodes.Igloo_Material_0.geometry} material={materials['Material.019']} position={[0.301, 0.109, -0.222]} rotation={[Math.PI, 0.761, Math.PI / 2]} scale={0.01} />
        <mesh name="Igloo_Material_0001" geometry={nodes.Igloo_Material_0001.geometry} material={materials['Material.020']} position={[0.336, 0.109, -0.188]} rotation={[Math.PI, 0.761, Math.PI / 2]} scale={0.01} />
        <mesh name="inner_path" geometry={nodes.inner_path.geometry} material={materials['Material.002']} position={[0, 0.09, 0]} scale={[0.44, 0.02, 0.44]} />
        <group name="polySurface327_lambert15_0" position={[0, 0.117, 0.241]} rotation={[-3.138, -1.476, Math.PI]} scale={0.01}>
          <mesh name="polySurface327_lambert15_0_1" geometry={nodes.polySurface327_lambert15_0_1.geometry} material={materials['lambert15.001']} />
          <mesh name="polySurface327_lambert15_0_2" geometry={nodes.polySurface327_lambert15_0_2.geometry} material={materials.WoodCircle} />
          <mesh name="polySurface327_lambert15_0_3" geometry={nodes.polySurface327_lambert15_0_3.geometry} material={materials.WoodMain} />
          <mesh name="polySurface327_lambert15_0_4" geometry={nodes.polySurface327_lambert15_0_4.geometry} material={materials.WoodLines} />
          <mesh name="polySurface327_lambert15_0_5" geometry={nodes.polySurface327_lambert15_0_5.geometry} material={materials.WoodAdditional} />
          <mesh name="polySurface327_lambert15_0_6" geometry={nodes.polySurface327_lambert15_0_6.geometry} material={materials['WoodAdditional.001']} />
          <mesh name="polySurface327_lambert15_0_7" geometry={nodes.polySurface327_lambert15_0_7.geometry} material={materials.Glass} />
          <mesh name="polySurface327_lambert15_0_8" geometry={nodes.polySurface327_lambert15_0_8.geometry} material={materials.Foundation1} />
          <mesh name="polySurface327_lambert15_0_9" geometry={nodes.polySurface327_lambert15_0_9.geometry} material={materials.Rock1} />
          <mesh name="polySurface327_lambert15_0_10" geometry={nodes.polySurface327_lambert15_0_10.geometry} material={materials['lambert1.002']} />
          <mesh name="polySurface327_lambert15_0_11" geometry={nodes.polySurface327_lambert15_0_11.geometry} material={materials.Rock2} />
          <mesh name="polySurface327_lambert15_0_12" geometry={nodes.polySurface327_lambert15_0_12.geometry} material={materials.Rock3} />
          <mesh name="polySurface327_lambert15_0_13" geometry={nodes.polySurface327_lambert15_0_13.geometry} material={materials.BlueLight} />
          <mesh name="polySurface327_lambert15_0_14" geometry={nodes.polySurface327_lambert15_0_14.geometry} material={materials.RedLight} />
          <mesh name="polySurface327_lambert15_0_15" geometry={nodes.polySurface327_lambert15_0_15.geometry} material={materials.YellowLight} />
          <mesh name="polySurface327_lambert15_0_16" geometry={nodes.polySurface327_lambert15_0_16.geometry} material={materials.GreenLight} />
          <mesh name="polySurface327_lambert15_0_17" geometry={nodes.polySurface327_lambert15_0_17.geometry} material={materials.BlackLatex} />
          <mesh name="polySurface327_lambert15_0_18" geometry={nodes.polySurface327_lambert15_0_18.geometry} material={materials.Metallic} />
          <mesh name="polySurface327_lambert15_0_19" geometry={nodes.polySurface327_lambert15_0_19.geometry} material={materials.Rope} />
          <mesh name="polySurface327_lambert15_0_20" geometry={nodes.polySurface327_lambert15_0_20.geometry} material={materials.Woodkolodec} />
          <mesh name="polySurface327_lambert15_0_21" geometry={nodes.polySurface327_lambert15_0_21.geometry} material={materials.WoodKolodec1} />
          <mesh name="polySurface327_lambert15_0_22" geometry={nodes.polySurface327_lambert15_0_22.geometry} material={materials.Tree1} />
          <mesh name="polySurface327_lambert15_0_23" geometry={nodes.polySurface327_lambert15_0_23.geometry} material={materials.Tree2} />
          <mesh name="polySurface327_lambert15_0_24" geometry={nodes.polySurface327_lambert15_0_24.geometry} material={materials.Tree3} />
          <mesh name="polySurface327_lambert15_0_25" geometry={nodes.polySurface327_lambert15_0_25.geometry} material={materials.Shishka} />
          <mesh name="polySurface327_lambert15_0_26" geometry={nodes.polySurface327_lambert15_0_26.geometry} material={materials.Snow2} />
          <mesh name="polySurface327_lambert15_0_27" geometry={nodes.polySurface327_lambert15_0_27.geometry} material={materials.Ice1} />
          <mesh name="polySurface327_lambert15_0_28" geometry={nodes.polySurface327_lambert15_0_28.geometry} material={materials.phong4} />
          <mesh name="polySurface327_lambert15_0_29" geometry={nodes.polySurface327_lambert15_0_29.geometry} material={materials.phong5} />
          <mesh name="polySurface327_lambert15_0_30" geometry={nodes.polySurface327_lambert15_0_30.geometry} material={materials.Carrot} />
          <mesh name="polySurface327_lambert15_0_31" geometry={nodes.polySurface327_lambert15_0_31.geometry} material={materials.Cloth} />
          <mesh name="polySurface327_lambert15_0_32" geometry={nodes.polySurface327_lambert15_0_32.geometry} material={materials['lambert23.001']} />
        </group>
        <mesh name="Sled1_sled_0" geometry={nodes.Sled1_sled_0.geometry} material={materials.sled} position={[-0.28, 0.126, -0.123]} rotation={[0, -Math.PI / 6, 0]} scale={0.005} />
        <mesh name="stone006" geometry={nodes.stone006.geometry} material={materials['Material.009']} position={[-0.112, 0.108, -0.326]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone007" geometry={nodes.stone007.geometry} material={materials['Material.010']} position={[-0.364, 0.106, 0.044]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone008" geometry={nodes.stone008.geometry} material={materials['Material.011']} position={[-0.24, 0.106, 0.099]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone009" geometry={nodes.stone009.geometry} material={materials['Material.012']} position={[-0.288, 0.11, 0.239]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone010" geometry={nodes.stone010.geometry} material={materials['Material.013']} position={[-0.353, 0.11, 0.086]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone012" geometry={nodes.stone012.geometry} material={materials['Material.015']} position={[0.349, 0.105, -0.101]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone013" geometry={nodes.stone013.geometry} material={materials['Material.016']} position={[-0.074, 0.114, -0.03]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone014" geometry={nodes.stone014.geometry} material={materials['Material.017']} position={[0.307, 0.11, -0.097]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone015" geometry={nodes.stone015.geometry} material={materials['Material.018']} position={[0.246, 0.111, 0.211]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone016" geometry={nodes.stone016.geometry} material={materials['Material.021']} position={[0.123, 0.107, -0.297]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone017" geometry={nodes.stone017.geometry} material={materials['Material.022']} position={[0.1, 0.107, -0.317]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone018" geometry={nodes.stone018.geometry} material={materials['Material.023']} position={[0.075, 0.111, -0.341]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone019" geometry={nodes.stone019.geometry} material={materials['Material.024']} position={[0.046, 0.109, -0.314]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="stone020" geometry={nodes.stone020.geometry} material={materials['Material.025']} position={[-0.115, 0.111, -0.004]} rotation={[-Math.PI / 2, 0, 0]} scale={0.005} />
        <mesh name="Tent1_tent_0" geometry={nodes.Tent1_tent_0.geometry} material={materials.tent} position={[-0.351, 0.142, -0.075]} rotation={[Math.PI, -1.491, Math.PI]} scale={0.005} />
        <group name="U3DMesh003_grass01003_0003" position={[0.139, 0.108, -0.197]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0052_1" geometry={nodes.U3DMesh003_grass01003_0052_1.geometry} material={materials['grass01.060']} />
          <mesh name="U3DMesh003_grass01003_0052_2" geometry={nodes.U3DMesh003_grass01003_0052_2.geometry} material={materials['grass01.061']} />
          <mesh name="U3DMesh003_grass01003_0052_3" geometry={nodes.U3DMesh003_grass01003_0052_3.geometry} material={materials['grass01.062']} />
          <mesh name="U3DMesh003_grass01003_0052_4" geometry={nodes.U3DMesh003_grass01003_0052_4.geometry} material={materials['grass01.063']} />
          <mesh name="U3DMesh003_grass01003_0052_5" geometry={nodes.U3DMesh003_grass01003_0052_5.geometry} material={materials['grass01.064']} />
        </group>
        <group name="U3DMesh003_grass01003_0006" position={[-0.04, 0.12, -0.149]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0055" geometry={nodes.U3DMesh003_grass01003_0055.geometry} material={materials['grass01.075']} />
          <mesh name="U3DMesh003_grass01003_0055_1" geometry={nodes.U3DMesh003_grass01003_0055_1.geometry} material={materials['grass01.076']} />
          <mesh name="U3DMesh003_grass01003_0055_2" geometry={nodes.U3DMesh003_grass01003_0055_2.geometry} material={materials['grass01.077']} />
          <mesh name="U3DMesh003_grass01003_0055_3" geometry={nodes.U3DMesh003_grass01003_0055_3.geometry} material={materials['grass01.078']} />
          <mesh name="U3DMesh003_grass01003_0055_4" geometry={nodes.U3DMesh003_grass01003_0055_4.geometry} material={materials['grass01.079']} />
        </group>
        <group name="U3DMesh003_grass01003_0007" position={[0.074, 0.11, -0.121]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0056" geometry={nodes.U3DMesh003_grass01003_0056.geometry} material={materials['grass01.080']} />
          <mesh name="U3DMesh003_grass01003_0056_1" geometry={nodes.U3DMesh003_grass01003_0056_1.geometry} material={materials['grass01.081']} />
          <mesh name="U3DMesh003_grass01003_0056_2" geometry={nodes.U3DMesh003_grass01003_0056_2.geometry} material={materials['grass01.082']} />
          <mesh name="U3DMesh003_grass01003_0056_3" geometry={nodes.U3DMesh003_grass01003_0056_3.geometry} material={materials['grass01.083']} />
          <mesh name="U3DMesh003_grass01003_0056_4" geometry={nodes.U3DMesh003_grass01003_0056_4.geometry} material={materials['grass01.084']} />
        </group>
        <group name="U3DMesh003_grass01003_0010" position={[0.199, 0.107, -0.135]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0059_1" geometry={nodes.U3DMesh003_grass01003_0059_1.geometry} material={materials['grass01.095']} />
          <mesh name="U3DMesh003_grass01003_0059_2" geometry={nodes.U3DMesh003_grass01003_0059_2.geometry} material={materials['grass01.096']} />
          <mesh name="U3DMesh003_grass01003_0059_3" geometry={nodes.U3DMesh003_grass01003_0059_3.geometry} material={materials['grass01.097']} />
          <mesh name="U3DMesh003_grass01003_0059_4" geometry={nodes.U3DMesh003_grass01003_0059_4.geometry} material={materials['grass01.098']} />
          <mesh name="U3DMesh003_grass01003_0059_5" geometry={nodes.U3DMesh003_grass01003_0059_5.geometry} material={materials['grass01.099']} />
        </group>
        <mesh name="U3DMesh003_grass01003_0011" geometry={nodes.U3DMesh003_grass01003_0011.geometry} material={materials['grass01.100']} position={[-0.032, 0.122, -0.117]} scale={0} />
        <mesh name="U3DMesh003_grass01003_0012" geometry={nodes.U3DMesh003_grass01003_0012.geometry} material={materials['grass01.101']} position={[0.008, 0.114, -0.159]} scale={0} />
        <group name="U3DMesh003_grass01003_0013" position={[-0.156, 0.11, 0.092]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0062" geometry={nodes.U3DMesh003_grass01003_0062.geometry} material={materials['grass01.102']} />
          <mesh name="U3DMesh003_grass01003_0062_1" geometry={nodes.U3DMesh003_grass01003_0062_1.geometry} material={materials['grass01.103']} />
          <mesh name="U3DMesh003_grass01003_0062_2" geometry={nodes.U3DMesh003_grass01003_0062_2.geometry} material={materials['grass01.104']} />
          <mesh name="U3DMesh003_grass01003_0062_3" geometry={nodes.U3DMesh003_grass01003_0062_3.geometry} material={materials['grass01.105']} />
          <mesh name="U3DMesh003_grass01003_0062_4" geometry={nodes.U3DMesh003_grass01003_0062_4.geometry} material={materials['grass01.106']} />
        </group>
        <group name="U3DMesh003_grass01003_0014" position={[-0.2, 0.105, 0.04]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0063_1" geometry={nodes.U3DMesh003_grass01003_0063_1.geometry} material={materials['grass01.107']} />
          <mesh name="U3DMesh003_grass01003_0063_2" geometry={nodes.U3DMesh003_grass01003_0063_2.geometry} material={materials['grass01.108']} />
          <mesh name="U3DMesh003_grass01003_0063_3" geometry={nodes.U3DMesh003_grass01003_0063_3.geometry} material={materials['grass01.109']} />
          <mesh name="U3DMesh003_grass01003_0063_4" geometry={nodes.U3DMesh003_grass01003_0063_4.geometry} material={materials['grass01.110']} />
          <mesh name="U3DMesh003_grass01003_0063_5" geometry={nodes.U3DMesh003_grass01003_0063_5.geometry} material={materials['grass01.111']} />
        </group>
        <group name="U3DMesh003_grass01003_0015" position={[0.192, 0.114, 0.055]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0064_1" geometry={nodes.U3DMesh003_grass01003_0064_1.geometry} material={materials['grass01.112']} />
          <mesh name="U3DMesh003_grass01003_0064_2" geometry={nodes.U3DMesh003_grass01003_0064_2.geometry} material={materials['grass01.113']} />
          <mesh name="U3DMesh003_grass01003_0064_3" geometry={nodes.U3DMesh003_grass01003_0064_3.geometry} material={materials['grass01.114']} />
          <mesh name="U3DMesh003_grass01003_0064_4" geometry={nodes.U3DMesh003_grass01003_0064_4.geometry} material={materials['grass01.115']} />
          <mesh name="U3DMesh003_grass01003_0064_5" geometry={nodes.U3DMesh003_grass01003_0064_5.geometry} material={materials['grass01.116']} />
        </group>
        <group name="U3DMesh003_grass01003_0018" position={[0.388, 0.108, 0.028]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0067_1" geometry={nodes.U3DMesh003_grass01003_0067_1.geometry} material={materials['grass01.127']} />
          <mesh name="U3DMesh003_grass01003_0067_2" geometry={nodes.U3DMesh003_grass01003_0067_2.geometry} material={materials['grass01.128']} />
          <mesh name="U3DMesh003_grass01003_0067_3" geometry={nodes.U3DMesh003_grass01003_0067_3.geometry} material={materials['grass01.129']} />
          <mesh name="U3DMesh003_grass01003_0067_4" geometry={nodes.U3DMesh003_grass01003_0067_4.geometry} material={materials['grass01.130']} />
          <mesh name="U3DMesh003_grass01003_0067_5" geometry={nodes.U3DMesh003_grass01003_0067_5.geometry} material={materials['grass01.131']} />
        </group>
        <group name="U3DMesh003_grass01003_0020" position={[0.2, 0.107, 0.171]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0069_1" geometry={nodes.U3DMesh003_grass01003_0069_1.geometry} material={materials['grass01.137']} />
          <mesh name="U3DMesh003_grass01003_0069_2" geometry={nodes.U3DMesh003_grass01003_0069_2.geometry} material={materials['grass01.138']} />
          <mesh name="U3DMesh003_grass01003_0069_3" geometry={nodes.U3DMesh003_grass01003_0069_3.geometry} material={materials['grass01.139']} />
          <mesh name="U3DMesh003_grass01003_0069_4" geometry={nodes.U3DMesh003_grass01003_0069_4.geometry} material={materials['grass01.140']} />
          <mesh name="U3DMesh003_grass01003_0069_5" geometry={nodes.U3DMesh003_grass01003_0069_5.geometry} material={materials['grass01.141']} />
        </group>
        <group name="U3DMesh003_grass01003_0021" position={[0.319, 0.111, -0.088]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0070" geometry={nodes.U3DMesh003_grass01003_0070.geometry} material={materials['grass01.142']} />
          <mesh name="U3DMesh003_grass01003_0070_1" geometry={nodes.U3DMesh003_grass01003_0070_1.geometry} material={materials['grass01.143']} />
          <mesh name="U3DMesh003_grass01003_0070_2" geometry={nodes.U3DMesh003_grass01003_0070_2.geometry} material={materials['grass01.144']} />
          <mesh name="U3DMesh003_grass01003_0070_3" geometry={nodes.U3DMesh003_grass01003_0070_3.geometry} material={materials['grass01.145']} />
          <mesh name="U3DMesh003_grass01003_0070_4" geometry={nodes.U3DMesh003_grass01003_0070_4.geometry} material={materials['grass01.146']} />
        </group>
        <group name="U3DMesh003_grass01003_0024" position={[-0.197, 0.114, -0.249]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0073_1" geometry={nodes.U3DMesh003_grass01003_0073_1.geometry} material={materials['grass01.157']} />
          <mesh name="U3DMesh003_grass01003_0073_2" geometry={nodes.U3DMesh003_grass01003_0073_2.geometry} material={materials['grass01.158']} />
          <mesh name="U3DMesh003_grass01003_0073_3" geometry={nodes.U3DMesh003_grass01003_0073_3.geometry} material={materials['grass01.159']} />
          <mesh name="U3DMesh003_grass01003_0073_4" geometry={nodes.U3DMesh003_grass01003_0073_4.geometry} material={materials['grass01.160']} />
          <mesh name="U3DMesh003_grass01003_0073_5" geometry={nodes.U3DMesh003_grass01003_0073_5.geometry} material={materials['grass01.161']} />
        </group>
        <group name="U3DMesh003_grass01003_0025" position={[-0.197, 0.114, -0.249]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0074" geometry={nodes.U3DMesh003_grass01003_0074.geometry} material={materials['grass01.162']} />
          <mesh name="U3DMesh003_grass01003_0074_1" geometry={nodes.U3DMesh003_grass01003_0074_1.geometry} material={materials['grass01.163']} />
          <mesh name="U3DMesh003_grass01003_0074_2" geometry={nodes.U3DMesh003_grass01003_0074_2.geometry} material={materials['grass01.164']} />
          <mesh name="U3DMesh003_grass01003_0074_3" geometry={nodes.U3DMesh003_grass01003_0074_3.geometry} material={materials['grass01.165']} />
          <mesh name="U3DMesh003_grass01003_0074_4" geometry={nodes.U3DMesh003_grass01003_0074_4.geometry} material={materials['grass01.166']} />
        </group>
        <group name="U3DMesh003_grass01003_0027" position={[-0.129, 0.116, -0.277]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0076_1" geometry={nodes.U3DMesh003_grass01003_0076_1.geometry} material={materials['grass01.172']} />
          <mesh name="U3DMesh003_grass01003_0076_2" geometry={nodes.U3DMesh003_grass01003_0076_2.geometry} material={materials['grass01.173']} />
          <mesh name="U3DMesh003_grass01003_0076_3" geometry={nodes.U3DMesh003_grass01003_0076_3.geometry} material={materials['grass01.174']} />
          <mesh name="U3DMesh003_grass01003_0076_4" geometry={nodes.U3DMesh003_grass01003_0076_4.geometry} material={materials['grass01.175']} />
          <mesh name="U3DMesh003_grass01003_0076_5" geometry={nodes.U3DMesh003_grass01003_0076_5.geometry} material={materials['grass01.176']} />
        </group>
        <group name="U3DMesh003_grass01003_0028" position={[0.035, 0.11, -0.338]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0077" geometry={nodes.U3DMesh003_grass01003_0077.geometry} material={materials['grass01.177']} />
          <mesh name="U3DMesh003_grass01003_0077_1" geometry={nodes.U3DMesh003_grass01003_0077_1.geometry} material={materials['grass01.178']} />
          <mesh name="U3DMesh003_grass01003_0077_2" geometry={nodes.U3DMesh003_grass01003_0077_2.geometry} material={materials['grass01.179']} />
          <mesh name="U3DMesh003_grass01003_0077_3" geometry={nodes.U3DMesh003_grass01003_0077_3.geometry} material={materials['grass01.180']} />
          <mesh name="U3DMesh003_grass01003_0077_4" geometry={nodes.U3DMesh003_grass01003_0077_4.geometry} material={materials['grass01.181']} />
        </group>
        <group name="U3DMesh003_grass01003_0029" position={[-0.196, 0.091, -0.311]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0078" geometry={nodes.U3DMesh003_grass01003_0078.geometry} material={materials['grass01.182']} />
          <mesh name="U3DMesh003_grass01003_0078_1" geometry={nodes.U3DMesh003_grass01003_0078_1.geometry} material={materials['grass01.183']} />
          <mesh name="U3DMesh003_grass01003_0078_2" geometry={nodes.U3DMesh003_grass01003_0078_2.geometry} material={materials['grass01.184']} />
          <mesh name="U3DMesh003_grass01003_0078_3" geometry={nodes.U3DMesh003_grass01003_0078_3.geometry} material={materials['grass01.185']} />
          <mesh name="U3DMesh003_grass01003_0078_4" geometry={nodes.U3DMesh003_grass01003_0078_4.geometry} material={materials['grass01.186']} />
        </group>
        <group name="U3DMesh003_grass01003_0032" position={[-0.149, 0.122, -0.185]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0081" geometry={nodes.U3DMesh003_grass01003_0081.geometry} material={materials['grass01.197']} />
          <mesh name="U3DMesh003_grass01003_0081_1" geometry={nodes.U3DMesh003_grass01003_0081_1.geometry} material={materials['grass01.198']} />
          <mesh name="U3DMesh003_grass01003_0081_2" geometry={nodes.U3DMesh003_grass01003_0081_2.geometry} material={materials['grass01.199']} />
          <mesh name="U3DMesh003_grass01003_0081_3" geometry={nodes.U3DMesh003_grass01003_0081_3.geometry} material={materials['grass01.200']} />
          <mesh name="U3DMesh003_grass01003_0081_4" geometry={nodes.U3DMesh003_grass01003_0081_4.geometry} material={materials['grass01.201']} />
        </group>
        <mesh name="U3DMesh003_grass01003_0033" geometry={nodes.U3DMesh003_grass01003_0033.geometry} material={materials['grass01.041']} position={[-0.1, 0.118, -0.058]} scale={0} />
        <group name="U3DMesh003_grass01003_0034" position={[-0.251, 0.112, -0.197]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0082" geometry={nodes.U3DMesh003_grass01003_0082.geometry} material={materials['grass01.202']} />
          <mesh name="U3DMesh003_grass01003_0082_1" geometry={nodes.U3DMesh003_grass01003_0082_1.geometry} material={materials['grass01.203']} />
          <mesh name="U3DMesh003_grass01003_0082_2" geometry={nodes.U3DMesh003_grass01003_0082_2.geometry} material={materials['grass01.204']} />
          <mesh name="U3DMesh003_grass01003_0082_3" geometry={nodes.U3DMesh003_grass01003_0082_3.geometry} material={materials['grass01.205']} />
          <mesh name="U3DMesh003_grass01003_0082_4" geometry={nodes.U3DMesh003_grass01003_0082_4.geometry} material={materials['grass01.206']} />
        </group>
        <group name="U3DMesh003_grass01003_0038" position={[0.259, 0.062, -0.151]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0086" geometry={nodes.U3DMesh003_grass01003_0086.geometry} material={materials['grass01.222']} />
          <mesh name="U3DMesh003_grass01003_0086_1" geometry={nodes.U3DMesh003_grass01003_0086_1.geometry} material={materials['grass01.223']} />
          <mesh name="U3DMesh003_grass01003_0086_2" geometry={nodes.U3DMesh003_grass01003_0086_2.geometry} material={materials['grass01.224']} />
          <mesh name="U3DMesh003_grass01003_0086_3" geometry={nodes.U3DMesh003_grass01003_0086_3.geometry} material={materials['grass01.225']} />
          <mesh name="U3DMesh003_grass01003_0086_4" geometry={nodes.U3DMesh003_grass01003_0086_4.geometry} material={materials['grass01.226']} />
        </group>
        <mesh name="U3DMesh003_grass01003_0045" geometry={nodes.U3DMesh003_grass01003_0045.geometry} material={materials['grass01.001']} position={[-0.063, 0.117, -0.062]} scale={0} />
        <mesh name="U3DMesh003_grass01003_0046" geometry={nodes.U3DMesh003_grass01003_0046.geometry} material={materials['grass01.002']} position={[-0.019, 0.11, -0.012]} scale={0} />
        <mesh name="U3DMesh003_grass01003_0047" geometry={nodes.U3DMesh003_grass01003_0047.geometry} material={materials['grass01.003']} position={[-0.02, 0.109, -0.065]} scale={0} />
        <mesh name="U3DMesh003_grass01003_0048" geometry={nodes.U3DMesh003_grass01003_0048.geometry} material={materials['grass01.004']} position={[0.02, 0.111, -0.02]} scale={0} />
        <mesh name="BANCA_0" geometry={nodes.BANCA_0.geometry} material={materials['Material.001']} position={[0.341, 0.126, -0.092]} rotation={[1.558, 0.087, -0.72]} scale={[-0.035, -0.001, -0.001]} />
        <group name="U3DMesh003_grass01003_0042" position={[0.171, 0.109, -0.333]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0002" geometry={nodes.U3DMesh003_grass01003_0002.geometry} material={materials['grass01.013']} />
          <mesh name="U3DMesh003_grass01003_0002_1" geometry={nodes.U3DMesh003_grass01003_0002_1.geometry} material={materials['grass01.014']} />
          <mesh name="U3DMesh003_grass01003_0002_2" geometry={nodes.U3DMesh003_grass01003_0002_2.geometry} material={materials['grass01.015']} />
          <mesh name="U3DMesh003_grass01003_0002_3" geometry={nodes.U3DMesh003_grass01003_0002_3.geometry} material={materials['grass01.016']} />
          <mesh name="U3DMesh003_grass01003_0002_4" geometry={nodes.U3DMesh003_grass01003_0002_4.geometry} material={materials['grass01.017']} />
        </group>
        <mesh name="xenith_logo" geometry={nodes.xenith_logo.geometry} material={materials['Gold.003']} position={[0.009, 0.5, 0.001]} rotation={[Math.PI / 2, 0.092, 0]} scale={0.02} />
        <group name="U3DMesh003_grass01003_0043" position={[0.272, 0.109, 0.149]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0003_1" geometry={nodes.U3DMesh003_grass01003_0003_1.geometry} material={materials['grass01.018']} />
          <mesh name="U3DMesh003_grass01003_0003_2" geometry={nodes.U3DMesh003_grass01003_0003_2.geometry} material={materials['grass01.019']} />
          <mesh name="U3DMesh003_grass01003_0003_3" geometry={nodes.U3DMesh003_grass01003_0003_3.geometry} material={materials['grass01.020']} />
          <mesh name="U3DMesh003_grass01003_0003_4" geometry={nodes.U3DMesh003_grass01003_0003_4.geometry} material={materials['grass01.021']} />
          <mesh name="U3DMesh003_grass01003_0003_5" geometry={nodes.U3DMesh003_grass01003_0003_5.geometry} material={materials['grass01.022']} />
        </group>
        <group name="U3DMesh003_grass01003_0044" position={[0.342, 0.109, 0.057]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0004" geometry={nodes.U3DMesh003_grass01003_0004.geometry} material={materials['grass01.023']} />
          <mesh name="U3DMesh003_grass01003_0004_1" geometry={nodes.U3DMesh003_grass01003_0004_1.geometry} material={materials['grass01.024']} />
          <mesh name="U3DMesh003_grass01003_0004_2" geometry={nodes.U3DMesh003_grass01003_0004_2.geometry} material={materials['grass01.025']} />
          <mesh name="U3DMesh003_grass01003_0004_3" geometry={nodes.U3DMesh003_grass01003_0004_3.geometry} material={materials['grass01.026']} />
          <mesh name="U3DMesh003_grass01003_0004_4" geometry={nodes.U3DMesh003_grass01003_0004_4.geometry} material={materials['grass01.027']} />
        </group>
        <group name="U3DMesh003_grass01003_0049" position={[-0.142, 0.115, -0.225]} rotation={[0.3, 0, 0]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0005" geometry={nodes.U3DMesh003_grass01003_0005.geometry} material={materials['grass01.028']} />
          <mesh name="U3DMesh003_grass01003_0005_1" geometry={nodes.U3DMesh003_grass01003_0005_1.geometry} material={materials['grass01.029']} />
          <mesh name="U3DMesh003_grass01003_0005_2" geometry={nodes.U3DMesh003_grass01003_0005_2.geometry} material={materials['grass01.030']} />
          <mesh name="U3DMesh003_grass01003_0005_3" geometry={nodes.U3DMesh003_grass01003_0005_3.geometry} material={materials['grass01.031']} />
          <mesh name="U3DMesh003_grass01003_0005_4" geometry={nodes.U3DMesh003_grass01003_0005_4.geometry} material={materials['grass01.032']} />
        </group>
        <group name="U3DMesh003_grass01003_0052" position={[0.217, 0.112, -0.209]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0008" geometry={nodes.U3DMesh003_grass01003_0008.geometry} material={materials['grass01.044']} />
          <mesh name="U3DMesh003_grass01003_0008_1" geometry={nodes.U3DMesh003_grass01003_0008_1.geometry} material={materials['grass01.045']} />
          <mesh name="U3DMesh003_grass01003_0008_2" geometry={nodes.U3DMesh003_grass01003_0008_2.geometry} material={materials['grass01.046']} />
          <mesh name="U3DMesh003_grass01003_0008_3" geometry={nodes.U3DMesh003_grass01003_0008_3.geometry} material={materials['grass01.047']} />
          <mesh name="U3DMesh003_grass01003_0008_4" geometry={nodes.U3DMesh003_grass01003_0008_4.geometry} material={materials['grass01.048']} />
        </group>
        <group name="U3DMesh003_grass01003_0054" position={[0.21, 0.11, 0.263]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0010_1" geometry={nodes.U3DMesh003_grass01003_0010_1.geometry} material={materials['grass01.238']} />
          <mesh name="U3DMesh003_grass01003_0010_2" geometry={nodes.U3DMesh003_grass01003_0010_2.geometry} material={materials['grass01.239']} />
          <mesh name="U3DMesh003_grass01003_0010_3" geometry={nodes.U3DMesh003_grass01003_0010_3.geometry} material={materials['grass01.240']} />
          <mesh name="U3DMesh003_grass01003_0010_4" geometry={nodes.U3DMesh003_grass01003_0010_4.geometry} material={materials['grass01.241']} />
          <mesh name="U3DMesh003_grass01003_0010_5" geometry={nodes.U3DMesh003_grass01003_0010_5.geometry} material={materials['grass01.242']} />
        </group>
        <group name="U3DMesh003_grass01003_0057" position={[0.342, 0.108, 0.165]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0013_1" geometry={nodes.U3DMesh003_grass01003_0013_1.geometry} material={materials['grass01.253']} />
          <mesh name="U3DMesh003_grass01003_0013_2" geometry={nodes.U3DMesh003_grass01003_0013_2.geometry} material={materials['grass01.254']} />
          <mesh name="U3DMesh003_grass01003_0013_3" geometry={nodes.U3DMesh003_grass01003_0013_3.geometry} material={materials['grass01.255']} />
          <mesh name="U3DMesh003_grass01003_0013_4" geometry={nodes.U3DMesh003_grass01003_0013_4.geometry} material={materials['grass01.256']} />
          <mesh name="U3DMesh003_grass01003_0013_5" geometry={nodes.U3DMesh003_grass01003_0013_5.geometry} material={materials['grass01.257']} />
        </group>
        <group name="U3DMesh003_grass01003_0059" position={[-0.142, 0.108, -0.357]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0015_1" geometry={nodes.U3DMesh003_grass01003_0015_1.geometry} material={materials['grass01.263']} />
          <mesh name="U3DMesh003_grass01003_0015_2" geometry={nodes.U3DMesh003_grass01003_0015_2.geometry} material={materials['grass01.264']} />
          <mesh name="U3DMesh003_grass01003_0015_3" geometry={nodes.U3DMesh003_grass01003_0015_3.geometry} material={materials['grass01.265']} />
          <mesh name="U3DMesh003_grass01003_0015_4" geometry={nodes.U3DMesh003_grass01003_0015_4.geometry} material={materials['grass01.266']} />
          <mesh name="U3DMesh003_grass01003_0015_5" geometry={nodes.U3DMesh003_grass01003_0015_5.geometry} material={materials['grass01.267']} />
        </group>
        <group name="U3DMesh003_grass01003_0060" position={[-0.069, 0.108, -0.376]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0016" geometry={nodes.U3DMesh003_grass01003_0016.geometry} material={materials['grass01.268']} />
          <mesh name="U3DMesh003_grass01003_0016_1" geometry={nodes.U3DMesh003_grass01003_0016_1.geometry} material={materials['grass01.269']} />
          <mesh name="U3DMesh003_grass01003_0016_2" geometry={nodes.U3DMesh003_grass01003_0016_2.geometry} material={materials['grass01.270']} />
          <mesh name="U3DMesh003_grass01003_0016_3" geometry={nodes.U3DMesh003_grass01003_0016_3.geometry} material={materials['grass01.271']} />
          <mesh name="U3DMesh003_grass01003_0016_4" geometry={nodes.U3DMesh003_grass01003_0016_4.geometry} material={materials['grass01.272']} />
        </group>
        <group name="U3DMesh003_grass01003_0063" position={[0.275, 0.11, -0.287]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0019" geometry={nodes.U3DMesh003_grass01003_0019.geometry} material={materials['grass01.283']} />
          <mesh name="U3DMesh003_grass01003_0019_1" geometry={nodes.U3DMesh003_grass01003_0019_1.geometry} material={materials['grass01.284']} />
          <mesh name="U3DMesh003_grass01003_0019_2" geometry={nodes.U3DMesh003_grass01003_0019_2.geometry} material={materials['grass01.285']} />
          <mesh name="U3DMesh003_grass01003_0019_3" geometry={nodes.U3DMesh003_grass01003_0019_3.geometry} material={materials['grass01.286']} />
          <mesh name="U3DMesh003_grass01003_0019_4" geometry={nodes.U3DMesh003_grass01003_0019_4.geometry} material={materials['grass01.287']} />
        </group>
        <group name="U3DMesh003_grass01003_0064" position={[-0.194, 0.106, -0.058]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0020_1" geometry={nodes.U3DMesh003_grass01003_0020_1.geometry} material={materials['grass01.288']} />
          <mesh name="U3DMesh003_grass01003_0020_2" geometry={nodes.U3DMesh003_grass01003_0020_2.geometry} material={materials['grass01.289']} />
          <mesh name="U3DMesh003_grass01003_0020_3" geometry={nodes.U3DMesh003_grass01003_0020_3.geometry} material={materials['grass01.290']} />
          <mesh name="U3DMesh003_grass01003_0020_4" geometry={nodes.U3DMesh003_grass01003_0020_4.geometry} material={materials['grass01.291']} />
          <mesh name="U3DMesh003_grass01003_0020_5" geometry={nodes.U3DMesh003_grass01003_0020_5.geometry} material={materials['grass01.292']} />
        </group>
        <group name="U3DMesh003_grass01003_0067" position={[-0.33, 0.106, 0.022]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0023" geometry={nodes.U3DMesh003_grass01003_0023.geometry} material={materials['grass01.303']} />
          <mesh name="U3DMesh003_grass01003_0023_1" geometry={nodes.U3DMesh003_grass01003_0023_1.geometry} material={materials['grass01.304']} />
          <mesh name="U3DMesh003_grass01003_0023_2" geometry={nodes.U3DMesh003_grass01003_0023_2.geometry} material={materials['grass01.305']} />
          <mesh name="U3DMesh003_grass01003_0023_3" geometry={nodes.U3DMesh003_grass01003_0023_3.geometry} material={materials['grass01.306']} />
          <mesh name="U3DMesh003_grass01003_0023_4" geometry={nodes.U3DMesh003_grass01003_0023_4.geometry} material={materials['grass01.307']} />
        </group>
        <group name="U3DMesh003_grass01003_0069" position={[-0.193, 0.109, 0.221]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0025_1" geometry={nodes.U3DMesh003_grass01003_0025_1.geometry} material={materials['grass01.313']} />
          <mesh name="U3DMesh003_grass01003_0025_2" geometry={nodes.U3DMesh003_grass01003_0025_2.geometry} material={materials['grass01.314']} />
          <mesh name="U3DMesh003_grass01003_0025_3" geometry={nodes.U3DMesh003_grass01003_0025_3.geometry} material={materials['grass01.315']} />
          <mesh name="U3DMesh003_grass01003_0025_4" geometry={nodes.U3DMesh003_grass01003_0025_4.geometry} material={materials['grass01.316']} />
          <mesh name="U3DMesh003_grass01003_0025_5" geometry={nodes.U3DMesh003_grass01003_0025_5.geometry} material={materials['grass01.317']} />
        </group>
        <group name="U3DMesh003_grass01003_0072" position={[-0.085, 0.11, 0.279]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0028_1" geometry={nodes.U3DMesh003_grass01003_0028_1.geometry} material={materials['grass01.328']} />
          <mesh name="U3DMesh003_grass01003_0028_2" geometry={nodes.U3DMesh003_grass01003_0028_2.geometry} material={materials['grass01.329']} />
          <mesh name="U3DMesh003_grass01003_0028_3" geometry={nodes.U3DMesh003_grass01003_0028_3.geometry} material={materials['grass01.330']} />
          <mesh name="U3DMesh003_grass01003_0028_4" geometry={nodes.U3DMesh003_grass01003_0028_4.geometry} material={materials['grass01.331']} />
          <mesh name="U3DMesh003_grass01003_0028_5" geometry={nodes.U3DMesh003_grass01003_0028_5.geometry} material={materials['grass01.332']} />
        </group>
        <group name="U3DMesh003_grass01003_0073" position={[-0.027, 0.111, 0.292]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0029_1" geometry={nodes.U3DMesh003_grass01003_0029_1.geometry} material={materials['grass01.333']} />
          <mesh name="U3DMesh003_grass01003_0029_2" geometry={nodes.U3DMesh003_grass01003_0029_2.geometry} material={materials['grass01.334']} />
          <mesh name="U3DMesh003_grass01003_0029_3" geometry={nodes.U3DMesh003_grass01003_0029_3.geometry} material={materials['grass01.335']} />
          <mesh name="U3DMesh003_grass01003_0029_4" geometry={nodes.U3DMesh003_grass01003_0029_4.geometry} material={materials['grass01.336']} />
          <mesh name="U3DMesh003_grass01003_0029_5" geometry={nodes.U3DMesh003_grass01003_0029_5.geometry} material={materials['grass01.337']} />
        </group>
        <group name="U3DMesh003_grass01003_0076" position={[0.397, 0.109, -0.074]} scale={0}>
          <mesh name="U3DMesh003_grass01003_0032_1" geometry={nodes.U3DMesh003_grass01003_0032_1.geometry} material={materials['grass01.348']} />
          <mesh name="U3DMesh003_grass01003_0032_2" geometry={nodes.U3DMesh003_grass01003_0032_2.geometry} material={materials['grass01.349']} />
          <mesh name="U3DMesh003_grass01003_0032_3" geometry={nodes.U3DMesh003_grass01003_0032_3.geometry} material={materials['grass01.350']} />
          <mesh name="U3DMesh003_grass01003_0032_4" geometry={nodes.U3DMesh003_grass01003_0032_4.geometry} material={materials['grass01.351']} />
          <mesh name="U3DMesh003_grass01003_0032_5" geometry={nodes.U3DMesh003_grass01003_0032_5.geometry} material={materials['grass01.352']} />
        </group>
        <group name="Plane_1021" position={[0.198, 0.103, -0.338]} rotation={[-Math.PI / 2, 0, 0]} scale={0.004}>
          <mesh name="Plane_1006" geometry={nodes.Plane_1006.geometry} material={materials['Material.080']} />
          <mesh name="Plane_1006_1" geometry={nodes.Plane_1006_1.geometry} material={materials['Material.081']} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/island2.glb')
