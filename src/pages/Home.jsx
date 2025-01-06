import { Canvas, useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import * as THREE from 'three';
import { Suspense, useEffect, useRef, useState } from "react";

import sakura from "../assets/sakura.mp3";
import { HomeInfo, Loader } from "../components";
import { soundoff, soundon } from "../assets/icons";
import { Bird, Island2, Plane, Sky } from "../models";

// Create snow texture once
const createSnowTexture = () => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  // Draw a circular gradient
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  context.closePath();

  const gradient = context.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  context.fillStyle = gradient;
  context.fill();

  return new THREE.CanvasTexture(canvas);
};

// Create snow particles once
const createSnowParticles = () => {
  const particleCount = 2000; // Increased particle count for more noticeable snowfall
  const particles = new THREE.BufferGeometry();

  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.random() * 400 - 200; // Adjusted to make snow further away
    positions[i * 3 + 1] = Math.random() * 400 - 200; // Adjusted to make snow further away
    positions[i * 3 + 2] = Math.random() * 400 - 200; // Adjusted to make snow further away

    velocities[i] = Math.random() * 0.1 + 0.05; // Increased falling speed
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 5, // Increased size for more noticeable particles
    map: createSnowTexture(),
    transparent: true,
  });

  return new THREE.Points(particles, particleMaterial);
};

const snowParticles = createSnowParticles(); // Create snow particles once

const LoadingButton = ({ onStart, isModelLoaded }) => {
  const { progress } = useProgress();
  
  return (
    <button 
      onClick={() => isModelLoaded && onStart()}
      className={`px-6 py-3 bg-blue-600 rounded-lg relative overflow-hidden transition-colors
        ${isModelLoaded ? 'hover:bg-blue-700' : 'cursor-not-allowed opacity-70'}`}
      disabled={!isModelLoaded}
    >
      <div className="relative z-10">
        {isModelLoaded ? 'Explore The World of Xenith' : 'Loading...'}
      </div>
      {!isModelLoaded && (
        <div 
          className="absolute left-0 bottom-0 h-full bg-blue-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
    </button>
  );
};

const Home = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    if (isPlayingMusic) {
      audioRef.current.play();
    }

    return () => {
      audioRef.current.pause();
    };
  }, [isPlayingMusic]);

  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    // If screen width is less than 768px, adjust the scale and position
    if (window.innerWidth < 768) {
      screenScale = [0.002, 0.002, 0.002];      // Increased scale for mobile
      screenPosition = [0, -1, 0];            // Adjusted position to be more visible
    } else {
      screenScale = [0.005, 0.005, 0.005];
      screenPosition = [0, -2, -4];
    }

    return [screenScale, screenPosition];
  };

  const adjustIslandForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [35, 35, 35];  // increased from [0.9, 0.9, 0.9]
      screenPosition = [0, -6.5, -43.4];
    } else {
      screenScale = [65, 65, 65];  // increased from [1, 1, 1]
      screenPosition = [0, -6.5, -55.4];
    }

    return [screenScale, screenPosition];
  };

  const animateSnow = (particles) => {
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.attributes.velocity.array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= velocities[i / 3];
      if (positions[i + 1] < -100) {
        positions[i + 1] = 100;
      }
    }

    particles.geometry.attributes.position.needsUpdate = true;
  };

  const SnowParticles = () => {
    const particles = useRef(snowParticles); // Use the pre-created snow particles

    useFrame(() => {
      animateSnow(particles.current);
    });

    return <primitive object={particles.current} />;
  };

  const LoadingManager = () => {
    const { progress } = useProgress();
    
    useEffect(() => {
      if (progress === 100) {
        setIsModelLoaded(true);
      }
    }, [progress]);

    return null;
  };

  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();
  const [islandScale, islandPosition] = adjustIslandForScreenSize();

  return (
    <section className='w-full h-screen relative'>
      <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-20 transition-opacity duration-500 ${hasStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <h1 className="text-2xl md:text-4xl font-bold mb-6 px-4 text-center">Some Yapping About Xenith.....</h1>
        <LoadingButton 
          onStart={() => setHasStarted(true)} 
          isModelLoaded={isModelLoaded}
        />
      </div>

      <div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center'>
        {currentStage && hasStarted && <HomeInfo currentStage={currentStage} />}
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <LoadingManager />
        <Bird />
        <Plane
            isRotating={isRotating}
            position={biplanePosition}
            rotation={[0, 20.1, 0]}
            scale={biplaneScale}
          />
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 5, 10]} intensity={2} />
          <spotLight
            position={[0, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
          <hemisphereLight
            skyColor='#b1e1ff'
            groundColor='#000000'
            intensity={1}
          />

          
          <Sky isRotating={0} />
          <Island2
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            position={islandPosition}
            rotation={[0.1, 4.7077, 0]} // Updated initial rotation to match new minimum height
            scale={islandScale}
          />
          <SnowParticles />
       
        </Suspense>
      </Canvas>

      {hasStarted && (
        <div className='absolute bottom-2 left-2'>
          <img
            src={!isPlayingMusic ? soundoff : soundon}
            alt='jukebox'
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            className='w-10 h-10 cursor-pointer object-contain'
          />
        </div>
      )}
    </section>
  );
};

export default Home;
