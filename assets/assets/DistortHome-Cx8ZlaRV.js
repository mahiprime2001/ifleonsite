import{j as e,m as r}from"./vendor-motion-sJhi7ExN.js";import{L as C,r as f}from"./vendor-react-CKzJvXsF.js";import{b as L,A as R,v as D,w as q,x as G,V as T,m as F,Q as $,I as H}from"./index-BAGMt3Ua.js";import{C as z}from"./compass-DJettpKr.js";import{H as W}from"./hammer-Cd4SNfwd.js";import{R as U,P as V,M as Q}from"./Mesh-CAa_6pzC.js";import{T as X}from"./Triangle-CXJcDqBI.js";import"./vendor-anime-BBr17ej6.js";const s={bg:"#04060f",ink:"#e8ecff",blue:"#2563ff",cyan:"#22d3ee",violet:"#8b5cf6"},Y=`
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,Z=`
  precision highp float;

  uniform float u_time;
  uniform vec2  u_mouse;   // 0..1, y already flipped to match uv
  uniform float u_scroll;  // 0..1 intensity
  uniform vec2  u_res;

  varying vec2 vUv;

  // ---- hash / value noise --------------------------------------------------
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float gnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  // ---- fractal brownian motion ---------------------------------------------
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * gnoise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  // ---- domain-warped curl-ish field ----------------------------------------
  float field(vec2 p, float t) {
    vec2 q = vec2(fbm(p + vec2(0.0, t * 0.10)),
                  fbm(p + vec2(5.2, 1.3 - t * 0.08)));
    vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.12),
                  fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.09));
    return fbm(p + 4.0 * r);
  }

  void main() {
    vec2 res = u_res;
    float aspect = res.x / max(res.y, 1.0);
    vec2 uv = vUv;

    // pointer in same space
    vec2 m = u_mouse;
    vec2 duv = uv - m;
    duv.x *= aspect;
    float dist = length(duv);

    // ---- LIQUID DISTORTION toward the pointer ------------------------------
    // a soft well that warps the field around the cursor; scroll boosts it
    float pull = exp(-dist * 4.5);
    float warpAmt = 0.18 + u_scroll * 0.55;
    vec2 dir = normalize(duv + 1e-4);
    vec2 warped = uv - dir * pull * warpAmt;

    // base sampling coords (animated flow)
    vec2 p = warped;
    p.x *= aspect;
    p *= 2.6;
    float t = u_time * 0.35;

    // plasma / liquid field value
    float f = field(p + vec2(0.0, t * 0.25), t);

    // ---- PIXEL DISPLACEMENT / quantization near cursor ---------------------
    // closer to mouse => coarser blocks (chunky pixel-displacement look)
    float pix = smoothstep(0.55, 0.0, dist) * (0.6 + u_scroll * 0.4);
    if (pix > 0.001) {
      float blocks = mix(420.0, 26.0, pix);   // fewer blocks = bigger pixels
      vec2 grid = floor(warped * blocks) / blocks;
      vec2 gp = grid;
      gp.x *= aspect;
      gp *= 2.6;
      float fq = field(gp + vec2(0.0, t * 0.25), t);
      f = mix(f, fq, pix);
    }

    // ---- RGB SPLIT strengthening near cursor -------------------------------
    float splitAmt = (0.004 + u_scroll * 0.010) + smoothstep(0.5, 0.0, dist) * 0.022;
    vec2 off = dir * splitAmt;

    vec2 pr = (warped + off);  pr.x *= aspect; pr *= 2.6;
    vec2 pb = (warped - off);  pb.x *= aspect; pb *= 2.6;
    float fr = field(pr + vec2(0.0, t * 0.25), t);
    float fb = field(pb + vec2(0.0, t * 0.25), t);

    // remap field -> 0..1 ridges
    float vr = smoothstep(-0.6, 0.7, fr);
    float vg = smoothstep(-0.6, 0.7, f);
    float vb = smoothstep(-0.6, 0.7, fb);

    // ---- brand gradient: deep navy -> blue -> cyan -> violet ----------------
    vec3 c1 = vec3(0.016, 0.024, 0.059);   // near-black navy
    vec3 c2 = vec3(0.145, 0.388, 1.0);     // electric blue  #2563ff
    vec3 c3 = vec3(0.133, 0.827, 0.933);   // cyan           #22d3ee
    vec3 c4 = vec3(0.545, 0.361, 0.965);   // violet         #8b5cf6

    vec3 colR = mix(c1, c2, vr);
    colR = mix(colR, c3, smoothstep(0.45, 0.95, vr));
    vec3 colG = mix(c1, c2, vg);
    colG = mix(colG, c3, smoothstep(0.45, 0.95, vg));
    colG = mix(colG, c4, smoothstep(0.7, 1.0, vg) * 0.6);
    vec3 colB = mix(c1, c2, vb);
    colB = mix(colB, c4, smoothstep(0.4, 0.95, vb));

    // compose RGB-split: take R from colR, G from colG, B from colB
    vec3 col = vec3(colR.r, colG.g, colB.b);

    // glow well around the cursor
    col += vec3(0.15, 0.45, 0.9) * pull * (0.35 + u_scroll * 0.45);

    // bright filament ridges
    float ridge = pow(vg, 3.0);
    col += vec3(0.2, 0.55, 1.0) * ridge * 0.25;

    // subtle energy shimmer
    col += 0.02 * sin((uv.y * res.y) * 0.7 + u_time * 2.0);

    // vignette toward near-black edges
    vec2 vc = vUv - 0.5;
    float vig = 1.0 - dot(vc, vc) * 1.15;
    col *= clamp(vig, 0.25, 1.0);

    // floor to keep it dark & rich
    col = max(col, vec3(0.012, 0.016, 0.035));

    gl_FragColor = vec4(col, 1.0);
  }
