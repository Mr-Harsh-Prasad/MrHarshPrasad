'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Animated Blob - Morphing 3D sphere with distortion
 */
function AnimatedBlob() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        // Slow gentle rotation
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[2, 0, -2]}>
                <MeshDistortMaterial
                    color="#6366f1"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

/**
 * Particle Field - Floating particles creating depth
 */
function ParticleField() {
    const particlesRef = useRef<THREE.Points>(null);
    const count = 500;

    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 15;
            positions[i + 1] = (Math.random() - 0.5) * 15;
            positions[i + 2] = (Math.random() - 0.5) * 10;
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (!particlesRef.current) return;
        particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#8b5cf6"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

/**
 * Gradient Orb - Secondary floating orb with different color
 */
function GradientOrb() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <Sphere ref={meshRef} args={[0.8, 32, 32]} position={[-3, 1, -3]}>
                <MeshDistortMaterial
                    color="#ec4899"
                    attach="material"
                    distort={0.3}
                    speed={1.5}
                    roughness={0.3}
                    metalness={0.7}
                    transparent
                    opacity={0.7}
                />
            </Sphere>
        </Float>
    );
}

/**
 * Small Accent Orbs - Smaller floating spheres for visual interest
 */
function AccentOrbs() {
    return (
        <>
            <Float speed={3} rotationIntensity={0.2} floatIntensity={0.8}>
                <Sphere args={[0.3, 16, 16]} position={[-2, -2, -1]}>
                    <meshStandardMaterial color="#a855f7" metalness={0.9} roughness={0.1} />
                </Sphere>
            </Float>
            <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
                <Sphere args={[0.2, 16, 16]} position={[3, 2, -2]}>
                    <meshStandardMaterial color="#06b6d4" metalness={0.9} roughness={0.1} />
                </Sphere>
            </Float>
        </>
    );
}

/**
 * HeroBackground - Main 3D scene for hero section
 */
export default function HeroBackground() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
                <pointLight position={[10, -5, 0]} intensity={0.3} color="#ec4899" />

                {/* 3D Elements */}
                <AnimatedBlob />
                <GradientOrb />
                <AccentOrbs />
                <ParticleField />

                {/* Background gradient effect */}
                <mesh position={[0, 0, -10]}>
                    <planeGeometry args={[50, 50]} />
                    <meshBasicMaterial color="#050510" />
                </mesh>
            </Canvas>

            {/* Radial gradient overlay for depth */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 16, 0.5) 50%, rgba(5, 5, 16, 0.9) 100%)',
                }}
            />
        </div>
    );
}
