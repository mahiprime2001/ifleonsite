import{j as N}from"./vendor-motion-sJhi7ExN.js";import{r as R}from"./vendor-react-CKzJvXsF.js";import{R as H,G as B,P as G,M as O}from"./Mesh-CAa_6pzC.js";const T=`
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
`,j=`
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
`;function D(){return(navigator.deviceMemory??4)<=2||(navigator.hardwareConcurrency??4)<=2}function V({className:f=""}){const h=R.useRef(null);return R.useEffect(()=>{const a=h.current;if(!a)return;const _=window.matchMedia("(prefers-reduced-motion: reduce)").matches,z=D(),d=window.matchMedia("(max-width: 768px)").matches,i=new H({alpha:!0,premultipliedAlpha:!1,antialias:!d,dpr:Math.min(window.devicePixelRatio||1,d?1.25:1.6)}),t=i.gl;t.clearColor(0,0,0,0),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),a.appendChild(t.canvas),t.canvas.style.width="100%",t.canvas.style.height="100%",t.canvas.style.display="block";const v=z?1600:d?3200:8500,m=new Float32Array(v*2),c=new Float32Array(v*4);for(let e=0;e<v;e++){const o=Math.pow(Math.random(),1.7)*.2,n=Math.random()*Math.PI*2;m[e*2]=Math.cos(n)*o,m[e*2+1]=Math.sin(n)*o,c[e*4]=Math.random()*Math.PI*2,c[e*4+1]=.5+Math.random()*1.2,c[e*4+2]=1+Math.random()*2,c[e*4+3]=Math.random()*Math.PI*2}const F=new B(t,{position:{size:2,data:m},data:{size:4,data:c}}),l=new G(t,{vertex:T,fragment:j,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{u_time:{value:0},u_aspect:{value:1},u_mouse:{value:[10,10]},u_scroll:{value:0},u_dpr:{value:i.dpr}}}),w=new O(t,{geometry:F,program:l,mode:t.POINTS}),g=()=>{const e=a.clientWidth||1,o=a.clientHeight||1;i.setSize(e,o),l.uniforms.u_aspect.value=e/o};g();const y=new ResizeObserver(g);y.observe(a);const s={x:10,y:10},r={x:10,y:10},x=e=>{const o=t.canvas.getBoundingClientRect(),n=(e.clientX-o.left)/o.width*2-1,I=-((e.clientY-o.top)/o.height*2-1);s.x=n,s.y=I},M=()=>{s.x=10,s.y=10};!_&&window.matchMedia("(pointer: fine)").matches&&(window.addEventListener("pointermove",x,{passive:!0}),window.addEventListener("pointerout",M,{passive:!0}));let b=0;const E=()=>{b=Math.min(1,window.scrollY/(window.innerHeight||1))};window.addEventListener("scroll",E,{passive:!0});let u=!0;const L=new IntersectionObserver(e=>e.forEach(o=>u=o.isIntersecting),{threshold:.01});L.observe(a);const C=()=>{u=document.visibilityState==="visible"&&u};document.addEventListener("visibilitychange",C);let p=0;const P=performance.now();let A=P;const S=()=>{l.uniforms.u_time.value=6,i.render({scene:w})};if(_)S();else{const e=o=>{if(p=requestAnimationFrame(e),!u||document.visibilityState!=="visible"||o-A<18)return;A=o,r.x+=(s.x-r.x)*.08,r.y+=(s.y-r.y)*.08;const n=l.uniforms;n.u_mouse.value[0]=r.x,n.u_mouse.value[1]=r.y,n.u_scroll.value+=(b-n.u_scroll.value)*.05,n.u_time.value=(o-P)/1e3,i.render({scene:w})};p=requestAnimationFrame(e)}return()=>{cancelAnimationFrame(p),y.disconnect(),L.disconnect(),document.removeEventListener("visibilitychange",C),window.removeEventListener("pointermove",x),window.removeEventListener("pointerout",M),window.removeEventListener("scroll",E);const e=t.getExtension("WEBGL_lose_context");e==null||e.loseContext(),t.canvas.parentNode&&t.canvas.parentNode.removeChild(t.canvas)}},[]),N.jsx("div",{ref:h,"aria-hidden":!0,className:`pointer-events-none ${f}`})}export{V as default};