`;function J(){const t=f.useRef(null),[a,c]=f.useState(!1);return f.useEffect(()=>{const m=t.current;if(!m)return;const P=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,x=navigator,O=x.deviceMemory!==void 0&&x.deviceMemory<=2||typeof x.hardwareConcurrency=="number"&&x.hardwareConcurrency<=2;if(P||O){c(!0);return}let u;try{u=new U({canvas:m,dpr:Math.min(window.devicePixelRatio||1,1.6),alpha:!1,antialias:!1,powerPreference:"high-performance"})}catch{c(!0);return}const l=u.gl;l.clearColor(.016,.024,.059,1);const A=new X(l),o={u_time:{value:0},u_mouse:{value:[.5,.55]},u_scroll:{value:0},u_res:{value:[1,1]}},B=new V(l,{vertex:Y,fragment:Z,uniforms:o}),M=new Q(l,{geometry:A,program:B}),v=()=>{const i=m.parentElement,n=(i==null?void 0:i.clientWidth)||window.innerWidth,d=(i==null?void 0:i.clientHeight)||window.innerHeight;u.setSize(n,d),o.u_res.value=[l.drawingBufferWidth,l.drawingBufferHeight]};v(),window.addEventListener("resize",v);const h=[o.u_mouse.value[0],o.u_mouse.value[1]],w=i=>{h[0]=i.clientX/window.innerWidth,h[1]=1-i.clientY/window.innerHeight};window.addEventListener("pointermove",w,{passive:!0});const y=()=>{const i=document.documentElement.scrollHeight-window.innerHeight||1;o.u_scroll.value=Math.min(1,window.scrollY/i)};window.addEventListener("scroll",y,{passive:!0});let j=!0,N=!0;const k=new IntersectionObserver(i=>{var n;N=((n=i[0])==null?void 0:n.isIntersecting)??!0},{threshold:.01});k.observe(m);const I=()=>{j=document.visibilityState==="visible"};document.addEventListener("visibilitychange",I);let p=0,S=performance.now();const E=i=>{p=requestAnimationFrame(E);const n=Math.min((i-S)/1e3,.05);if(S=i,!j||!N)return;o.u_time.value+=n;const d=o.u_mouse.value,_=Math.min(1,n*6);d[0]+=(h[0]-d[0])*_,d[1]+=(h[1]-d[1])*_,u.render({scene:M})};return p=requestAnimationFrame(E),()=>{cancelAnimationFrame(p),k.disconnect(),window.removeEventListener("resize",v),window.removeEventListener("pointermove",w),window.removeEventListener("scroll",y),document.removeEventListener("visibilitychange",I);const i=l.getExtension("WEBGL_lose_context");i&&i.loseContext()}},[]),a?e.jsx("div",{"aria-hidden":!0,className:"absolute inset-0 -z-10",style:{background:`radial-gradient(120% 90% at 70% 10%, rgba(37,99,255,0.32), transparent 55%),radial-gradient(90% 80% at 15% 80%, rgba(139,92,246,0.28), transparent 55%),radial-gradient(70% 60% at 50% 50%, rgba(34,211,238,0.18), transparent 60%),${s.bg}`}}):e.jsx("canvas",{ref:t,"aria-hidden":!0,className:"absolute inset-0 -z-10 h-full w-full",style:{pointerEvents:"none",display:"block"}})}const g={hidden:{opacity:0,y:28},show:{opacity:1,y:0}};function b({children:t,className:a=""}){return e.jsx("div",{className:`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md ${a}`,style:{boxShadow:"0 10px 40px -20px rgba(37,99,255,0.5)"},children:t})}const K=[{key:"Business",items:D,tint:s.blue},{key:"For Individuals",items:q,tint:s.cyan},{key:"Specialty & Add-ons",items:G,tint:s.violet}],ee=[{icon:z,title:"Discover",body:"We map your goals, stack, and constraints — then scope the highest-value work first."},{icon:W,title:"Design & Build",body:"Clean architecture, iterative delivery, and tests so what we ship stays maintainable."},{icon:T,title:"Deploy",body:"Zero-downtime rollouts with monitoring, runbooks, and a clear handover to your team."},{icon:F,title:"Optimize",body:"We measure, tune, and iterate — cost, performance, and reliability over the long run."}],te=[{quote:"IFLEON took us from quarterly releases to shipping daily. Build times dropped from 40 minutes to under five.",name:"Platform Lead",role:"B2B SaaS, India"},{quote:"Their ISO 27001 and DPDP work unblocked two enterprise deals. Audit-ready documentation, no drama.",name:"CTO",role:"Fintech Startup"},{quote:"The AI support copilot answers from our own docs and cut response time in half. It just works.",name:"Head of Support",role:"E-commerce"}],ie=[{value:"25",label:"Projects Delivered"},{value:"6",label:"Industries Served"},{value:"50+",label:"Clients Worldwide"},{value:"99.9%",label:"Uptime Maintained"}];function me(){return e.jsxs("div",{className:"relative min-h-screen w-full overflow-x-hidden",style:{background:s.bg,color:s.ink},children:[e.jsxs("section",{className:"relative isolate flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-28 pb-20 md:pt-32",children:[e.jsx(J,{}),e.jsx("div",{"aria-hidden":!0,className:"pointer-events-none absolute inset-0 -z-[5]",style:{background:"radial-gradient(110% 80% at 50% 30%, transparent 40%, rgba(4,6,15,0.55) 100%)"}}),e.jsxs("div",{className:"relative mx-auto w-full max-w-5xl text-center",children:[e.jsxs(r.span,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.6},className:"inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-md",children:[e.jsx("span",{className:"h-1.5 w-1.5 rounded-full",style:{background:s.cyan}}),"Founder-led · AI · DevOps · Cloud · Cybersecurity"]}),e.jsxs(r.h1,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{duration:.7,delay:.05},className:"mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl",children:[e.jsx("span",{className:"block",children:"Infinite Possibilities,"}),e.jsx("span",{className:"block bg-clip-text text-transparent",style:{backgroundImage:`linear-gradient(100deg, ${s.blue}, ${s.cyan} 55%, ${s.violet})`},children:"Logical Solutions."})]}),e.jsx(r.p,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.7,delay:.15},className:"mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg",children:"IFLEON is a founder-led consultancy from Nellore, India — building intelligent, secure, and scalable systems for teams and individuals across India and the globe."}),e.jsxs(r.div,{initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.7,delay:.25},className:"mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row",children:[e.jsxs("a",{href:"mailto:info@ifleon.com",className:"group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]",style:{background:`linear-gradient(100deg, ${s.blue}, ${s.violet})`,boxShadow:"0 12px 40px -12px rgba(37,99,255,0.7)"},children:[e.jsx(L,{className:"h-4 w-4"}),"Request a Free Consultation",e.jsx(R,{className:"h-4 w-4 transition-transform group-hover:translate-x-1"})]}),e.jsx(C,{to:"/services",className:"inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors hover:bg-white/[0.1]",children:"Explore Services"})]}),e.jsx(r.p,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.8,delay:.5},className:"mt-7 text-xs text-white/40",children:"Move your cursor — the field distorts. ISO 27001 · DPDP · SOC 2"})]})]}),e.jsxs("section",{className:"relative mx-auto max-w-7xl px-6 py-24",children:[e.jsxs("div",{className:"mb-14 text-center",children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight sm:text-4xl",children:"Everything we build, in one place"}),e.jsx("p",{className:"mx-auto mt-3 max-w-2xl text-white/60",children:"Sixteen services across business, individuals, and specialty add-ons — one team, end to end."})]}),e.jsx("div",{className:"space-y-16",children:K.map(t=>e.jsxs("div",{children:[e.jsxs("div",{className:"mb-6 flex items-center gap-3",children:[e.jsx("span",{className:"h-2.5 w-2.5 rounded-full",style:{background:t.tint}}),e.jsx("h3",{className:"text-lg font-semibold tracking-wide text-white/90",children:t.key}),e.jsxs("span",{className:"text-xs text-white/40",children:[t.items.length," services"]})]}),e.jsx(r.div,{variants:{show:{transition:{staggerChildren:.06}}},initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-80px"},className:"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",children:t.items.map(a=>{const c=a.icon;return e.jsx(r.div,{variants:g,children:e.jsxs(b,{className:"group h-full p-5 transition-colors hover:bg-white/[0.07]",children:[e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("span",{className:"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10",style:{background:`${t.tint}22`,color:t.tint},children:e.jsx(c,{className:"h-5 w-5"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold leading-tight text-white",children:a.title}),e.jsx("p",{className:"mt-0.5 text-xs font-medium",style:{color:t.tint},children:a.tagline})]})]}),e.jsx("p",{className:"mt-3 text-sm leading-relaxed text-white/60",children:a.description})]})},a.id)})})]},t.key))})]}),e.jsx("section",{className:"relative border-y border-white/10 bg-white/[0.02]",children:e.jsx("div",{className:"mx-auto grid max-w-6xl grid-cols-2 px-6 py-4 md:grid-cols-4",children:ie.map(t=>e.jsxs("div",{className:"px-4 py-8 text-center",children:[e.jsx("div",{className:"text-4xl font-extrabold tracking-tight md:text-5xl",style:{backgroundImage:`linear-gradient(120deg, ${s.cyan}, ${s.blue})`,WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"},children:t.value}),e.jsx("div",{className:"mt-2 text-sm text-white/55",children:t.label})]},t.label))})}),e.jsxs("section",{className:"relative mx-auto max-w-7xl px-6 py-24",children:[e.jsxs("div",{className:"mb-14 text-center",children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight sm:text-4xl",children:"How we work"}),e.jsx("p",{className:"mx-auto mt-3 max-w-2xl text-white/60",children:"A clear, four-step path from first conversation to long-term reliability."})]}),e.jsx("div",{className:"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",children:ee.map((t,a)=>{const c=t.icon;return e.jsx(r.div,{variants:g,initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-60px"},transition:{delay:a*.08},children:e.jsxs(b,{className:"h-full p-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"flex h-11 w-11 items-center justify-center rounded-xl",style:{background:`${s.blue}22`,color:s.cyan},children:e.jsx(c,{className:"h-5 w-5"})}),e.jsxs("span",{className:"text-3xl font-black text-white/10",children:["0",a+1]})]}),e.jsx("h3",{className:"mt-4 text-lg font-semibold text-white",children:t.title}),e.jsx("p",{className:"mt-2 text-sm leading-relaxed text-white/60",children:t.body})]})},t.title)})})]}),e.jsx("section",{className:"relative mx-auto max-w-7xl px-6 pb-24",children:e.jsx("div",{className:"grid grid-cols-1 gap-4 md:grid-cols-3",children:te.map((t,a)=>e.jsx(r.div,{variants:g,initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-60px"},transition:{delay:a*.08},children:e.jsxs(b,{className:"flex h-full flex-col p-6",children:[e.jsx($,{className:"h-7 w-7",style:{color:s.violet}}),e.jsxs("p",{className:"mt-4 flex-1 text-sm leading-relaxed text-white/75",children:["“",t.quote,"”"]}),e.jsxs("div",{className:"mt-5 border-t border-white/10 pt-4",children:[e.jsx("div",{className:"text-sm font-semibold text-white",children:t.name}),e.jsx("div",{className:"text-xs text-white/50",children:t.role})]})]})},a))})}),e.jsx("section",{className:"relative px-6 pb-28",children:e.jsx("div",{className:"mx-auto max-w-5xl",children:e.jsxs("div",{className:"relative overflow-hidden rounded-3xl border border-white/10 p-10 text-center md:p-16",style:{background:"radial-gradient(120% 140% at 50% 0%, rgba(37,99,255,0.22), transparent 60%), rgba(255,255,255,0.03)"},children:[e.jsx("h2",{className:"text-3xl font-bold tracking-tight sm:text-4xl",children:"Let’s build something that lasts."}),e.jsx("p",{className:"mx-auto mt-4 max-w-2xl text-white/65",children:"Tell us what you’re trying to ship. We’ll come back with a clear plan, an honest timeline, and the first high-value step."}),e.jsxs("div",{className:"mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row",children:[e.jsxs("a",{href:"mailto:info@ifleon.com",className:"group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]",style:{background:`linear-gradient(100deg, ${s.blue}, ${s.violet})`,boxShadow:"0 12px 40px -12px rgba(37,99,255,0.7)"},children:[e.jsx(L,{className:"h-4 w-4"}),"info@ifleon.com"]}),e.jsxs(C,{to:"/services",className:"inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors hover:bg-white/[0.1]",children:["Explore Services",e.jsx(R,{className:"h-4 w-4"})]}),e.jsxs("a",{href:"https://github.com/ifleonlabs",target:"_blank",rel:"noreferrer",className:"inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors hover:bg-white/[0.1]",children:[e.jsx(H,{className:"h-4 w-4"}),"github.com/ifleonlabs"]})]}),e.jsx("p",{className:"mt-8 text-xs text-white/40",children:"IFLEON · Nellore, India · Est. 2022 · ISO 27001 · DPDP · SOC 2"})]})})})]})}export{me as default};
