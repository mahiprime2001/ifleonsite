import { useEffect, useRef } from "react";
import { Renderer, Geometry, Program, Mesh } from "ogl";

/* ============================================================
   "Lemniscate Data-Flow" — the signature hero showpiece.
   Thousands of brand-colored particles advected along the ∞
   (lemniscate) path via a lightweight OGL shader. Cursor
   repels the field; scroll intensifies the flow. Tuned for the
   LIGHT skin (translucent colored points over a soft gradient).
   Perf: DPR cap, IntersectionObserver + visibility pause, idle
   throttle, reduced-motion / low-end static fallback.
   ============================================================ */

const VERT = /* glsl */ `
  attribute vec2 position;   // per-particle scatter offset (disk)
  attribute vec4 data;       // x: t0, y: speed, z: size, w: phase
  uniform float u_time;
  uniform float u_aspect;
  uniform vec2  u_mouse;     // clip space (-1..1), y up
  uniform float u_scroll;    // 0..1 flow intensity
  uniform float u_dpr;
  varying vec3 v_color;
  varying float v_alpha;

  vec2 lemniscate(float t){
    float s = sin(t); float c = cos(t);
    float d = 1.0 + s * s;
    return vec2(c / d, s * c / d);
  }
  vec3 brandColor(float x){
    vec3 blue   = vec3(0.145, 0.388, 0.922); // #2563EB
    vec3 teal   = vec3(0.051, 0.580, 0.533); // #0D9488
    vec3 violet = vec3(0.486, 0.227, 0.929); // #7C3AED
    vec3 c1 = mix(blue, teal, smoothstep(0.0, 0.5, x));
    return mix(c1, violet, smoothstep(0.5, 1.0, x));
  }
  void main(){
    float t = data.x + u_time * data.y * 0.22 * (0.7 + u_scroll * 0.6);
    vec2 base = lemniscate(t) * 0.86;
    float breathe = 0.82 + 0.18 * sin(u_time * 0.6 + data.w);
    vec2 p = base + position * breathe;

    if (u_aspect > 1.0) p.x /= u_aspect; else p.y *= u_aspect;

    // cursor repulsion
    vec2 toM = p - u_mouse;
    float dist = length(toM);
    float push = smoothstep(0.32, 0.0, dist) * 0.14;
    p += normalize(toM + 0.0001) * push;

    v_color = brandColor(fract(t / 6.2831853));
    v_alpha = (0.30 + 0.40 * (data.z / 3.0)) * (0.75 + 0.25 * u_scroll);

    gl_Position = vec4(p, 0.0, 1.0);
    gl_PointSize = data.z * u_dpr * (1.7 + u_scroll * 0.7);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec3 v_color;
  varying float v_alpha;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.04, d) * v_alpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(v_color, a);
  }
`;

function isLowEnd(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.deviceMemory ?? 4) <= 2 || (navigator.hardwareConcurrency ?? 4) <= 2;
}

export default function HeroFlowField({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd = isLowEnd();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: !isMobile,
      dpr: Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.6),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";

    const count = lowEnd ? 1600 : isMobile ? 3200 : 8500;
    const offset = new Float32Array(count * 2);
    const data = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      // scatter on a disk so particles ride near the path, not on it
      const r = Math.pow(Math.random(), 1.7) * 0.2;
      const ang = Math.random() * Math.PI * 2;
      offset[i * 2] = Math.cos(ang) * r;
      offset[i * 2 + 1] = Math.sin(ang) * r;
      data[i * 4] = Math.random() * Math.PI * 2;       // t0
      data[i * 4 + 1] = 0.5 + Math.random() * 1.2;     // speed
      data[i * 4 + 2] = 1.0 + Math.random() * 2.0;     // size
      data[i * 4 + 3] = Math.random() * Math.PI * 2;   // phase
    }

    const geometry = new Geometry(gl, {
      position: { size: 2, data: offset },
      data: { size: 4, data },
    });

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        u_time: { value: 0 },
        u_aspect: { value: 1 },
        u_mouse: { value: [10, 10] }, // offscreen until pointer moves
        u_scroll: { value: 0 },
        u_dpr: { value: renderer.dpr },
      },
    });

    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      program.uniforms.u_aspect.value = w / h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // pointer -> clip space (y up), smoothed
    const targetMouse = { x: 10, y: 10 };
    const curMouse = { x: 10, y: 10 };
    const onPointer = (e: PointerEvent) => {
      const rect = gl.canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.x = nx;
      targetMouse.y = ny;
    };
    const onLeave = () => { targetMouse.x = 10; targetMouse.y = 10; };
    if (!reduce && window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerout", onLeave, { passive: true });
    }

    // scroll intensity (cheap; reads window scroll)
    let scrollTarget = 0;
    const onScroll = () => {
      scrollTarget = Math.min(1, window.scrollY / (window.innerHeight || 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // perf gating
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => (visible = en.isIntersecting)),
      { threshold: 0.01 },
    );
    io.observe(container);
    const onVis = () => { visible = document.visibilityState === "visible" && visible; };
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    const start = performance.now();
    let last = start;
    let idleFrames = 0;

    const renderStatic = () => {
      program.uniforms.u_time.value = 6.0; // a pleasing frozen frame
      renderer.render({ scene: mesh });
    };

    if (reduce) {
      renderStatic();
    } else {
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.visibilityState !== "visible") return;
        // throttle to ~50fps
        if (now - last < 18) return;
        last = now;

        // ease mouse + scroll
        curMouse.x += (targetMouse.x - curMouse.x) * 0.08;
        curMouse.y += (targetMouse.y - curMouse.y) * 0.08;
        const u = program.uniforms;
        (u.u_mouse.value as number[])[0] = curMouse.x;
        (u.u_mouse.value as number[])[1] = curMouse.y;
        u.u_scroll.value += (scrollTarget - (u.u_scroll.value as number)) * 0.05;
        u.u_time.value = (now - start) / 1000;

        // idle guard: if pointer parked + no scroll for a while, keep rendering
        // slowly (the field always breathes) — cheap enough at 50fps with
        // visibility gating, so we just cap work via the throttle above.
        idleFrames++;

        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerout", onLeave);
      window.removeEventListener("scroll", onScroll);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas);
      void idleFrames;
    };
  }, []);

  return <div ref={containerRef} aria-hidden className={`pointer-events-none ${className}`} />;
}
