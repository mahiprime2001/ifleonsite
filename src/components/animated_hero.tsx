import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnoAI = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(pointer: coarse)').matches;

    const getSize = () => {
      const r = container.getBoundingClientRect();
      return {
        w: Math.max(1, Math.floor(r.width || window.innerWidth)),
        h: Math.max(1, Math.floor(r.height || window.innerHeight)),
      };
    };
    const { w, h } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(w, h, false);
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const root = new THREE.Group();
    scene.add(root);

    // Inner glowing AI core — custom shader with fresnel + plasma
    const coreGeo = new THREE.IcosahedronGeometry(0.7, isMobile ? 3 : 5);
    const coreMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying float vNoise;
        float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
        float noise(vec3 p){
          vec3 i=floor(p); vec3 f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
                         mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
                     mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                         mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
        }
        void main(){
          float n = noise(position*2.0 + uTime*0.4);
          n += 0.5*noise(position*4.0 - uTime*0.3);
          vNoise = n;
          vec3 displaced = position + normal * n * 0.12;
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
          vPos = mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying float vNoise;
        void main(){
          vec3 viewDir = normalize(-vPos);
          float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.2);
          vec3 cA = vec3(0.10, 0.80, 0.85);
          vec3 cB = vec3(0.55, 0.30, 0.95);
          vec3 cC = vec3(0.20, 0.95, 0.65);
          float m = 0.5 + 0.5*sin(uTime*0.7 + vNoise*3.0);
          vec3 base = mix(cA, cB, m);
          base = mix(base, cC, smoothstep(0.3, 0.9, fres));
          vec3 col = base*0.3 + fres*base*2.3;
          float pulse = 0.9 + 0.2*sin(uTime*1.5);
          gl_FragColor = vec4(col*pulse, 0.55 + fres*0.45);
        }
      `,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    root.add(core);

    // Outer halo — backside-rendered fresnel glow
    const haloGeo = new THREE.SphereGeometry(1.05, isMobile ? 32 : 48, isMobile ? 32 : 48);
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vPos = mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main(){
          vec3 viewDir = normalize(-vPos);
          float fres = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
          float pulse = 0.8 + 0.3*sin(uTime*1.2);
          vec3 col = mix(vec3(0.1,0.9,0.8), vec3(0.6,0.3,1.0), 0.5+0.5*sin(uTime*0.5));
          gl_FragColor = vec4(col * fres * pulse, fres);
        }
      `,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    root.add(halo);

    // Swirling particle vortex around the core
    const swirlCount = isMobile ? 400 : 900;
    const swirlPositions = new Float32Array(swirlCount * 3);
    const swirlSeeds = new Float32Array(swirlCount * 3);
    for (let i = 0; i < swirlCount; i++) {
      const r = 0.9 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const yBias = (Math.random() - 0.5) * 0.7;
      swirlPositions[i * 3] = Math.cos(theta) * r;
      swirlPositions[i * 3 + 1] = yBias;
      swirlPositions[i * 3 + 2] = Math.sin(theta) * r;
      swirlSeeds[i * 3] = r;
      swirlSeeds[i * 3 + 1] = theta;
      swirlSeeds[i * 3 + 2] = yBias;
    }
    const swirlGeo = new THREE.BufferGeometry();
    swirlGeo.setAttribute('position', new THREE.BufferAttribute(swirlPositions, 3));
    const swirlMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: isMobile ? 0.03 : 0.022,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const swirl = new THREE.Points(swirlGeo, swirlMat);
    root.add(swirl);

    // Dotted sphere shell — Fibonacci distribution
    const count = isMobile ? 1000 : 2200;
    const positions = new Float32Array(count * 3);
    const shellRadius = 1.7;
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * 2.399963;
      positions[i * 3] = Math.cos(theta) * r * shellRadius;
      positions[i * 3 + 1] = y * shellRadius;
      positions[i * 3 + 2] = Math.sin(theta) * r * shellRadius;
    }
    const shellGeo = new THREE.BufferGeometry();
    shellGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const shellMat = new THREE.PointsMaterial({
      color: 0x5eead4,
      size: isMobile ? 0.022 : 0.018,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const shell = new THREE.Points(shellGeo, shellMat);
    root.add(shell);

    // Two perpendicular orbital rings
    const makeRing = (radius: number, color: number, tiltX: number, tiltY: number) => {
      const g = new THREE.TorusGeometry(radius, 0.006, 8, isMobile ? 120 : 220);
      const m = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.x = tiltX;
      mesh.rotation.y = tiltY;
      root.add(mesh);
      return mesh;
    };
    const ringA = makeRing(2.3, 0xa78bfa, Math.PI / 2.6, 0);
    const ringB = makeRing(2.6, 0x22d3ee, Math.PI / 3, Math.PI / 2);

    // Ambient floating micro-particles
    const dustCount = isMobile ? 200 : 450;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 10;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.015,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Interaction
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const setTarget = (cx: number, cy: number) => {
      const s = getSize();
      target.x = (cx / s.w - 0.5) * 0.6;
      target.y = (cy / s.h - 0.5) * 0.4;
    };
    const onPointer = (e: PointerEvent) => setTarget(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) setTarget(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    let visible = true;
    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    const clock = new THREE.Clock();
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();

      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;

      root.rotation.y = t * 0.08 + current.x;
      root.rotation.x = current.y;

      coreMat.uniforms.uTime.value = t;
      haloMat.uniforms.uTime.value = t;
      core.rotation.y = t * 0.25;
      core.rotation.x = t * 0.15;
      halo.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04);

      const sp = swirl.geometry.attributes.position as THREE.BufferAttribute;
      const arr = sp.array as Float32Array;
      for (let i = 0; i < swirlCount; i++) {
        const r = swirlSeeds[i * 3];
        const baseTheta = swirlSeeds[i * 3 + 1];
        const yBias = swirlSeeds[i * 3 + 2];
        const theta = baseTheta + t * (0.6 + r * 0.3);
        arr[i * 3] = Math.cos(theta) * r;
        arr[i * 3 + 1] = yBias + Math.sin(t * 1.3 + baseTheta * 2.0) * 0.12;
        arr[i * 3 + 2] = Math.sin(theta) * r;
      }
      sp.needsUpdate = true;

      shell.rotation.y = t * 0.1;
      shell.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);

      ringA.rotation.z = -t * 0.25;
      ringB.rotation.z = t * 0.2;

      dust.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const s = getSize();
      renderer.setSize(s.w, s.h, false);
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchmove', onTouch);
      document.removeEventListener('visibilitychange', onVisibility);
      if (canvas.parentNode === container) container.removeChild(canvas);
      coreGeo.dispose();
      coreMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      swirlGeo.dispose();
      swirlMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      [ringA, ringB].forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden" />;
};

export default AnoAI;
