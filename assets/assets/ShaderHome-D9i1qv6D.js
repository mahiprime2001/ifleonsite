import{u as K,j as e,m as x,f as U}from"./vendor-motion-sJhi7ExN.js";import{r as y,L as q}from"./vendor-react-CKzJvXsF.js";import{c as Y,m as Q,b as P,A,N as J,R as X,v as Z,U as ee,w as te,p as ae,x as se,V as ie,q as ne,Q as oe,I as le}from"./index-BAGMt3Ua.js";import{C as re}from"./compass-DJettpKr.js";import{H as ce}from"./hammer-Cd4SNfwd.js";import{R as de,P as me,M as xe}from"./Mesh-CAa_6pzC.js";import{T as ue}from"./Triangle-CXJcDqBI.js";import"./vendor-anime-BBr17ej6.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=Y("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),G="#05070F",l="#F4F7FF",j="#C7D2F0",N="#8C9AC4",S="#5B6790",f="#3B82F6",p="#22D3EE",h="#8B5CF6",O="#EC4899",b="#34D399",he="#FBBF24",F="rgba(16,22,44,0.55)",L="rgba(20,28,56,0.72)",u="rgba(140,154,196,0.16)",g='var(--font-display, "Fraunces"), Georgia, "Times New Roman", serif',d='var(--font-mono, "JetBrains Mono"), ui-monospace, SFMono-Regular, Menlo, monospace',fe=[{value:"25",label:"Projects Delivered",accent:f},{value:"6",label:"Industries Served",accent:p},{value:"50+",label:"Clients Worldwide",accent:h},{value:"99.9%",label:"Uptime Maintained",accent:b}],H=[{icon:re,title:"Discover",blurb:"We map your goals, constraints, and the single highest-value problem worth solving first — no jargon, no fluff.",accent:p},{icon:ce,title:"Design & Build",blurb:"Tight, iterative delivery. Architecture, code, and review in short loops so you see real progress every week.",accent:f},{icon:ie,title:"Ship",blurb:"Automated pipelines, zero-downtime cutover, and measurable outcomes — shipped to production with confidence.",accent:h},{icon:ne,title:"Support & Scale",blurb:"Monitoring, runbooks, and a partner on call. We harden, optimize, and grow with you long after launch.",accent:b}],ve=[{quote:"IFLEON took us from quarterly releases to shipping daily. Their DevOps overhaul paid for itself in the first month.",name:"Operations Lead",org:"Logistics SaaS · India",accent:f},{quote:"The AI assistant they built now deflects over 40% of our support tickets. It reads like it actually understands our docs.",name:"Head of Support",org:"Fintech · Singapore",accent:h},{quote:"Hands-on, founder-led, and genuinely invested. They closed our ISO 27001 gaps and unlocked enterprise deals.",name:"Founder",org:"B2B Platform · UAE",accent:p}],ge=["ISO 27001","DPDP","SOC 2"],ye="mailto:info@ifleon.com?subject=Free%20Consultation%20Request&body=Hi%20IFLEON%20team%2C%0A%0AI'd%20like%20to%20request%20a%20free%20consultation.",V=[{kicker:"Chapter 01 · The field",title:"Infinite Possibilities, Logical Solutions.",body:"A founder-led AI, DevOps, cloud, and cybersecurity consultancy from Nellore, India — building for businesses and individuals across India and the globe.",accent:p},{kicker:"Chapter 02 · Intelligence",title:"We turn data into systems that decide.",body:"AI & machine learning, autonomous agents, and data engineering that automate workflows, surface insight, and drive smarter decisions.",accent:h},{kicker:"Chapter 03 · Velocity",title:"We make shipping software feel effortless.",body:"DevOps, cloud migration, and custom software — pipelines that turn quarterly releases into daily ones, with zero-downtime cutovers.",accent:f},{kicker:"Chapter 04 · Trust",title:"We secure what you can't afford to lose.",body:"Cybersecurity, compliance, and digital transformation aligned to ISO 27001, DPDP, and SOC 2 — so growth never outruns safety.",accent:b},{kicker:"Chapter 05 · Everyone",title:"And we show up for individuals, too.",body:"Tech support, personal security, smart-home integration, and AI / cloud career guidance — the same rigor, scaled to one person.",accent:O}],be=`
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 v_uv;
  void main(){
    v_uv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,we=`
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform float u_scroll;   // 0..1 across full page
  uniform float u_scene;    // continuous scene index 0..(N-1)
  uniform vec2  u_res;

  // --- hash / noise / fbm ---
  vec2 hash2(vec2 p){
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
          dot(hash2(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
          dot(hash2(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p, float turb){
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for(int i = 0; i < 6; i++){
      v += a * noise(p);
      p = m * p + turb * 0.15;
      a *= 0.5;
    }
    return v;
  }

  // brand palette as a function of scene + value
  vec3 palette(float t, float scene){
    vec3 nearBlack = vec3(0.020, 0.027, 0.059);
    vec3 blue   = vec3(0.231, 0.510, 0.965);
    vec3 cyan   = vec3(0.133, 0.827, 0.933);
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 pink   = vec3(0.925, 0.282, 0.600);
    vec3 emerald= vec3(0.204, 0.827, 0.600);

    // scene picks a dominant pair
    // 0: cyan/blue, 1: violet, 2: blue, 3: emerald, 4: pink
    float s = scene;
    vec3 hi = cyan;
    vec3 lo = blue;
    hi = mix(hi, violet,  smoothstep(0.5, 1.5, s));
    lo = mix(lo, violet,  smoothstep(0.5, 1.5, s) * 0.6);
    hi = mix(hi, blue,    smoothstep(1.5, 2.5, s));
    lo = mix(lo, cyan,    smoothstep(1.5, 2.5, s));
    hi = mix(hi, emerald, smoothstep(2.5, 3.5, s));
    lo = mix(lo, blue,    smoothstep(2.5, 3.5, s));
    hi = mix(hi, pink,    smoothstep(3.5, 4.5, s));
    lo = mix(lo, violet,  smoothstep(3.5, 4.5, s));

    vec3 c = mix(nearBlack, lo, smoothstep(0.0, 0.55, t));
    c = mix(c, hi, smoothstep(0.45, 1.0, t));
    return c;
  }

  void main(){
    vec2 uv = v_uv;
    vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

    // scene-driven zoom + turbulence
    float zoom = 1.6 - 0.18 * u_scene + 0.25 * u_scroll;
    float turb = 0.6 + 0.5 * u_scene + 1.2 * u_scroll;
    p *= zoom;

    float t = u_time * 0.06;

    // domain-warped fbm -> aurora ribbons
    vec2 q = vec2(
      fbm(p + vec2(0.0, t), turb),
      fbm(p + vec2(5.2, -t * 0.8), turb)
    );
    vec2 r = vec2(
      fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.5, turb),
      fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.4, turb)
    );
    float f = fbm(p + 2.4 * r + t * 0.3, turb);

    // shape into flowing bands
    float v = 0.5 + 0.5 * f;
    v = pow(v, 1.4);
    float bands = 0.5 + 0.5 * sin((p.y * 2.0 + r.x * 3.0 + t * 2.0) * 1.6);
    v = mix(v, v * bands, 0.45);

    vec3 col = palette(v, u_scene);

    // glow accents along high-energy ridges
    float ridge = smoothstep(0.55, 0.95, length(r));
    col += ridge * 0.18 * palette(0.95, u_scene);

    // subtle center spotlight so DOM text stays readable
    float vign = smoothstep(1.25, 0.15, length(p) * 0.7);
    col *= 0.65 + 0.5 * vign;

    // deepen toward edges for premium dark feel
    col = mix(vec3(0.012, 0.016, 0.035), col, 0.55 + 0.45 * vign);

    // gentle grain to avoid banding
    float g = (hash2(uv * u_res + t).x) * 0.012;
    col += g;

    gl_FragColor = vec4(col, 1.0);
  }
`;function je(){return(navigator.deviceMemory??4)<=2||(navigator.hardwareConcurrency??4)<=2}function Ne({sceneTargetRef:i}){const r=y.useRef(null);return y.useEffect(()=>{const o=r.current;if(!o)return;const m=window.matchMedia("(max-width: 768px)").matches,n=new de({alpha:!1,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,m?1.3:1.6)}),a=n.gl;a.clearColor(.02,.027,.059,1),o.appendChild(a.canvas),a.canvas.style.width="100%",a.canvas.style.height="100%",a.canvas.style.display="block";const I=new ue(a),w=new me(a,{vertex:be,fragment:we,uniforms:{u_time:{value:0},u_scroll:{value:0},u_scene:{value:0},u_res:{value:[1,1]}}}),t=new xe(a,{geometry:I,program:w}),s=()=>{const c=o.clientWidth||window.innerWidth||1,v=o.clientHeight||window.innerHeight||1;n.setSize(c,v),w.uniforms.u_res.value=[a.drawingBufferWidth,a.drawingBufferHeight]};s();const k=new ResizeObserver(s);k.observe(o),window.addEventListener("resize",s);let R=0;const E=()=>{const c=document.documentElement.scrollHeight-window.innerHeight||1;R=Math.min(1,Math.max(0,window.scrollY/c))};E(),window.addEventListener("scroll",E,{passive:!0});let _=!0;const z=new IntersectionObserver(c=>c.forEach(v=>_=v.isIntersecting),{threshold:.01});z.observe(o);const M=()=>{_=document.visibilityState==="visible"};document.addEventListener("visibilitychange",M);let C=0;const D=performance.now();let T=D;const W=c=>{if(C=requestAnimationFrame(W),!_||document.visibilityState!=="visible"||c-T<18)return;T=c;const v=w.uniforms;v.u_time.value=(c-D)/1e3,v.u_scroll.value+=(R-v.u_scroll.value)*.06,v.u_scene.value+=(i.current-v.u_scene.value)*.05,n.render({scene:t})};return C=requestAnimationFrame(W),()=>{cancelAnimationFrame(C),k.disconnect(),z.disconnect(),document.removeEventListener("visibilitychange",M),window.removeEventListener("scroll",E),window.removeEventListener("resize",s);const c=a.getExtension("WEBGL_lose_context");c==null||c.loseContext(),a.canvas.parentNode&&a.canvas.parentNode.removeChild(a.canvas)}},[i]),e.jsx("div",{ref:r,"aria-hidden":!0,className:"pointer-events-none fixed inset-0 z-0"})}function ke(){return e.jsx("div",{"aria-hidden":!0,className:"pointer-events-none fixed inset-0 z-0",style:{background:`
          radial-gradient(70% 55% at 20% 15%, ${h}33, transparent 60%),
          radial-gradient(60% 50% at 85% 25%, ${p}2E, transparent 60%),
          radial-gradient(80% 60% at 50% 95%, ${f}33, transparent 65%),
          ${G}
        `}})}function $({service:i,index:r}){const o=i.icon,m=[p,f,h,O,b,he],n=m[r%m.length];return e.jsxs(x.article,{initial:{opacity:0,y:26},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-8% 0px"},transition:{duration:.55,ease:[.22,1,.36,1]},whileHover:{y:-6},className:"group relative flex flex-col rounded-2xl p-5",style:{background:F,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:`1px solid ${u}`,boxShadow:"0 18px 44px -28px rgba(0,0,0,0.8)"},children:[e.jsx("span",{className:"mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl",style:{color:n,background:`${n}1F`,border:`1px solid ${n}3D`},children:e.jsx(o,{className:"h-5 w-5"})}),e.jsx("h4",{className:"text-base font-semibold leading-snug",style:{color:l},children:i.title}),e.jsx("p",{className:"mt-1",style:{color:n,fontFamily:d,fontSize:"0.72rem"},children:i.tagline}),e.jsx("p",{className:"mt-3 text-sm leading-relaxed",style:{color:N},children:i.description}),e.jsx("div",{className:"mt-4 h-px w-full",style:{background:`${n}26`}}),e.jsx("div",{className:"mt-3 flex flex-wrap gap-1.5",children:i.technologies.slice(0,3).map(a=>e.jsx("span",{className:"rounded-full px-2 py-0.5 text-[0.66rem]",style:{fontFamily:d,color:N,background:"rgba(140,154,196,0.08)",border:`1px solid ${u}`},children:a},a))})]})}function B({icon:i,kicker:r,title:o,accent:m}){return e.jsxs("div",{className:"mb-6 flex items-center gap-3",children:[e.jsx("span",{className:"inline-flex h-9 w-9 items-center justify-center rounded-lg",style:{color:m,background:`${m}1F`},children:e.jsx(i,{style:{width:18,height:18}})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[0.68rem] uppercase tracking-[0.2em]",style:{fontFamily:d,color:S},children:r}),e.jsx("h3",{className:"text-xl font-semibold",style:{color:l,fontFamily:g},children:o})]})]})}function Se({index:i,scene:r,onActive:o,reduced:m}){const n=y.useRef(null),a=U(n,{margin:"-45% 0px -45% 0px"});return y.useEffect(()=>{a&&o(i)},[a,i,o]),e.jsx("div",{ref:n,className:"flex min-h-screen items-center justify-center px-5",children:e.jsxs(x.div,{initial:!1,animate:m?{opacity:1,y:0}:{opacity:a?1:.18,y:a?0:24},transition:{duration:.7,ease:[.22,1,.36,1]},className:"mx-auto max-w-2xl text-center",children:[e.jsx("p",{className:"text-[0.72rem] uppercase tracking-[0.28em]",style:{fontFamily:d,color:r.accent},children:r.kicker}),e.jsx("h2",{className:"mt-4 text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-5xl",style:{fontFamily:g,color:l,letterSpacing:"-0.02em",textShadow:"0 2px 30px rgba(0,0,0,0.6)"},children:r.title}),e.jsx("p",{className:"mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg",style:{color:j,textShadow:"0 1px 16px rgba(0,0,0,0.6)"},children:r.body})]})})}function Be(){const i=K(),[r,o]=y.useState(!1),m=y.useRef(0),[n,a]=y.useState(0);y.useEffect(()=>{o(je())},[]);const I=!i&&!r,w=t=>{m.current=t,a(t)};return e.jsxs("div",{className:"relative min-h-screen overflow-hidden",style:{background:G,color:l},children:[I?e.jsx(Ne,{sceneTargetRef:m}):e.jsx(ke,{}),e.jsx("div",{"aria-hidden":!0,className:"pointer-events-none fixed inset-0 z-0",style:{background:"radial-gradient(120% 90% at 50% 40%, rgba(5,7,15,0) 35%, rgba(5,7,15,0.55) 100%)"}}),e.jsx("header",{className:"relative z-10 px-5 pt-28 md:pt-32",style:{minHeight:"100vh"},children:e.jsxs("div",{className:"mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center text-center",children:[e.jsxs(x.span,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.6},className:"inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs",style:{fontFamily:d,color:j,background:L,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",border:`1px solid ${u}`},children:[e.jsx(Q,{className:"h-3.5 w-3.5",style:{color:p}}),"Founder-led · AI · DevOps · Cloud · Security · Est. 2022"]}),e.jsxs(x.h1,{initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.7,delay:.08},className:"mt-6 text-4xl font-semibold leading-[1.04] sm:text-5xl md:text-6xl",style:{fontFamily:g,color:l,letterSpacing:"-0.02em",textShadow:"0 2px 40px rgba(0,0,0,0.6)"},children:["Infinite Possibilities,"," ",e.jsx("span",{style:{background:`linear-gradient(100deg, ${p}, ${f} 50%, ${h})`,WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"},children:"Logical Solutions."})]}),e.jsx(x.p,{initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.7,delay:.16},className:"mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg",style:{color:j,textShadow:"0 1px 16px rgba(0,0,0,0.6)"},children:"IFLEON is a founder-led technology consultancy from Nellore, India — building AI, DevOps, cloud, and cybersecurity solutions for businesses and individuals across India and the globe."}),e.jsxs(x.div,{initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.7,delay:.24},className:"mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",children:[e.jsxs("a",{href:ye,className:"group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5",style:{background:`linear-gradient(100deg, ${f}, ${h})`,boxShadow:"0 16px 36px -14px rgba(59,130,246,0.7)"},children:[e.jsx(P,{className:"h-4 w-4"}),"Request a Free Consultation",e.jsx(A,{className:"h-4 w-4 transition-transform group-hover:translate-x-0.5"})]}),e.jsxs(q,{to:"/services",className:"inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5",style:{color:l,background:L,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",border:`1px solid ${u}`},children:["Explore Services",e.jsx(A,{className:"h-4 w-4"})]})]}),e.jsxs(x.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.7,delay:.34},className:"mt-8 flex flex-wrap items-center justify-center gap-2",children:[e.jsx(J,{className:"h-3.5 w-3.5",style:{color:b}}),ge.map(t=>e.jsx("span",{className:"rounded-full px-2.5 py-1 text-[0.68rem]",style:{fontFamily:d,color:N,background:"rgba(140,154,196,0.08)",border:`1px solid ${u}`},children:t},t))]}),!i&&e.jsxs(x.div,{"aria-hidden":!0,animate:{y:[0,8,0]},transition:{duration:2,repeat:1/0,ease:"easeInOut"},className:"mt-14 flex flex-col items-center gap-1",style:{color:S},children:[e.jsx("span",{className:"text-[0.62rem] uppercase tracking-[0.28em]",style:{fontFamily:d},children:"Scroll the story"}),e.jsx(pe,{className:"h-4 w-4"})]})]})}),e.jsxs("section",{className:"relative z-10",children:[!i&&e.jsx("div",{className:"pointer-events-none fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 md:flex",children:V.map((t,s)=>e.jsx("span",{className:"h-2 w-2 rounded-full transition-all duration-500",style:{background:s===n?t.accent:"rgba(140,154,196,0.3)",transform:s===n?"scale(1.5)":"scale(1)",boxShadow:s===n?`0 0 14px ${t.accent}`:"none"}},t.kicker))}),V.map((t,s)=>e.jsx(Se,{index:s,scene:t,onActive:w,reduced:!!i},t.kicker))]}),e.jsxs("section",{className:"relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-24",children:[e.jsxs("div",{className:"mb-10 max-w-2xl",children:[e.jsx("p",{className:"text-[0.7rem] uppercase tracking-[0.24em]",style:{fontFamily:d,color:p},children:"What we do"}),e.jsx("h2",{className:"mt-2 text-3xl font-semibold md:text-4xl",style:{fontFamily:g,color:l,letterSpacing:"-0.02em"},children:"Sixteen ways we turn problems into shipped solutions."})]}),e.jsx(B,{icon:X,kicker:"For Business",title:"Business Solutions",accent:f}),e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:Z.map((t,s)=>e.jsx($,{service:t,index:s},t.id))}),e.jsxs("div",{className:"mt-14",children:[e.jsx(B,{icon:ee,kicker:"For Individuals",title:"Individual Solutions",accent:p}),e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:te.map((t,s)=>e.jsx($,{service:t,index:s+1},t.id))})]}),e.jsxs("div",{className:"mt-14",children:[e.jsx(B,{icon:ae,kicker:"Specialty & Add-Ons",title:"Specialty Services",accent:h}),e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-3",children:se.map((t,s)=>e.jsx($,{service:t,index:s+2},t.id))})]})]}),e.jsx("section",{className:"relative z-10 mx-auto max-w-6xl px-5 pb-8",children:e.jsx("div",{className:"grid grid-cols-2 gap-4 rounded-3xl p-6 md:grid-cols-4 md:p-10",style:{background:F,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${u}`,boxShadow:"0 30px 70px -40px rgba(0,0,0,0.85)"},children:fe.map((t,s)=>e.jsxs(x.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-10% 0px"},transition:{duration:.5,delay:s*.07},className:"text-center md:text-left",children:[e.jsx("div",{className:"text-4xl font-semibold md:text-5xl",style:{fontFamily:g,color:t.accent},children:t.value}),e.jsx("p",{className:"mt-1 text-sm",style:{color:N},children:t.label})]},t.label))})}),e.jsxs("section",{className:"relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-24",children:[e.jsxs("div",{className:"mb-10 max-w-xl",children:[e.jsx("p",{className:"text-[0.7rem] uppercase tracking-[0.24em]",style:{fontFamily:d,color:b},children:"How we work"}),e.jsx("h2",{className:"mt-2 text-3xl font-semibold md:text-4xl",style:{fontFamily:g,color:l,letterSpacing:"-0.02em"},children:"A tight, transparent delivery loop."})]}),e.jsx("div",{className:"grid gap-4 sm:grid-cols-2 lg:grid-cols-4",children:H.map((t,s)=>{const k=t.icon;return e.jsxs(x.div,{initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-8% 0px"},transition:{duration:.5,delay:s*.08},className:"relative flex flex-col rounded-2xl p-6",style:{background:F,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:`1px solid ${u}`},children:[e.jsx("span",{className:"mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl",style:{color:t.accent,background:`${t.accent}1F`,border:`1px solid ${t.accent}3D`},children:e.jsx(k,{className:"h-6 w-6"})}),e.jsxs("p",{className:"text-xs",style:{fontFamily:d,color:t.accent},children:["Step ",s+1," / ",H.length]}),e.jsx("h3",{className:"mt-1 text-lg font-semibold",style:{fontFamily:g,color:l},children:t.title}),e.jsx("p",{className:"mt-2 text-sm leading-relaxed",style:{color:N},children:t.blurb})]},t.title)})})]}),e.jsxs("section",{className:"relative z-10 mx-auto max-w-6xl px-5 py-12 md:py-16",children:[e.jsxs("div",{className:"mb-10 max-w-xl",children:[e.jsx("p",{className:"text-[0.7rem] uppercase tracking-[0.24em]",style:{fontFamily:d,color:O},children:"In their words"}),e.jsx("h2",{className:"mt-2 text-3xl font-semibold md:text-4xl",style:{fontFamily:g,color:l,letterSpacing:"-0.02em"},children:"Outcomes clients can measure."})]}),e.jsx("div",{className:"grid gap-4 md:grid-cols-3",children:ve.map((t,s)=>e.jsxs(x.figure,{initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-8% 0px"},transition:{duration:.55,delay:s*.08},className:"flex flex-col rounded-2xl p-6",style:{background:F,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:`1px solid ${u}`,boxShadow:"0 18px 44px -28px rgba(0,0,0,0.8)"},children:[e.jsx(oe,{className:"h-6 w-6",style:{color:t.accent}}),e.jsxs("blockquote",{className:"mt-3 flex-1 text-sm leading-relaxed",style:{color:j},children:['"',t.quote,'"']}),e.jsxs("figcaption",{className:"mt-5",children:[e.jsx("p",{className:"text-sm font-semibold",style:{color:l},children:t.name}),e.jsx("p",{className:"text-xs",style:{fontFamily:d,color:S},children:t.org})]})]},t.org))})]}),e.jsx("section",{className:"relative z-10 mx-auto max-w-6xl px-5 pb-24",children:e.jsxs("div",{className:"relative overflow-hidden rounded-3xl p-8 text-center md:p-14",style:{background:L,backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:`1px solid ${u}`,boxShadow:"0 40px 90px -50px rgba(0,0,0,0.9)"},children:[e.jsx("div",{"aria-hidden":!0,className:"pointer-events-none absolute inset-0 opacity-80",style:{background:`radial-gradient(60% 80% at 18% 0%, ${h}2E, transparent 60%), radial-gradient(60% 80% at 90% 100%, ${p}26, transparent 60%)`}}),e.jsxs("div",{className:"relative",children:[e.jsx("h2",{className:"mx-auto max-w-2xl text-3xl font-semibold md:text-4xl",style:{fontFamily:g,color:l,letterSpacing:"-0.02em"},children:"Let's build something logical, scalable, and a little bit infinite."}),e.jsx("p",{className:"mx-auto mt-4 max-w-lg text-base",style:{color:j},children:"Tell us about your project. We'll reply with a clear, honest plan — no obligation."}),e.jsxs("div",{className:"mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",children:[e.jsxs("a",{href:"mailto:info@ifleon.com",className:"group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5",style:{background:`linear-gradient(100deg, ${f}, ${h})`,boxShadow:"0 16px 36px -14px rgba(59,130,246,0.7)"},children:[e.jsx(P,{className:"h-4 w-4"}),"info@ifleon.com"]}),e.jsxs(q,{to:"/services",className:"inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5",style:{color:l,background:"rgba(140,154,196,0.1)",border:`1px solid ${u}`},children:["Explore Services",e.jsx(A,{className:"h-4 w-4"})]}),e.jsxs("a",{href:"https://github.com/ifleonlabs",target:"_blank",rel:"noreferrer",className:"inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5",style:{color:l,background:"rgba(140,154,196,0.1)",border:`1px solid ${u}`},children:[e.jsx(le,{className:"h-4 w-4"}),"github.com/ifleonlabs"]})]}),e.jsx("p",{className:"mt-8 text-xs",style:{color:S,fontFamily:d},children:"IFLEON · Nellore, India · Founded 2022 · Infinite Possibilities, Logical Solutions."})]})]})})]})}export{Be as default};
