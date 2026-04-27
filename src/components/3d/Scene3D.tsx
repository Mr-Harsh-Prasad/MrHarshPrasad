import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ParticleSystem from './ParticleSystem';
import BackgroundNebula from './BackgroundNebula';
import Effects from './Effects';
import { PerspectiveCamera } from '@react-three/drei';

interface Scene3DProps {
  isHovering?: boolean;
}

export default function Scene3D({ isHovering = false }: Scene3DProps) {
  return (
    <Canvas
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      dpr={[1, 2]}
      gl={{ antialias: false }} // postprocessing handles antialiasing
    >
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
      
      <color attach="background" args={['#050505']} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Suspense fallback={null}>
        <BackgroundNebula />
        <ParticleSystem count={2000} isHovering={isHovering} />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
