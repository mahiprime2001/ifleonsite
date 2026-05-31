import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
  density?: "low" | "medium" | "high";
  palette?: "blue" | "purple" | "sky";
};

// Premium ambient Three.js scene — fewer, freely-drifting glassy polyhedra
// that traverse the entire viewport with wrap-around. Dynamic colored point
// lights, network lines, particle field, and shooting-star streaks.
const FloatingObjects = ({
  className = "absolute inset-0",
  density = "medium",
  palette = "blue",
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile =
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Skip the WebGL scene entirely on very low-end devices — software WebGL
    // and tiny core/memory budgets make this the slowest thing on the page.
    // The gradient blobs behind it already look fine on their own.
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowEnd =
      (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) ||
      (typeof nav.hardwareConcurrency === "number" &&
        nav.hardwareConcurrency <= 2);
    if (lowEnd) return;

    // Fewer shapes by default — they drift freely so the scene feels
    // populated even with a small count.
    const counts = {
      low: { shapes: isMobile ? 4 : 6, particles: isMobile ? 100 : 200, sparks: isMobile ? 50 : 120 },
      medium: { shapes: isMobile ? 5 : 8, particles: isMobile ? 160 : 300, sparks: isMobile ? 80 : 180 },
      high: { shapes: isMobile ? 7 : 12, particles: isMobile ? 240 : 460, sparks: isMobile ? 130 : 260 },
    }[density];

    // Electric-blue family across the board — keeps the scene on-theme.
    const palettes = {
      blue: [0x3a82ff, 0x60a5fa, 0x2563eb, 0x38bdf8, 0x93c5fd],
      purple: [0x3a82ff, 0x2563eb, 0x60a5fa, 0x38bdf8, 0x818cf8],
      sky: [0x38bdf8, 0x60a5fa, 0x3a82ff, 0x7dd3fc, 0x2563eb],
    }[palette];

    const lightColors = {
      blue: [0x3a82ff, 0x60a5fa, 0x38bdf8],
      purple: [0x3a82ff, 0x2563eb, 0x60a5fa],
      sky: [0x38bdf8, 0x60a5fa, 0x3a82ff],
    }[palette];

    const getSize = () => {
      const r = container.getBoundingClientRect();
      return {
        w: Math.max(1, Math.floor(r.width || window.innerWidth)),
        h: Math.max(1, Math.floor(r.height || window.innerHeight)),
      };
    };

    const { w, h } = getSize();
    const aspect = w / h;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1220, 0.04);

    const camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100);
    camera.position.set(0, 0, 10);

    // Compute world-space half-width/height that fully covers the viewport
    // at the camera's z position. Used to wrap shapes around the screen.
    const computeBounds = () => {
      const fovRad = (camera.fov * Math.PI) / 180;
      const visibleH = 2 * Math.tan(fovRad / 2) * camera.position.z;
      const visibleW = visibleH * camera.aspect;
      // padding so shapes don't pop visibly at edges
      return {
        halfX: visibleW / 2 + 1.5,
        halfY: visibleH / 2 + 1.0,
      };
    };
    let bounds = computeBounds();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    // Cap DPR at 1.5 — this is a soft, blurred background, so rendering at the
    // full 2x+ of high-DPI screens just quadruples shading cost for no visible
    // gain. The single biggest GPU saving on retina/4K laptops.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5));
    renderer.setSize(w, h, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    // Lighting — soft ambient + 3 dynamic colored point lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.42);
    scene.add(ambient);

    const pointLights = lightColors.map((c, i) => {
      const l = new THREE.PointLight(c, isMobile ? 1.5 : 2.4, 22, 1.6);
      l.position.set(
        Math.cos((i / 3) * Math.PI * 2) * 5,
        Math.sin((i / 3) * Math.PI * 2) * 3,
        2 + i,
      );
      scene.add(l);
      return l;
    });

    const geos: THREE.BufferGeometry[] = [
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.TorusGeometry(0.55, 0.2, 10, 32),
      new THREE.TorusKnotGeometry(0.5, 0.15, 80, 12, 2, 3),
      new THREE.DodecahedronGeometry(0.6, 0),
      new THREE.TetrahedronGeometry(0.75, 0),
    ];

    type Shape = {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;     // free-drift velocity
      spin: THREE.Vector3;    // rotation speed
      pulse: number;          // scale-pulse rate
      seed: number;
      depth: number;          // z position (cached)
    };

    const shapes: Shape[] = [];

    for (let i = 0; i < counts.shapes; i++) {
      const geo = geos[i % geos.length];
      const color = palettes[i % palettes.length];

      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.5,
        roughness: 0.18,
        flatShading: true,
        transparent: true,
        opacity: 0.92,
        emissive: color,
        emissiveIntensity: 0.14,
      });

      const mesh = new THREE.Mesh(geo, mat);

      // Spread evenly across the entire bounds (avoid clustering)
      const x = (Math.random() - 0.5) * bounds.halfX * 2 * 0.85;
      const y = (Math.random() - 0.5) * bounds.halfY * 2 * 0.85;
      const z = (Math.random() - 0.5) * 5 - 1;
      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = 0.5 + Math.random() * 0.9;
      mesh.scale.setScalar(s);

      // Wireframe halo
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending,
        }),
      );
      wire.scale.setScalar(1.06);
      mesh.add(wire);

      // Soft outer fresnel halo
      const haloGeo = geo.clone();
      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.scale.setScalar(1.55);
      mesh.add(halo);

      scene.add(mesh);

      // Gentle floating drift — slow, ambient. Emil: match motion to mood.
      const angle = Math.random() * Math.PI * 2;
      const sp = 0.06 + Math.random() * 0.12; // world units / sec — calm
      shapes.push({
        mesh,
        vel: new THREE.Vector3(Math.cos(angle) * sp, Math.sin(angle) * sp, 0),
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 0.28,
          (Math.random() - 0.5) * 0.28,
          (Math.random() - 0.5) * 0.18,
        ),
        pulse: 0.6 + Math.random() * 0.4,
        seed: Math.random() * Math.PI * 2,
        depth: z,
      });
    }

    // Network lines — fewer, since shapes are sparser, but always recomputed
    type Link = { a: Shape; b: Shape; line: THREE.Line; mat: THREE.LineBasicMaterial };
    const links: Link[] = [];
    const linkLimit = isMobile ? 8 : 14;
    for (let i = 0; i < shapes.length && links.length < linkLimit; i++) {
      for (let j = i + 1; j < shapes.length && links.length < linkLimit; j++) {
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(6), 3),
        );
        const lineMat = new THREE.LineBasicMaterial({
          color: palettes[(i + j) % palettes.length],
          transparent: true,
          opacity: 0.0,
          blending: THREE.AdditiveBlending,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
        links.push({ a: shapes[i], b: shapes[j], line, mat: lineMat });
      }
    }

    // Particle dust — distributed across full bounds
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(counts.particles * 3);
    const pVel = new Float32Array(counts.particles * 2); // x,y velocities only
    for (let i = 0; i < counts.particles; i++) {
      positions[i * 3] = (Math.random() - 0.5) * bounds.halfX * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * bounds.halfY * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      const a = Math.random() * Math.PI * 2;
      const v = 0.04 + Math.random() * 0.08;
      pVel[i * 2] = Math.cos(a) * v;
      pVel[i * 2 + 1] = Math.sin(a) * v;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: palettes[1],
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Sparkle layer
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(counts.sparks * 3);
    const sparkSeeds = new Float32Array(counts.sparks);
    for (let i = 0; i < counts.sparks; i++) {
      sparkPositions[i * 3] = (Math.random() - 0.5) * bounds.halfX * 2;
      sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * bounds.halfY * 2;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sparkSeeds[i] = Math.random() * Math.PI * 2;
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);

    // Shooting-star streaks
    type Streak = {
      line: THREE.Line;
      mat: THREE.LineBasicMaterial;
      from: THREE.Vector3;
      to: THREE.Vector3;
      life: number;
      maxLife: number;
    };
    const streaks: Streak[] = [];

    const spawnStreak = () => {
      // streak crosses a wider arc of the screen now
      const startSide = Math.random() < 0.5 ? -1 : 1;
      const startX = startSide * bounds.halfX * 1.05;
      const endX = -startSide * bounds.halfX * (0.6 + Math.random() * 0.4);
      const startY = bounds.halfY * 0.6 - Math.random() * bounds.halfY * 1.2;
      const endY = startY - (1 + Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
      const z = (Math.random() - 0.5) * 4 - 1;

      const from = new THREE.Vector3(startX, startY, z);
      const to = new THREE.Vector3(endX, endY, z);

      const geom = new THREE.BufferGeometry();
      geom.setFromPoints([from, from.clone()]);
      const mat = new THREE.LineBasicMaterial({
        color: palettes[Math.floor(Math.random() * palettes.length)],
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geom, mat);
      scene.add(line);
      const maxLife = 0.7 + Math.random() * 0.7;
      streaks.push({ line, mat, from, to, life: 0, maxLife });
    };

    let nextStreakAt = 1.5 + Math.random() * 2;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const s = getSize();
      target.x = (e.clientX / s.w - 0.5) * 0.7;
      target.y = (e.clientY / s.h - 0.5) * 0.5;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = document.visibilityState === "visible";
    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    // Pause the render loop when the hero scrolls out of view. The page is
    // long, so without this the WebGL loop would keep burning CPU/GPU the
    // whole time the user is reading sections further down.
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "100px" },
    );
    io.observe(container);

    // Cap the ambient scene to ~30fps — it doesn't need 60/120fps, and the
    // lower rate roughly halves its CPU/GPU cost.
    const FRAME_MS = 1000 / 30;
    let lastFrameAt = 0;

    const clock = new THREE.Clock();
    let frameId = 0;
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!visible || !onScreen) return;
      const now = performance.now();
      if (now - lastFrameAt < FRAME_MS) return;
      lastFrameAt = now;
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta() || 0.016, 0.05);
      const speed = reduce ? 0 : 1;

      // Camera parallax
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      camera.position.x = current.x * 1.4;
      camera.position.y = -current.y * 0.9;
      camera.lookAt(0, 0, 0);

      // Orbit point lights
      pointLights.forEach((l, i) => {
        const a = t * (0.25 + i * 0.08) + (i / pointLights.length) * Math.PI * 2;
        const r = 6 + Math.sin(t * 0.3 + i) * 1.0;
        l.position.x = Math.cos(a) * r;
        l.position.y = Math.sin(a * 0.8) * 3.5;
        l.position.z = Math.sin(a * 0.5) * 2.5 + 1;
      });

      // Free-drift shapes — slow floating motion with wrap-around.
      shapes.forEach((s, i) => {
        // Calmer spin so they feel like floating, not tumbling.
        s.mesh.rotation.x += s.spin.x * dt * speed;
        s.mesh.rotation.y += s.spin.y * dt * speed;
        s.mesh.rotation.z += s.spin.z * dt * speed;

        // Linear drift + gentle vertical bob (real floating objects bob).
        const bob = Math.sin(t * 0.4 + s.seed) * 0.002;
        s.mesh.position.x += s.vel.x * dt * speed;
        s.mesh.position.y += s.vel.y * dt * speed + bob * speed;

        // Wrap around the viewport bounds
        if (s.mesh.position.x > bounds.halfX) s.mesh.position.x = -bounds.halfX;
        else if (s.mesh.position.x < -bounds.halfX) s.mesh.position.x = bounds.halfX;
        if (s.mesh.position.y > bounds.halfY) s.mesh.position.y = -bounds.halfY;
        else if (s.mesh.position.y < -bounds.halfY) s.mesh.position.y = bounds.halfY;

        // Subtler scale breathing
        const ps = 1 + Math.sin(t * s.pulse + i) * 0.04 * speed;
        s.mesh.scale.set(ps, ps, ps);
      });

      // Update network lines based on current positions
      links.forEach((lk, idx) => {
        const arr = (lk.line.geometry.attributes.position as THREE.BufferAttribute)
          .array as Float32Array;
        tmpA.copy(lk.a.mesh.position);
        tmpB.copy(lk.b.mesh.position);
        arr[0] = tmpA.x;
        arr[1] = tmpA.y;
        arr[2] = tmpA.z;
        arr[3] = tmpB.x;
        arr[4] = tmpB.y;
        arr[5] = tmpB.z;
        (lk.line.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

        // Only show line when shapes are reasonably close
        const d = tmpA.distanceTo(tmpB);
        const closeness = Math.max(0, 1 - d / 6);
        lk.mat.opacity = closeness * 0.35 * (0.7 + Math.sin(t * 0.8 + idx) * 0.3);
      });

      // Drift particles — also wrap
      const pArr = (particles.geometry.attributes.position as THREE.BufferAttribute)
        .array as Float32Array;
      for (let i = 0; i < counts.particles; i++) {
        pArr[i * 3] += pVel[i * 2] * dt * speed;
        pArr[i * 3 + 1] += pVel[i * 2 + 1] * dt * speed;
        if (pArr[i * 3] > bounds.halfX) pArr[i * 3] = -bounds.halfX;
        else if (pArr[i * 3] < -bounds.halfX) pArr[i * 3] = bounds.halfX;
        if (pArr[i * 3 + 1] > bounds.halfY) pArr[i * 3 + 1] = -bounds.halfY;
        else if (pArr[i * 3 + 1] < -bounds.halfY) pArr[i * 3 + 1] = bounds.halfY;
      }
      (particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      // Sparkle twinkle
      const spArr = (sparks.geometry.attributes.position as THREE.BufferAttribute)
        .array as Float32Array;
      for (let i = 0; i < counts.sparks; i++) {
        spArr[i * 3 + 1] += Math.sin(t * 0.6 + sparkSeeds[i]) * 0.002 * speed;
      }
      (sparks.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      sparkMat.size = 0.04 + Math.sin(t * 2) * 0.012;

      // Spawn / age streaks
      if (!reduce && t > nextStreakAt && streaks.length < 4) {
        spawnStreak();
        nextStreakAt = t + 2 + Math.random() * 3;
      }

      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.life += dt;
        const k = Math.min(1, s.life / s.maxLife);
        const headX = s.from.x + (s.to.x - s.from.x) * k;
        const headY = s.from.y + (s.to.y - s.from.y) * k;
        const tailX = s.from.x + (s.to.x - s.from.x) * Math.max(0, k - 0.18);
        const tailY = s.from.y + (s.to.y - s.from.y) * Math.max(0, k - 0.18);
        const arr = (s.line.geometry.attributes.position as THREE.BufferAttribute)
          .array as Float32Array;
        arr[0] = tailX;
        arr[1] = tailY;
        arr[2] = s.from.z;
        arr[3] = headX;
        arr[4] = headY;
        arr[5] = s.from.z;
        (s.line.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        s.mat.opacity = (1 - k) * 0.85;
        if (k >= 1) {
          scene.remove(s.line);
          s.line.geometry.dispose();
          s.mat.dispose();
          streaks.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const s = getSize();
      renderer.setSize(s.w, s.h, false);
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
      bounds = computeBounds();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      if (canvas.parentNode === container) container.removeChild(canvas);

      shapes.forEach((s) => {
        (s.mesh.material as THREE.Material).dispose();
        s.mesh.geometry.dispose();
        s.mesh.children.forEach((child) => {
          if (child instanceof THREE.LineSegments || child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
      });
      links.forEach((l) => {
        l.line.geometry.dispose();
        l.mat.dispose();
      });
      streaks.forEach((s) => {
        s.line.geometry.dispose();
        s.mat.dispose();
      });
      geos.forEach((g) => g.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      pointLights.forEach((l) => scene.remove(l));
      renderer.dispose();
    };
  }, [density, palette]);

  return <div ref={containerRef} className={className} aria-hidden />;
};

export default FloatingObjects;
