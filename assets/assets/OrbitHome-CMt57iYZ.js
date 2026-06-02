import{u as V,j as e,m as y,f as he}from"./vendor-motion-sJhi7ExN.js";import{r as l,L as fe}from"./vendor-react-CKzJvXsF.js";import{M as ge,S as G,U as ye,u as P,W as K,H as be,L as ie,D as we,F as je,e as Se,a as X,_ as xe,b as Ne,N as Me,B as ke,c as De,C as pe,P as Ce,d as Ue,f as Fe,g as Ie,h as oe}from"./Float-OXG4FyH7.js";import{m as $,O as Te,p as Re,P as Ee,v as Be,U as Ae,w as Oe,x as _e,Q as le,b as Le,I as Pe,N as ze,A as Ve}from"./index-BKOEevxj.js";import{C as ce}from"./compass-rXMX_8A8.js";import{A as $e}from"./activity-CRW7GWa0.js";import"./vendor-anime-BBr17ej6.js";const He={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},We={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `};function Ge(t,r,o,a){const n=class extends G{constructor(s={}){const c=Object.entries(t);super({uniforms:c.reduce((d,[p,b])=>{const v=ye.clone({[p]:{value:b}});return{...d,...v}},{}),vertexShader:r,fragmentShader:o}),this.key="",c.forEach(([d])=>Object.defineProperty(this,d,{get:()=>this.uniforms[d].value,set:p=>this.uniforms[d].value=p})),Object.assign(this,s)}};return n.key=ge.generateUUID(),n}function de(t,r,o){const a=P(h=>h.size),n=P(h=>h.viewport),i=typeof t=="number"?t:a.width*n.dpr,s=a.height*n.dpr,c=(typeof t=="number"?o:t)||{},{samples:d=0,depth:p,...b}=c,v=l.useMemo(()=>{const h=new K(i,s,{minFilter:ie,magFilter:ie,type:be,...b});return p&&(h.depthTexture=new we(i,s,je)),h.samples=d,h},[]);return l.useLayoutEffect(()=>{v.setSize(i,s),d&&(v.samples=d)},[d,v,i,s]),l.useEffect(()=>()=>v.dispose(),[]),v}const Ke=Ge({},"void main() { }","void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }");class qe extends De{constructor(r=6,o=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new pe("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=a=>{a.uniforms={...a.uniforms,...this.uniforms},this.anisotropy>0&&(a.defines.USE_ANISOTROPY=""),o?a.defines.USE_SAMPLER="":a.defines.USE_TRANSMISSION="",a.fragmentShader=`
      uniform float chromaticAberration;         
      uniform float anisotropicBlur;      
      uniform float time;
      uniform float distortion;
      uniform float distortionScale;
      uniform float temporalDistortion;
      uniform sampler2D buffer;

      vec3 random3(vec3 c) {
        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0*j);
        j *= .125;
        r.x = fract(512.0*j);
        j *= .125;
        r.y = fract(512.0*j);
        return r-0.5;
      }

      uint hash( uint x ) {
        x += ( x << 10u );
        x ^= ( x >>  6u );
        x += ( x <<  3u );
        x ^= ( x >> 11u );
        x += ( x << 15u );
        return x;
      }

      // Compound versions of the hashing algorithm I whipped together.
      uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
      uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
      uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }

      // Construct a float with half-open range [0:1] using low 23 bits.
      // All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
      float floatConstruct( uint m ) {
        const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
        const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
        m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
        m |= ieeeOne;                          // Add fractional part to 1.0
        float  f = uintBitsToFloat( m );       // Range [1:2]
        return f - 1.0;                        // Range [0:1]
      }

      // Pseudo-random value in half-open range [0:1].
      float randomBase( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
      float randomBase( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float rand(float seed) {
        float result = randomBase(vec3(gl_FragCoord.xy, seed));
        return result;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;

      float snoise(vec3 p) {
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));
        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e*(1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy*(1.0 - e);
        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0*G3;
        vec3 x3 = x - 1.0 + 3.0*G3;
        vec4 w, d;
        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);
        w = max(0.6 - w, 0.0);
        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);
        w *= w;
        w *= w;
        d *= w;
        return dot(d, vec4(52.0));
      }

      float snoiseFractal(vec3 m) {
        return 0.5333333* snoise(m)
              +0.2666667* snoise(2.0*m)
              +0.1333333* snoise(4.0*m)
              +0.0666667* snoise(8.0*m);
      }
