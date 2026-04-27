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

      // Random function for stars
      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        vec2 uv = vUv;
        
        // Deep background gradient (Dark Gray/Blue to Pure Black)
        vec3 colorTop = vec3(0.04, 0.05, 0.08);
        vec3 colorBottom = vec3(0.01, 0.01, 0.01);
        vec3 bgColor = mix(colorBottom, colorTop, uv.y);

        // Subtle Parallax based on mouse
        vec2 parallaxUv = uv + (mouse * 0.02);
        
        // Starfield effect
        float starValue = random(parallaxUv * 100.0);
        float starIntensity = 0.0;
        
        // Only show very sparse stars
        if (starValue > 0.995) {
            starIntensity = 1.0;
        } else if (starValue > 0.990) {
            starIntensity = 0.5;
        }

        // Add subtle twinkle
        starIntensity *= (sin(time * 2.0 + starValue * 10.0) * 0.5 + 0.5);

        vec3 starColor = vec3(1.0, 1.0, 1.0) * starIntensity;

        vec3 finalColor = bgColor + starColor;

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
