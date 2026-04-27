import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  isHovering?: boolean;
}

export default function ParticleSystem({ count = 2000, isHovering = false }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { mouse, viewport } = useThree();

  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Store: x = radius, y = height, z = angle
      const radius = 2 + Math.random() * 8; // Spread out more
      const height = (Math.random() - 0.5) * 4;
      const angle = Math.random() * Math.PI * 2;
      
      pos[i * 3] = radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = angle;
      
      // Random value for speed variation
      rand[i] = 0.5 + Math.random() * 0.5;
    }
    return { positions: pos, randoms: rand };
  }, [count]);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      mouse: { value: new THREE.Vector2() },
      isHovering: { value: 0.0 },
      pixelRatio: { value: Math.min(window.devicePixelRatio, 2.0) }
    },
    vertexShader: `
      uniform float time;
      uniform vec2 mouse;
      uniform float isHovering;
      uniform float pixelRatio;
      
      attribute float aRandom;
      
      varying float vAlpha;

      void main() {
        float radius = position.x;
        float height = position.y;
        float angle = position.z;
        
        // Orbit motion (slower, smoother)
        float currentAngle = angle + time * 0.05 * aRandom;
        
        // Calculate 3D position
        vec3 finalPos;
        finalPos.x = cos(currentAngle) * radius;
        finalPos.z = sin(currentAngle) * radius;
        finalPos.y = height + sin(time * aRandom + radius) * 0.5; // slight bobbing
        
        // Mouse gravity interaction
        // Map mouse from screen to approximate 3D world coords at z=0 plane
        vec3 mouseWorld = vec3(mouse.x * 10.0, mouse.y * 10.0, 0.0);
        
        float distToMouse = distance(finalPos.xy, mouseWorld.xy);
        float pullStrength = smoothstep(5.0, 0.0, distToMouse); // Closer = stronger pull
        
        // If hovering text, amplify the general energy and mouse pull
        float hoverFactor = mix(1.0, 2.5, isHovering);
        
        // Pull particles toward mouse slightly (add epsilon to avoid NaN glitches)
        vec3 dirToMouse = normalize(mouseWorld - finalPos + vec3(0.0001));
        finalPos += dirToMouse * pullStrength * 1.5 * hoverFactor;
        
        vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size attenuation based on depth
        gl_PointSize = (4.0 * aRandom * pixelRatio * hoverFactor) * (15.0 / -mvPosition.z);
        
        // Fade out particles that are far or pulled too much
        vAlpha = clamp(mix(0.1, 0.8, aRandom) + (pullStrength * 0.5), 0.0, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      
      void main() {
        // Create soft circular particles
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        
        // Soft glowing edge
        float glow = exp(-dist * 3.0) * (1.0 - dist * 2.0);
        glow = clamp(glow, 0.0, 1.0);
        
        // Cyan-ish color
        vec3 color = vec3(0.0, 0.8, 1.0);
        
        gl_FragColor = vec4(color, vAlpha * glow);
      }
    `
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      
      // Smooth mouse tracking
      materialRef.current.uniforms.mouse.value.set(
        THREE.MathUtils.lerp(materialRef.current.uniforms.mouse.value.x, mouse.x, 0.05),
        THREE.MathUtils.lerp(materialRef.current.uniforms.mouse.value.y, mouse.y, 0.05)
      );
      
      // Smooth hover transition
      const targetHover = isHovering ? 1.0 : 0.0;
      materialRef.current.uniforms.isHovering.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.isHovering.value,
        targetHover,
        0.1
      );
    }
    
    // Slowly rotate the whole system
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