`+a.fragmentShader,a.fragmentShader=a.fragmentShader.replace("#include <transmission_pars_fragment>",`
        #ifdef USE_TRANSMISSION
          // Transmission code is based on glTF-Sampler-Viewer
          // https://github.com/KhronosGroup/glTF-Sample-Viewer
          uniform float _transmission;
          uniform float thickness;
          uniform float attenuationDistance;
          uniform vec3 attenuationColor;
          #ifdef USE_TRANSMISSIONMAP
            uniform sampler2D transmissionMap;
          #endif
          #ifdef USE_THICKNESSMAP
            uniform sampler2D thicknessMap;
          #endif
          uniform vec2 transmissionSamplerSize;
          uniform sampler2D transmissionSamplerMap;
          uniform mat4 modelMatrix;
          uniform mat4 projectionMatrix;
          varying vec3 vWorldPosition;
          vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
            // Direction of refracted light.
            vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
            // Compute rotation-independant scaling of the model matrix.
            vec3 modelScale;
            modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
            modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
            modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
            // The thickness is specified in local space.
            return normalize( refractionVector ) * thickness * modelScale;
          }
          float applyIorToRoughness( const in float roughness, const in float ior ) {
            // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
            // an IOR of 1.5 results in the default amount of microfacet refraction.
            return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
          }
          vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
            float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );            
            #ifdef USE_SAMPLER
              #ifdef texture2DLodEXT
                return texture2DLodEXT(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #else
                return texture2D(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #endif
            #else
              return texture2D(buffer, fragCoord.xy);
            #endif
          }
          vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
            if ( isinf( attenuationDistance ) ) {
              // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
              return radiance;
            } else {
              // Compute light attenuation using Beer's law.
              vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
              vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
              return transmittance * radiance;
            }
          }
          vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
            const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
            const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
            const in vec3 attenuationColor, const in float attenuationDistance ) {
            vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
            vec3 refractedRayExit = position + transmissionRay;
            // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
            vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
            vec2 refractionCoords = ndcPos.xy / ndcPos.w;
            refractionCoords += 1.0;
            refractionCoords /= 2.0;
            // Sample framebuffer to get pixel the refracted ray hits.
            vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
            vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
            // Get the specular component.
            vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
            return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
          }
        #endif
`),a.fragmentShader=a.fragmentShader.replace("#include <transmission_fragment>",`  
        // Improve the refraction to use the world pos
        material.transmission = _transmission;
        material.transmissionAlpha = 1.0;
        material.thickness = thickness;
        material.attenuationDistance = attenuationDistance;
        material.attenuationColor = attenuationColor;
        #ifdef USE_TRANSMISSIONMAP
          material.transmission *= texture2D( transmissionMap, vUv ).r;
        #endif
        #ifdef USE_THICKNESSMAP
          material.thickness *= texture2D( thicknessMap, vUv ).g;
        #endif
        
        vec3 pos = vWorldPosition;
        float runningSeed = 0.0;
        vec3 v = normalize( cameraPosition - pos );
        vec3 n = inverseTransformDirection( normal, viewMatrix );
        vec3 transmission = vec3(0.0);
        float transmissionR, transmissionB, transmissionG;
        float randomCoords = rand(runningSeed++);
        float thickness_smear = thickness * max(pow(roughnessFactor, 0.33), anisotropicBlur);
        vec3 distortionNormal = vec3(0.0);
        vec3 temporalOffset = vec3(time, -time, -time) * temporalDistortion;
        if (distortion > 0.0) {
          distortionNormal = distortion * vec3(snoiseFractal(vec3((pos * distortionScale + temporalOffset))), snoiseFractal(vec3(pos.zxy * distortionScale - temporalOffset)), snoiseFractal(vec3(pos.yxz * distortionScale + temporalOffset)));
        }
        for (float i = 0.0; i < ${r}.0; i ++) {
          vec3 sampleNorm = normalize(n + roughnessFactor * roughnessFactor * 2.0 * normalize(vec3(rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5)) * pow(rand(runningSeed++), 0.33) + distortionNormal);
          transmissionR = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness  + thickness_smear * (i + randomCoords) / float(${r}),
            material.attenuationColor, material.attenuationDistance
          ).r;
          transmissionG = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior  * (1.0 + chromaticAberration * (i + randomCoords) / float(${r})) , material.thickness + thickness_smear * (i + randomCoords) / float(${r}),
            material.attenuationColor, material.attenuationDistance
          ).g;
          transmissionB = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * chromaticAberration * (i + randomCoords) / float(${r})), material.thickness + thickness_smear * (i + randomCoords) / float(${r}),
            material.attenuationColor, material.attenuationDistance
          ).b;
          transmission.r += transmissionR;
          transmission.g += transmissionG;
          transmission.b += transmissionB;
        }
        transmission /= ${r}.0;
        totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
