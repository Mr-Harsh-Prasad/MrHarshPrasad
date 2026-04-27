import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function BackgroundNebula() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, mouse } = useThree();

  const shaderArgs = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      mouse: { value: new THREE.Vector2() },
      resolution: { value: new THREE.Vector2(viewport.width, viewport.height) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec2 mouse;
      uniform vec2 resolution;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        
        // Deep background gradient (Dark Gray/Blue to Pure Black)
        vec3 colorTop = vec3(0.04, 0.05, 0.08);
        vec3 colorBottom = vec3(0.01, 0.01, 0.01);
        vec3 bgColor = mix(colorBottom, colorTop, uv.y);

        // Subtle Parallax based on mouse
        vec2 parallaxUv = uv + (mouse * 0.05);
        
        // Smooth flowing nebula instead of glitchy stars
        float t = time * 0.2;
        float n1 = sin(parallaxUv.x * 4.0 + t) * cos(parallaxUv.y * 4.0 + t * 0.8);
        float n2 = sin(parallaxUv.x * 8.0 - t * 0.5) * cos(parallaxUv.y * 8.0 - t * 0.6);
        float nebula = smoothstep(0.2, 0.8, (n1 + n2 * 0.5) * 0.5 + 0.5);
        
        // Cyan/blue soft glow
        vec3 nebulaColor = vec3(0.0, 0.6, 1.0) * nebula * 0.1;

        vec3 finalColor = bgColor + nebulaColor;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  }), [viewport]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.mouse.value.set(
        THREE.MathUtils.lerp(materialRef.current.uniforms.mouse.value.x, mouse.x, 0.05),
        THREE.MathUtils.lerp(materialRef.current.uniforms.mouse.value.y, mouse.y, 0.05)
      );
    }
  });

  return (
    <mesh renderOrder={-1}>
      {/* Full screen quad */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
