'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Seeded random for consistent particle generation
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface HeroScene3DProps {
  isReducedMotion?: boolean;
}

export function HeroScene3DCanvas({ isReducedMotion = false }: HeroScene3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const gridRef = useRef<THREE.LineSegments>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const [webglAvailable, setWebglAvailable] = useState(true);
  const { mouse, camera, gl } = useThree();

  // Refs for mutable values to avoid lint warnings
  const particleMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    try {
      const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!ctx) {
        setTimeout(() => setWebglAvailable(false), 0);
      }
    } catch {
      setTimeout(() => setWebglAvailable(false), 0);
    }
  }, []);

  // Handle WebGL context loss
  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglAvailable(false);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    return () => canvas.removeEventListener('webglcontextlost', handleContextLost);
  }, [gl]);

  const particleCount = isReducedMotion ? 200 : 800;

  // Generate particle data outside of useMemo to avoid impure function warnings
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount * 3);
    const rand = createSeededRandom(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 4 + rand() * 12;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = 0.5 + rand() * 1.5;
      alphas[i] = 0.2 + rand() * 0.6;

      offsets[i * 3] = rand() * Math.PI * 2;
      offsets[i * 3 + 1] = rand() * Math.PI * 2;
      offsets[i * 3 + 2] = rand() * 0.5 + 0.2;
    }

    return { positions, sizes, alphas, offsets };
  }, [particleCount]);

  const particleGeometry = useMemo(() => {
    const { positions, sizes, alphas, offsets } = particleData;
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    geom.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
    return geom;
  }, [particleData]);

  const particleMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aAlpha;
        attribute vec3 aOffset;
        varying float vAlpha;
        uniform float uTime;
        uniform float uReducedMotion;
        
        void main() {
          vec3 pos = position;
          if (uReducedMotion < 0.5) {
            pos.x += sin(uTime * 0.15 + aOffset.x) * 0.3;
            pos.y += cos(uTime * 0.12 + aOffset.y) * 0.3;
            pos.z += sin(uTime * 0.1 + aOffset.z) * 0.2;
          }
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = aAlpha;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        uniform float uTime;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, dist);
          float pulse = 1.0 + sin(uTime * 2.0 + gl_PointCoord.x * 10.0) * 0.15;
          vec3 color = mix(vec3(0.0, 1.0, 0.8), vec3(0.8, 1.0, 0.0), gl_PointCoord.y);
          gl_FragColor = vec4(color, vAlpha * glow * pulse * 0.6);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uReducedMotion: { value: isReducedMotion ? 1 : 0 },
      },
    });
    return mat;
  }, [isReducedMotion]);

  // Store material ref after render
  useEffect(() => {
    particleMaterialRef.current = particleMaterial;
  }, [particleMaterial]);

  const coreGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.2, 16), []);
  const wireframeGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.6, 8), []);
  const outerRingGeometry = useMemo(() => new THREE.RingGeometry(2.2, 2.4, 64), []);
  const innerRingGeometry = useMemo(() => new THREE.RingGeometry(1.8, 1.9, 32), []);

  const coreMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: 0x00ffcc,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.3,
      thickness: 0.5,
      ior: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.6,
    });
  }, []);

  const wireframeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.4,
      linewidth: 1,
    });
  }, []);

  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0xccff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
  }, []);

  const innerRingMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1,
    });
  }, []);

  const gridGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const gridSize = 40;
    const divisions = 40;
    const step = gridSize / divisions;

    for (let i = 0; i <= divisions; i++) {
      const x = -gridSize / 2 + i * step;
      positions.push(x, 0, -gridSize / 2, x, 0, gridSize / 2);
      positions.push(-gridSize / 2, 0, x, gridSize / 2, 0, x);
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geom;
  }, []);

  const gridMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xccff00,
      transparent: true,
      opacity: 0.06,
    });
  }, []);

  const shouldRender = webglAvailable;

  useFrame((state) => {
    if (!webglAvailable) return;
    
    const t = state.clock.getElapsedTime();
    timeRef.current = t;
    const reduced = isReducedMotion ? 0.05 : 1;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02 * reduced;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.05 * reduced;
    }

    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.15 * reduced;
      coreRef.current.rotation.y = t * 0.1 * reduced;
      coreRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03 * reduced);
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = -t * 0.08 * reduced;
      wireframeRef.current.rotation.y = t * 0.12 * reduced;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.sin(t * 0.3) * 0.3 * reduced;
      ringsRef.current.rotation.y = t * 0.05 * reduced;
      ringsRef.current.rotation.z = Math.cos(t * 0.2) * 0.15 * reduced;
    }

    if (gridRef.current) {
      gridRef.current.position.y = -4 + Math.sin(t * 0.5) * 0.3 * reduced;
      const gridMat = gridRef.current.material as THREE.LineBasicMaterial;
      gridMat.opacity = 0.04 + Math.sin(t * 0.7) * 0.02;
    }

    if (particlesRef.current && particleMaterialRef.current) {
      particleMaterialRef.current.uniforms.uTime.value = t;
      particlesRef.current.rotation.y = t * 0.005 * reduced;
      particlesRef.current.rotation.x = Math.sin(t * 0.1) * 0.02 * reduced;
    }

    if (camera) {
      const targetX = mouse.x * 0.8 * reduced;
      const targetY = -mouse.y * 0.6 * reduced;
      camera.position.lerp(new THREE.Vector3(targetX, targetY, camera.position.z), 0.02);
      camera.lookAt(0, 0, 0);
    }
  });

  if (!shouldRender) return null;

  return (
    <group ref={groupRef}>
      {/* Grid floor */}
      <lineSegments ref={gridRef} geometry={gridGeometry} material={gridMaterial} renderOrder={-1} />

      {/* Atmospheric particles */}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />

      {/* Rotating rings */}
      <group ref={ringsRef}>
        <mesh geometry={outerRingGeometry} material={ringMaterial} />
        <mesh geometry={innerRingGeometry} material={innerRingMaterial} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={innerRingGeometry} material={innerRingMaterial} rotation={[0, Math.PI / 2, 0]} />
      </group>

      {/* Central sculptural object */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.15}>
        <group>
          {/* Outer wireframe shell */}
          <lineSegments
            ref={wireframeRef}
            geometry={new THREE.EdgesGeometry(wireframeGeometry)}
            material={wireframeMaterial}
          />
          
          {/* Inner glowing core */}
          <mesh ref={coreRef} geometry={coreGeometry} material={coreMaterial} />
          
          {/* Subtle glow sphere */}
          <mesh
            geometry={new THREE.SphereGeometry(2.1, 32, 32)}
            material={new THREE.MeshBasicMaterial({
              color: 0xccff00,
              transparent: true,
              opacity: 0.03,
              side: THREE.BackSide,
              depthWrite: false,
            })}
          />
        </group>
      </Float>

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#1a1a1a" />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ccff00" distance={30} decay={2} />
      <pointLight position={[-5, -3, 5]} intensity={0.5} color="#00ffcc" distance={25} decay={2} />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#ffffff" distance={40} decay={2} />
    </group>
  );
}

interface HeroScene3DWrapperProps {
  isReducedMotion?: boolean;
}

export default function HeroScene3DWrapper({ isReducedMotion = false }: HeroScene3DWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 -z-10 bg-[var(--bg-primary)]"
        style={{
          background: 'radial-gradient(ellipse at center, #080808 0%, #030303 50%, #000000 100%)',
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(204,255,0,0.02) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(0,255,204,0.02) 0%, transparent 40%), #030303',
        }}
      />
      <div className="absolute inset-0 grid-pattern" style={{ opacity: 0.3 }} />
      
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ outline: 'none' }}
      >
        <HeroScene3DCanvas isReducedMotion={isReducedMotion} />
      </Canvas>
      
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,3,3,0.6) 100%)',
        }}
      />
    </div>
  );
}