`)},Object.keys(this.uniforms).forEach(a=>Object.defineProperty(this,a,{get:()=>this.uniforms[a].value,set:n=>this.uniforms[a].value=n}))}}const Xe=l.forwardRef(({buffer:t,transmissionSampler:r=!1,backside:o=!1,side:a=Ne,transmission:n=1,thickness:i=0,backsideThickness:s=0,backsideEnvMapIntensity:c=1,samples:d=10,resolution:p,backsideResolution:b,background:v,anisotropy:h,anisotropicBlur:F,...I},k)=>{Se({MeshTransmissionMaterial:qe});const f=l.useRef(null),[j]=l.useState(()=>new Ke),D=de(b||p),S=de(p);let A,O,N,m;return X(u=>{f.current.time=u.clock.elapsedTime,f.current.buffer===S.texture&&!r&&(m=f.current.__r3f.parent,m&&(N=u.gl.toneMapping,A=u.scene.background,O=f.current.envMapIntensity,u.gl.toneMapping=Me,v&&(u.scene.background=v),m.material=j,o&&(u.gl.setRenderTarget(D),u.gl.render(u.scene,u.camera),m.material=f.current,m.material.buffer=D.texture,m.material.thickness=s,m.material.side=ke,m.material.envMapIntensity=c),u.gl.setRenderTarget(S),u.gl.render(u.scene,u.camera),m.material=f.current,m.material.thickness=i,m.material.side=a,m.material.buffer=S.texture,m.material.envMapIntensity=O,u.scene.background=A,u.gl.setRenderTarget(null),u.gl.toneMapping=N))}),l.useImperativeHandle(k,()=>f.current,[]),l.createElement("meshTransmissionMaterial",xe({args:[d,r],ref:f},I,{buffer:t||S.texture,_transmission:n,anisotropicBlur:F??h,transmission:r?n:0,thickness:i,side:a}))}),Qe=l.forwardRef(({scale:t=10,frames:r=1/0,opacity:o=1,width:a=1,height:n=1,blur:i=1,near:s=0,far:c=10,resolution:d=512,smooth:p=!0,color:b="#000000",depthWrite:v=!1,renderOrder:h,...F},I)=>{const k=l.useRef(null),f=P(M=>M.scene),j=P(M=>M.gl),D=l.useRef(null);a=a*(Array.isArray(t)?t[0]:t||1),n=n*(Array.isArray(t)?t[1]:t||1);const[S,A,O,N,m,u,Y]=l.useMemo(()=>{const M=new K(d,d),re=new K(d,d);re.texture.generateMipmaps=M.texture.generateMipmaps=!1;const se=new Ce(a,n).rotateX(Math.PI/2),ve=new Ue(se),_=new Fe;_.depthTest=_.depthWrite=!1,_.onBeforeCompile=T=>{T.uniforms={...T.uniforms,ucolor:{value:new pe(b)}},T.fragmentShader=T.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),T.fragmentShader=T.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};const ae=new G(He),ne=new G(We);return ne.depthTest=ae.depthTest=!1,[M,se,_,ve,ae,ne,re]},[d,a,n,t,b]),Z=M=>{N.visible=!0,N.material=m,m.uniforms.tDiffuse.value=S.texture,m.uniforms.h.value=M*1/256,j.setRenderTarget(Y),j.render(N,D.current),N.material=u,u.uniforms.tDiffuse.value=Y.texture,u.uniforms.v.value=M*1/256,j.setRenderTarget(S),j.render(N,D.current),N.visible=!1};let J=0,ee,te;return X(()=>{D.current&&(r===1/0||J<r)&&(J++,ee=f.background,te=f.overrideMaterial,k.current.visible=!1,f.background=null,f.overrideMaterial=O,j.setRenderTarget(S),j.render(f,D.current),Z(i),p&&Z(i*.4),j.setRenderTarget(null),k.current.visible=!0,f.overrideMaterial=te,f.background=ee)}),l.useImperativeHandle(I,()=>k.current,[]),l.createElement("group",xe({"rotation-x":Math.PI/2},F,{ref:k}),l.createElement("mesh",{renderOrder:h,geometry:A,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},l.createElement("meshBasicMaterial",{transparent:!0,map:S.texture,opacity:o,depthWrite:v})),l.createElement("orthographicCamera",{ref:D,args:[-a/2,a/2,n/2,-n/2,s,c]}))}),Ye="#F7F8FA",E="#FFFFFF",U="rgba(15,23,42,0.08)",Ze="rgba(37,99,235,0.45)",H="rgba(15,23,42,0.07)",C="#0F172A",q="#1E293B",w="#64748B",x="#2563EB",g="#0D9488",Je=[{value:25,suffix:"",label:"Projects Delivered",hint:"shipped to production"},{value:6,suffix:"",label:"Industries Served",hint:"SaaS · fintech · retail +"},{value:50,suffix:"+",label:"Clients & Individuals",hint:"B2B and personal"},{value:99.9,suffix:"%",label:"Uptime Maintained",hint:"security-first ops"}],et=["ISO 27001","DPDP","SOC 2"],tt=[{step:"01",title:"Scope the outcome",body:"We start from the business result, then reverse-engineer the right stack — no tech for tech's sake."},{step:"02",title:"Build in the open",body:"Short cycles, working software you can see, and clean code pushed to a repo you own."},{step:"03",title:"Ship & secure",body:"Automated delivery, monitoring, and security baked in — so it survives contact with real users."},{step:"04",title:"Hand over & support",body:"Runbooks, training, and a maintenance plan so your team stays in control after launch."}],rt=[{quote:"They migrated us to AWS without a minute of downtime and our infra bill dropped by a third. Felt less like a vendor, more like our own team.",name:"Operations Lead",role:"Logistics SaaS · Bengaluru"},{quote:"We needed ISO 27001 to close an enterprise deal. IFLEON got us audit-ready in weeks, not quarters.",name:"Founder",role:"Fintech startup · Hyderabad"},{quote:"Set up my entire home network, security, and smart devices in an afternoon. Everything just works now.",name:"Individual client",role:"Remote professional · Nellore"}],z={x:0,y:0};function st(){const t=l.useRef(null),r=l.useRef(null);return X((o,a)=>{const n=Math.min(a,.05);if(r.current&&(r.current.rotation.y+=n*.32,r.current.rotation.x+=n*.12),t.current){const i=z.x*.5,s=-z.y*.35;t.current.rotation.y+=(i-t.current.rotation.y)*.06,t.current.rotation.x+=(s-t.current.rotation.x)*.06}}),e.jsxs("group",{ref:t,children:[e.jsx(oe,{speed:1.4,rotationIntensity:.5,floatIntensity:.9,children:e.jsxs("mesh",{ref:r,castShadow:!0,children:[e.jsx("icosahedronGeometry",{args:[1.4,8]}),e.jsx(Xe,{samples:8,resolution:512,thickness:1.1,roughness:.06,transmission:1,ior:1.35,chromaticAberration:.05,anisotropy:.2,distortion:.25,distortionScale:.4,temporalDistortion:.1,clearcoat:1,clearcoatRoughness:.05,attenuationDistance:2.4,attenuationColor:"#bcd4ff",color:"#dbeafe"})]})}),e.jsx(oe,{speed:2.2,rotationIntensity:.8,floatIntensity:1.2,children:e.jsxs("mesh",{children:[e.jsx("icosahedronGeometry",{args:[.42,1]}),e.jsx("meshStandardMaterial",{color:g,emissive:g,emissiveIntensity:.6,roughness:.25,metalness:.1})]})})]})}function at(){return l.useEffect(()=>{const t=r=>{z.x=r.clientX/window.innerWidth*2-1,z.y=r.clientY/window.innerHeight*2-1};return window.addEventListener("pointermove",t,{passive:!0}),()=>window.removeEventListener("pointermove",t)},[]),e.jsx(Ie,{dpr:[1,1.6],gl:{antialias:!0,alpha:!0},camera:{position:[0,0,5],fov:45},shadows:!0,className:"!absolute inset-0",children:e.jsxs(l.Suspense,{fallback:null,children:[e.jsx("ambientLight",{intensity:.6}),e.jsx("directionalLight",{position:[4,6,5],intensity:1.6,color:"#ffffff",castShadow:!0}),e.jsx("pointLight",{position:[-5,2,3],intensity:42,color:x,distance:18}),e.jsx("pointLight",{position:[4,-3,2],intensity:36,color:g,distance:18}),e.jsx("directionalLight",{position:[0,5,-4],intensity:.7,color:"#e0ecff"}),e.jsx(st,{}),e.jsx(Qe,{position:[0,-2.05,0],opacity:.32,scale:9,blur:2.6,far:4,color:"#1e3a8a"})]})})}function nt(){return e.jsx("div",{className:"pointer-events-none absolute inset-0 flex items-center justify-center",children:e.jsx("div",{className:"h-[58%] w-[58%] max-h-[420px] max-w-[420px] rounded-full",style:{background:"radial-gradient(circle at 32% 28%, #ffffff 0%, #bfdbfe 30%, #2563eb 64%, #0d9488 100%)",boxShadow:"0 40px 90px -30px rgba(37,99,235,0.55), inset -18px -22px 50px rgba(13,148,136,0.45), inset 16px 18px 44px rgba(255,255,255,0.7)"}})})}const Q=()=>{const t=V();return{reduce:t,variants:{hidden:{opacity:0,y:t?0:18},show:{opacity:1,y:0,transition:{duration:.55,ease:[.21,.47,.32,.98]}}}}};function it({to:t,suffix:r="",decimals:o=0}){const a=V(),n=l.useRef(null),i=he(n,{once:!0,margin:"-40px"}),[s,c]=l.useState(a?t:0);l.useEffect(()=>{if(a){c(t);return}if(!i)return;let p=0;const b=performance.now(),v=1200,h=F=>{const I=Math.min(1,(F-b)/v),k=1-Math.pow(1-I,3);c(t*k),I<1&&(p=requestAnimationFrame(h))};return p=requestAnimationFrame(h),()=>cancelAnimationFrame(p)},[i,a,t]);const d=o>0?s.toFixed(o):Math.round(s).toString();return e.jsxs("span",{ref:n,children:[d,r]})}function R({children:t,className:r=""}){const o=V();return e.jsx(y.div,{className:r,initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-60px"},variants:{hidden:{},show:{transition:{staggerChildren:o?0:.06}}},children:t})}function B({children:t,color:r=w,icon:o}){return e.jsxs("div",{className:"flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]",style:{color:r},children:[o?e.jsx(o,{className:"h-3.5 w-3.5"}):null,e.jsx("span",{children:t})]})}function L({eyebrow:t,title:r,desc:o,icon:a,accent:n=x}){const{variants:i}=Q();return e.jsxs(y.div,{variants:i,initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-60px"},className:"mb-10 flex flex-col gap-3",children:[e.jsx(B,{color:n,icon:a,children:t}),e.jsx("h2",{className:"max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl",style:{color:C},children:r}),o&&e.jsx("p",{className:"max-w-2xl text-[15px] leading-relaxed md:text-base",style:{color:w},children:o})]})}function W({service:t,accent:r}){const{reduce:o,variants:a}=Q(),n=t.icon;return e.jsxs(y.div,{variants:a,whileHover:o?void 0:{y:-4},className:"group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-6 transition-colors",style:{background:E,border:`1px solid ${U}`,boxShadow:"0 1px 2px rgba(15,23,42,0.04), 0 18px 40px -28px rgba(15,23,42,0.25)"},onMouseEnter:i=>i.currentTarget.style.borderColor=Ze,onMouseLeave:i=>i.currentTarget.style.borderColor=U,children:[e.jsxs("div",{className:"flex items-start justify-between gap-3",children:[e.jsx("div",{className:"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",style:{color:r,background:`${r}14`,border:`1px solid ${r}2e`},children:e.jsx(n,{className:"h-5 w-5"})}),e.jsx(ze,{className:"h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100",style:{color:r}})]}),e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx("h4",{className:"text-[15px] font-semibold leading-snug",style:{color:C},children:t.title}),e.jsx("p",{className:"text-[13px] leading-snug",style:{color:r},children:t.tagline}),e.jsx("p",{className:"mt-1 text-[13px] leading-relaxed",style:{color:w},children:t.description})]})]})}function ue({to:t,href:r,children:o}){const a="group/btn inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:-translate-y-0.5",n={background:x},i=e.jsxs(e.Fragment,{children:[o,e.jsx(Ve,{className:"h-4 w-4 transition-transform group-hover/btn:translate-x-0.5"})]});return t?e.jsx(fe,{to:t,className:a,style:n,children:i}):e.jsx("a",{href:r,className:a,style:n,children:i})}function me({to:t,href:r,external:o,icon:a,children:n}){const i="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors hover:bg-slate-50",s={color:q,border:`1px solid ${U}`,background:E},c=e.jsxs(e.Fragment,{children:[a?e.jsx(a,{className:"h-4 w-4"}):null,n]});return t?e.jsx(fe,{to:t,className:i,style:s,children:c}):e.jsx("a",{href:r,className:i,style:s,...o?{target:"_blank",rel:"noopener noreferrer"}:{},children:c})}function pt(){const t=V(),{variants:r}=Q(),[o,a]=l.useState(!1);l.useEffect(()=>a(!0),[]);const n=o&&!t,i=l.useMemo(()=>({hidden:{opacity:0,y:t?0:24},show:(s=0)=>({opacity:1,y:0,transition:{duration:.6,delay:s*.08,ease:[.21,.47,.32,.98]}})}),[t]);return e.jsxs("div",{className:"relative min-h-screen w-full overflow-hidden",style:{background:Ye,color:C},children:[e.jsxs("div",{"aria-hidden":!0,className:"pointer-events-none absolute inset-0",children:[e.jsx("div",{className:"absolute inset-0",style:{background:"radial-gradient(ellipse 90% 60% at 70% 8%, rgba(37,99,235,0.10), transparent 60%), radial-gradient(ellipse 70% 50% at 12% 30%, rgba(13,148,136,0.08), transparent 60%)"}}),e.jsx("div",{className:"absolute inset-0 opacity-[0.5]",style:{backgroundImage:"linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)",backgroundSize:"60px 60px",maskImage:"radial-gradient(ellipse 80% 55% at 50% 0%, #000 30%, transparent 100%)",WebkitMaskImage:"radial-gradient(ellipse 80% 55% at 50% 0%, #000 30%, transparent 100%)"}})]}),e.jsxs("div",{className:"relative mx-auto w-full max-w-7xl px-4 pb-28 pt-28 sm:px-6 md:pt-32 lg:px-8",children:[e.jsxs("section",{className:"relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-8",children:[e.jsx("div",{className:"pointer-events-none absolute inset-0 -z-0 opacity-60 lg:relative lg:order-2 lg:opacity-100",children:e.jsx("div",{className:"relative h-[340px] w-full sm:h-[420px] lg:h-[540px]",children:n?e.jsx(at,{}):e.jsx(nt,{})})}),e.jsxs("div",{className:"relative z-10 flex flex-col gap-7 lg:order-1",children:[e.jsx(y.div,{custom:0,variants:i,initial:"hidden",animate:"show",children:e.jsxs("span",{className:"inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",style:{color:x,background:`${x}12`,border:`1px solid ${x}2e`},children:[e.jsx($,{className:"h-3.5 w-3.5"}),"Founder-led · Nellore, India · since 2022"]})}),e.jsxs(y.h1,{custom:1,variants:i,initial:"hidden",animate:"show",className:"text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl",style:{color:C},children:["Infinite possibilities,"," ",e.jsx("span",{style:{background:`linear-gradient(100deg, ${x}, ${g})`,WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"},children:"logical solutions."})]}),e.jsx(y.p,{custom:2,variants:i,initial:"hidden",animate:"show",className:"max-w-xl text-base leading-relaxed md:text-lg",style:{color:w},children:"AI, DevOps, cloud and cybersecurity — engineered for startups, SMBs and individuals. From Nellore, India, serving teams and people worldwide. We scope the outcome first, then build the system that gets you there."}),e.jsxs(y.div,{custom:3,variants:i,initial:"hidden",animate:"show",className:"flex flex-wrap items-center gap-3",children:[e.jsx(ue,{href:"mailto:info@ifleon.com?subject=Free%20consultation%20request",children:"Request a Free Consultation"}),e.jsx(me,{to:"/services",icon:ce,children:"Explore Services"})]}),e.jsxs(y.div,{custom:4,variants:i,initial:"hidden",animate:"show",className:"flex flex-wrap items-center gap-x-4 gap-y-2 pt-1",children:[e.jsx("span",{className:"font-mono text-[11px] uppercase tracking-[0.16em]",style:{color:w},children:"Security-first"}),e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:et.map(s=>e.jsxs("span",{className:"inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",style:{color:q,border:`1px solid ${U}`,background:E},children:[e.jsx(Te,{className:"h-3.5 w-3.5",style:{color:g}}),s]},s))})]})]})]}),e.jsxs("section",{className:"mt-28 md:mt-36",children:[e.jsx(L,{eyebrow:"Capabilities · 16 services",title:"A full-stack toolkit for teams and individuals.",desc:"Whether you're scaling a SaaS platform or just locking down your home network, there's a track built for you.",icon:Re}),e.jsxs("div",{className:"mb-4 flex items-center gap-3",children:[e.jsx(B,{color:x,icon:Ee,children:"For Business"}),e.jsx("div",{className:"h-px flex-1",style:{background:H}})]}),e.jsx(R,{className:"grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",children:Be.map(s=>e.jsx(W,{service:s,accent:x},s.id))}),e.jsxs("div",{className:"mb-4 mt-12 flex items-center gap-3",children:[e.jsx(B,{color:g,icon:Ae,children:"For Individuals"}),e.jsx("div",{className:"h-px flex-1",style:{background:H}})]}),e.jsx(R,{className:"grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4",children:Oe.map(s=>e.jsx(W,{service:s,accent:g},s.id))}),e.jsxs("div",{className:"mb-4 mt-12 flex items-center gap-3",children:[e.jsx(B,{color:w,icon:$,children:"Specialty & Add-ons"}),e.jsx("div",{className:"h-px flex-1",style:{background:H}})]}),e.jsx(R,{className:"grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",children:_e.map((s,c)=>e.jsx(W,{service:s,accent:c%2===0?x:g},s.id))})]}),e.jsxs("section",{className:"mt-28 md:mt-36",children:[e.jsx(L,{eyebrow:"By the numbers",title:"Outcomes we can point to.",icon:$e,accent:g}),e.jsx(R,{className:"grid grid-cols-2 gap-5 lg:grid-cols-4",children:Je.map(s=>e.jsxs(y.div,{variants:r,className:"flex flex-col gap-2 rounded-2xl p-6",style:{background:E,border:`1px solid ${U}`,boxShadow:"0 1px 2px rgba(15,23,42,0.04), 0 18px 40px -28px rgba(15,23,42,0.22)"},children:[e.jsx("div",{className:"text-4xl font-semibold tracking-tight md:text-5xl",style:{color:x},children:e.jsx(it,{to:s.value,suffix:s.suffix,decimals:s.value%1!==0?1:0})}),e.jsx("div",{className:"text-sm font-medium",style:{color:C},children:s.label}),e.jsx("div",{className:"font-mono text-[11px] tracking-wide",style:{color:w},children:s.hint})]},s.label))})]}),e.jsxs("section",{className:"mt-28 md:mt-36",children:[e.jsx(L,{eyebrow:"The method",title:"How we work.",desc:"Calm, transparent, and built to hand over. No black boxes.",icon:ce}),e.jsx(R,{className:"grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4",children:tt.map((s,c)=>e.jsxs(y.div,{variants:r,className:"relative flex flex-col gap-3 rounded-2xl p-6",style:{background:E,border:`1px solid ${U}`,boxShadow:"0 1px 2px rgba(15,23,42,0.04), 0 18px 40px -28px rgba(15,23,42,0.22)"},children:[e.jsx("span",{className:"font-mono text-2xl font-semibold",style:{color:c%2===0?x:g},children:s.step}),e.jsx("h4",{className:"text-base font-semibold",style:{color:C},children:s.title}),e.jsx("p",{className:"text-[13px] leading-relaxed",style:{color:w},children:s.body})]},s.step))})]}),e.jsxs("section",{className:"mt-28 md:mt-36",children:[e.jsx(L,{eyebrow:"Signal",title:"What people say after we ship.",icon:le,accent:g}),e.jsx(R,{className:"grid grid-cols-1 gap-5 lg:grid-cols-3",children:rt.map((s,c)=>e.jsxs(y.div,{variants:r,className:"flex flex-col justify-between gap-6 rounded-2xl p-7",style:{background:E,border:`1px solid ${U}`,boxShadow:"0 1px 2px rgba(15,23,42,0.04), 0 18px 40px -28px rgba(15,23,42,0.22)"},children:[e.jsx(le,{className:"h-7 w-7",style:{color:c%2===0?x:g}}),e.jsxs("p",{className:"text-[15px] leading-relaxed",style:{color:q},children:["“",s.quote,"”"]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-sm font-semibold",style:{color:C},children:s.name}),e.jsx("span",{className:"font-mono text-[11px] tracking-wide",style:{color:w},children:s.role})]})]},s.name))})]}),e.jsx("section",{className:"mt-28 md:mt-36",children:e.jsxs(y.div,{variants:r,initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-60px"},className:"relative overflow-hidden rounded-3xl p-8 md:p-14",style:{background:"linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",border:`1px solid ${U}`,boxShadow:"0 30px 70px -40px rgba(37,99,235,0.45)"},children:[e.jsx("div",{"aria-hidden":!0,className:"pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-[110px]",style:{background:`radial-gradient(circle, ${x}33, transparent 70%)`}}),e.jsx("div",{"aria-hidden":!0,className:"pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full blur-[110px]",style:{background:`radial-gradient(circle, ${g}26, transparent 70%)`}}),e.jsxs("div",{className:"relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(B,{color:x,icon:$,children:"Let's build something"}),e.jsx("h2",{className:"max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl",style:{color:C},children:"Have a problem worth solving? Let's scope it together."}),e.jsxs("a",{href:"mailto:info@ifleon.com",className:"inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline",style:{color:w},children:[e.jsx(Le,{className:"h-4 w-4",style:{color:g}}),"info@ifleon.com"]})]}),e.jsxs("div",{className:"flex flex-col gap-3 sm:flex-row",children:[e.jsx(ue,{to:"/services",children:"Explore Services"}),e.jsx(me,{href:"https://github.com/ifleonlabs",external:!0,icon:Pe,children:"github.com/ifleonlabs"})]})]})]})})]})]})}export{pt as default};
