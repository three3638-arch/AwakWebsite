import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 p = (uv - 0.5) * aspect;
    vec2 pointer = uPointer * vec2(0.18, -0.12);

    float t = uTime * 0.055;
    float flow = noise(p * 2.2 + vec2(t, -t * 0.7));
    float flow2 = noise(p * 4.4 + vec2(-t * 1.3, t));

    float glowA = smoothstep(0.82, 0.0, length(p - vec2(-0.34, 0.18) - pointer));
    float glowB = smoothstep(0.74, 0.0, length(p - vec2(0.42, -0.22) + pointer * 0.7));
    float breath = 0.62 + 0.38 * sin(uTime * 0.42);

    vec3 base = vec3(0.004, 0.005, 0.006);
    vec3 acid = vec3(0.62, 0.78, 0.0);
    vec3 cyan = vec3(0.03, 0.22, 0.28);
    vec3 violet = vec3(0.12, 0.10, 0.22);

    vec3 color = base;
    color += acid * glowA * (0.10 + flow * 0.08) * breath;
    color += cyan * glowB * (0.18 + flow2 * 0.10);
    color += violet * smoothstep(0.95, 0.05, length(p)) * 0.22;
    color += vec3(flow * flow2) * 0.012;

    float vignette = smoothstep(1.1, 0.18, length(p));
    float grain = hash(uv * uResolution + uTime) * 0.018;
    gl_FragColor = vec4(color * vignette + grain, 0.72);
  }
`;

export default function HomeAmbientWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 1024px)');
    if (reduce.matches || !desktop.matches) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    );
    scene.add(mesh);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    const pointer = (event: PointerEvent) => {
      uniforms.uPointer.value.set(event.clientX / window.innerWidth - 0.5, event.clientY / window.innerHeight - 0.5);
    };

    let raf = 0;
    const start = performance.now();
    const render = () => {
      uniforms.uTime.value = (performance.now() - start) / 1000;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', pointer, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', pointer);
      mesh.geometry.dispose();
      mesh.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="home-webgl-ambient" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
