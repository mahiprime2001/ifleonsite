import{u as Ue,a as Oe,b as q,d as se,j as n,m as S}from"./vendor-motion-sJhi7ExN.js";import{r as c,L as oe}from"./vendor-react-CKzJvXsF.js";import{R as ze,I as Be,F as ae,a as Z,b as I,W as Ie,B as te,S as ve,V as w,c as Pe,U as le,d as ce,e as we,f as De,g as D,L as Re,h as Se,i as ee,j as Te,k as We,_ as U,P as Fe,u as T,D as P,C as He,l as Ge}from"./extends-r0zCZ5ET.js";import{O as B,P as Ve,m as $e,b as de,A as ue,p as je,v as qe,w as Ye,x as Xe,V as Qe,N as Je,Q as fe,I as Ke}from"./index-BAGMt3Ua.js";import{C as Ee}from"./compass-DJettpKr.js";import{v as _e}from"./constants-c0Yo2U4S.js";import"./vendor-anime-BBr17ej6.js";const Ae=parseInt(ze.replace(/\D+/g,"")),Ne=Ae>=125?"uv1":"uv2",pe=new te,W=new w;class ne extends Be{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],s=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(s),this.setAttribute("position",new ae(e,3)),this.setAttribute("uv",new ae(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,s=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),s.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const s=new Z(t,6,1);return this.setAttribute("instanceStart",new I(s,3,0)),this.setAttribute("instanceEnd",new I(s,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let s;e instanceof Float32Array?s=e:Array.isArray(e)&&(s=new Float32Array(e));const i=new Z(s,t*2,1);return this.setAttribute("instanceColorStart",new I(i,t,0)),this.setAttribute("instanceColorEnd",new I(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Ie(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new te);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),pe.setFromBufferAttribute(t),this.boundingBox.union(pe))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ve),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const s=this.boundingSphere.center;this.boundingBox.getCenter(s);let i=0;for(let r=0,d=e.count;r<d;r++)W.fromBufferAttribute(e,r),i=Math.max(i,s.distanceToSquared(W)),W.fromBufferAttribute(t,r),i=Math.max(i,s.distanceToSquared(W));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class Le extends ne{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,s=new Float32Array(2*t);for(let i=0;i<t;i+=3)s[2*i]=e[i],s[2*i+1]=e[i+1],s[2*i+2]=e[i+2],s[2*i+3]=e[i+3],s[2*i+4]=e[i+4],s[2*i+5]=e[i+5];return super.setPositions(s),this}setColors(e,t=3){const s=e.length-t,i=new Float32Array(2*s);if(t===3)for(let r=0;r<s;r+=t)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5];else for(let r=0;r<s;r+=t)i[2*r]=e[r],i[2*r+1]=e[r+1],i[2*r+2]=e[r+2],i[2*r+3]=e[r+3],i[2*r+4]=e[r+4],i[2*r+5]=e[r+5],i[2*r+6]=e[r+6],i[2*r+7]=e[r+7];return super.setColors(i,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class ie extends Pe{constructor(e){super({type:"LineMaterial",uniforms:le.clone(le.merge([ce.common,ce.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new we(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${Ae>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const Y=new D,me=new w,he=new w,x=new D,g=new D,j=new D,X=new w,Q=new Se,b=new Re,xe=new w,F=new te,H=new ve,E=new D;let _,M;function ge(o,e,t){return E.set(0,0,-e,1).applyMatrix4(o.projectionMatrix),E.multiplyScalar(1/E.w),E.x=M/t.width,E.y=M/t.height,E.applyMatrix4(o.projectionMatrixInverse),E.multiplyScalar(1/E.w),Math.abs(Math.max(E.x,E.y))}function Ze(o,e){const t=o.matrixWorld,s=o.geometry,i=s.attributes.instanceStart,r=s.attributes.instanceEnd,d=Math.min(s.instanceCount,i.count);for(let l=0,u=d;l<u;l++){b.start.fromBufferAttribute(i,l),b.end.fromBufferAttribute(r,l),b.applyMatrix4(t);const f=new w,p=new w;_.distanceSqToSegment(b.start,b.end,p,f),p.distanceTo(f)<M*.5&&e.push({point:p,pointOnLine:f,distance:_.origin.distanceTo(p),object:o,face:null,faceIndex:l,uv:null,[Ne]:null})}}function et(o,e,t){const s=e.projectionMatrix,r=o.material.resolution,d=o.matrixWorld,l=o.geometry,u=l.attributes.instanceStart,f=l.attributes.instanceEnd,p=Math.min(l.instanceCount,u.count),h=-e.near;_.at(1,j),j.w=1,j.applyMatrix4(e.matrixWorldInverse),j.applyMatrix4(s),j.multiplyScalar(1/j.w),j.x*=r.x/2,j.y*=r.y/2,j.z=0,X.copy(j),Q.multiplyMatrices(e.matrixWorldInverse,d);for(let y=0,A=p;y<A;y++){if(x.fromBufferAttribute(u,y),g.fromBufferAttribute(f,y),x.w=1,g.w=1,x.applyMatrix4(Q),g.applyMatrix4(Q),x.z>h&&g.z>h)continue;if(x.z>h){const m=x.z-g.z,v=(x.z-h)/m;x.lerp(g,v)}else if(g.z>h){const m=g.z-x.z,v=(g.z-h)/m;g.lerp(x,v)}x.applyMatrix4(s),g.applyMatrix4(s),x.multiplyScalar(1/x.w),g.multiplyScalar(1/g.w),x.x*=r.x/2,x.y*=r.y/2,g.x*=r.x/2,g.y*=r.y/2,b.start.copy(x),b.start.z=0,b.end.copy(g),b.end.z=0;const O=b.closestPointToPointParameter(X,!0);b.at(O,xe);const z=ee.lerp(x.z,g.z,O),C=z>=-1&&z<=1,$=X.distanceTo(xe)<M*.5;if(C&&$){b.start.fromBufferAttribute(u,y),b.end.fromBufferAttribute(f,y),b.start.applyMatrix4(d),b.end.applyMatrix4(d);const m=new w,v=new w;_.distanceSqToSegment(b.start,b.end,v,m),t.push({point:v,pointOnLine:m,distance:_.origin.distanceTo(v),object:o,face:null,faceIndex:y,uv:null,[Ne]:null})}}}class Ce extends De{constructor(e=new ne,t=new ie({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,s=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let d=0,l=0,u=t.count;d<u;d++,l+=2)me.fromBufferAttribute(t,d),he.fromBufferAttribute(s,d),i[l]=l===0?0:i[l-1],i[l+1]=i[l]+me.distanceTo(he);const r=new Z(i,2,1);return e.setAttribute("instanceDistanceStart",new I(r,1,0)),e.setAttribute("instanceDistanceEnd",new I(r,1,1)),this}raycast(e,t){const s=this.material.worldUnits,i=e.camera;i===null&&!s&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=e.params.Line2!==void 0&&e.params.Line2.threshold||0;_=e.ray;const d=this.matrixWorld,l=this.geometry,u=this.material;M=u.linewidth+r,l.boundingSphere===null&&l.computeBoundingSphere(),H.copy(l.boundingSphere).applyMatrix4(d);let f;if(s)f=M*.5;else{const h=Math.max(i.near,H.distanceToPoint(_.origin));f=ge(i,h,u.resolution)}if(H.radius+=f,_.intersectsSphere(H)===!1)return;l.boundingBox===null&&l.computeBoundingBox(),F.copy(l.boundingBox).applyMatrix4(d);let p;if(s)p=M*.5;else{const h=Math.max(i.near,F.distanceToPoint(_.origin));p=ge(i,h,u.resolution)}F.expandByScalar(p),_.intersectsBox(F)!==!1&&(s?Ze(this,t):et(this,i,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(Y),this.material.uniforms.resolution.value.set(Y.z,Y.w))}}class tt extends Ce{constructor(e=new Le,t=new ie({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const nt=c.forwardRef(function({points:e,color:t=16777215,vertexColors:s,linewidth:i,lineWidth:r,segments:d,dashed:l,...u},f){var p,h;const y=Te(C=>C.size),A=c.useMemo(()=>d?new Ce:new tt,[d]),[N]=c.useState(()=>new ie),O=(s==null||(p=s[0])==null?void 0:p.length)===4?4:3,z=c.useMemo(()=>{const C=d?new ne:new Le,$=e.map(m=>{const v=Array.isArray(m);return m instanceof w||m instanceof D?[m.x,m.y,m.z]:m instanceof we?[m.x,m.y,0]:v&&m.length===3?[m[0],m[1],m[2]]:v&&m.length===2?[m[0],m[1],0]:m});if(C.setPositions($.flat()),s){t=16777215;const m=s.map(v=>v instanceof We?v.toArray():v);C.setColors(m.flat(),O)}return C},[e,d,s,O]);return c.useLayoutEffect(()=>{A.computeLineDistances()},[e,A]),c.useLayoutEffect(()=>{l?N.defines.USE_DASH="":delete N.defines.USE_DASH,N.needsUpdate=!0},[l,N]),c.useEffect(()=>()=>{z.dispose(),N.dispose()},[z]),c.createElement("primitive",U({object:A,ref:f},u),c.createElement("primitive",{object:z,attach:"geometry"}),c.createElement("primitive",U({object:N,attach:"material",color:t,vertexColors:!!s,resolution:[y.width,y.height],linewidth:(h=i??r)!==null&&h!==void 0?h:1,dashed:l,transparent:O===4},u)))}),J=_e>=154?"opaque_fragment":"output_fragment";class it extends Fe{constructor(e){super(e),this.onBeforeCompile=(t,s)=>{const{isWebGL2:i}=s.capabilities;t.fragmentShader=t.fragmentShader.replace(`#include <${J}>`,`
        ${i?`#include <${J}>`:`#extension GL_OES_standard_derivatives : enable
#include <${J}>`}
      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
      float r = dot(cxy, cxy);
      float delta = fwidth(r);     
      float mask = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
      gl_FragColor = vec4(gl_FragColor.rgb, mask * gl_FragColor.a );
      #include <tonemapping_fragment>
      #include <${_e>=154?"colorspace_fragment":"encodings_fragment"}>
      `)}}}const rt=c.forwardRef((o,e)=>{const[t]=c.useState(()=>new it(null));return c.createElement("primitive",U({},o,{object:t,ref:e,attach:"material"}))});let k,R;const st=c.createContext(null),be=new Se,ye=new w,ot=c.forwardRef(({children:o,range:e,limit:t=1e3,...s},i)=>{const r=c.useRef(null);c.useImperativeHandle(i,()=>r.current,[]);const[d,l]=c.useState([]),[[u,f,p]]=c.useState(()=>[new Float32Array(t*3),Float32Array.from({length:t*3},()=>1),Float32Array.from({length:t},()=>1)]);c.useEffect(()=>{r.current.geometry.attributes.position.needsUpdate=!0}),T(()=>{for(r.current.updateMatrix(),r.current.updateMatrixWorld(),be.copy(r.current.matrixWorld).invert(),r.current.geometry.drawRange.count=Math.min(t,e!==void 0?e:t,d.length),k=0;k<d.length;k++)R=d[k].current,R.getWorldPosition(ye).applyMatrix4(be),ye.toArray(u,k*3),r.current.geometry.attributes.position.needsUpdate=!0,R.matrixWorldNeedsUpdate=!0,R.color.toArray(f,k*3),r.current.geometry.attributes.color.needsUpdate=!0,p.set([R.size],k),r.current.geometry.attributes.size.needsUpdate=!0});const h=c.useMemo(()=>({getParent:()=>r,subscribe:y=>(l(A=>[...A,y]),()=>l(A=>A.filter(N=>N.current!==y.current)))}),[]);return c.createElement("points",U({userData:{instances:d},matrixAutoUpdate:!1,ref:r,raycast:()=>null},s),c.createElement("bufferGeometry",null,c.createElement("bufferAttribute",{attach:"attributes-position",count:u.length/3,array:u,itemSize:3,usage:P}),c.createElement("bufferAttribute",{attach:"attributes-color",count:f.length/3,array:f,itemSize:3,usage:P}),c.createElement("bufferAttribute",{attach:"attributes-size",count:p.length,array:p,itemSize:1,usage:P})),c.createElement(st.Provider,{value:h},o))}),at=c.forwardRef(({children:o,positions:e,colors:t,sizes:s,stride:i=3,...r},d)=>{const l=c.useRef(null);return c.useImperativeHandle(d,()=>l.current,[]),T(()=>{const u=l.current.geometry.attributes;u.position.needsUpdate=!0,t&&(u.color.needsUpdate=!0),s&&(u.size.needsUpdate=!0)}),c.createElement("points",U({ref:l},r),c.createElement("bufferGeometry",null,c.createElement("bufferAttribute",{attach:"attributes-position",count:e.length/i,array:e,itemSize:i,usage:P}),t&&c.createElement("bufferAttribute",{attach:"attributes-color",count:t.length/i,array:t,itemSize:3,usage:P}),s&&c.createElement("bufferAttribute",{attach:"attributes-size",count:s.length/i,array:s,itemSize:1,usage:P})),o)}),lt=c.forwardRef((o,e)=>o.positions instanceof Float32Array?c.createElement(at,U({},o,{ref:e})):c.createElement(ot,U({},o,{ref:e}))),a={bg:"#04060f",bg2:"#070b1c",panel:"rgba(13,19,40,0.55)",ink:"#eef2ff",sub:"#9aa6d6",faint:"#6b76a8",cyan:"#35e0ff",blue:"#4f7bff",violet:"#9a6bff",line:"rgba(120,150,255,0.16)"};function ke(o,e){const t=[],s=Math.PI*(3-Math.sqrt(5));for(let i=0;i<o;i++){const r=1-i/(o-1)*2,d=Math.sqrt(1-r*r),l=s*i;t.push([Math.cos(l)*d*e,r*e,Math.sin(l)*d*e])}return t}function ct(o,e,t,s=26){const i=new w(...o),r=new w(...e),d=[];for(let l=0;l<=s;l++){const u=l/s,f=new w().lerpVectors(i,r,u),p=Math.sin(Math.PI*u)*t;f.normalize().multiplyScalar(i.length()+p),d.push([f.x,f.y,f.z])}return d}const Me=520,re=2.05;function dt({animate:o}){const e=c.useMemo(()=>{const s=ke(Me,re),i=new Float32Array(s.length*3);return s.forEach((r,d)=>{i[d*3]=r[0],i[d*3+1]=r[1],i[d*3+2]=r[2]}),i},[]),t=c.useRef(null);return T(s=>{if(!o||!t.current)return;const i=s.clock.elapsedTime,r=t.current.material;r.size=.045+Math.sin(i*1.4)*.012}),n.jsx(lt,{ref:t,positions:e,stride:3,children:n.jsx(rt,{transparent:!0,color:a.cyan,size:.05,sizeAttenuation:!0,depthWrite:!1,opacity:.92})})}function ut({animate:o}){const e=c.useMemo(()=>{const s=ke(Me,re),i=[],r=[a.cyan,a.blue,a.violet];let d=7;const l=()=>(d=(d*9301+49297)%233280,d/233280);for(let u=0;u<42;u++){const f=s[Math.floor(l()*s.length)],p=s[Math.floor(l()*s.length)];i.push({points:ct(f,p,.45+l()*.55),hue:r[u%r.length],speed:.6+l()*1.1,phase:l()*Math.PI*2})}return i},[]),t=c.useRef(null);return T(s=>{if(!o||!t.current)return;const i=s.clock.elapsedTime;t.current.children.forEach((r,d)=>{const l=e[d],u=r;u.material&&"opacity"in u.material&&(u.material.opacity=.18+(Math.sin(i*l.speed+l.phase)*.5+.5)*.55)})}),n.jsx("group",{ref:t,children:e.map((s,i)=>n.jsx(nt,{points:s.points,color:s.hue,lineWidth:1,transparent:!0,opacity:.4,depthWrite:!1},i))})}function ft({animate:o,pointer:e}){const t=c.useRef(null);return T((s,i)=>{if(t.current)if(o){t.current.rotation.y+=i*.12;const r=e.current.y*.35;t.current.rotation.y,t.current.rotation.x=ee.lerp(t.current.rotation.x,r,.05);const d=e.current.x*.4;t.current.position.x=ee.lerp(t.current.position.x,d*.15,.05)}else t.current.rotation.y=.5,t.current.rotation.x=.18}),n.jsxs("group",{ref:t,children:[n.jsx(dt,{animate:o}),n.jsx(ut,{animate:o}),n.jsxs("mesh",{children:[n.jsx("sphereGeometry",{args:[re*.985,32,32]}),n.jsx("meshBasicMaterial",{color:a.blue,transparent:!0,opacity:.04,side:Ge})]})]})}function pt({animate:o}){const e=c.useRef({x:0,y:0});return c.useEffect(()=>{if(!o)return;const t=s=>{e.current.x=s.clientX/window.innerWidth*2-1,e.current.y=s.clientY/window.innerHeight*2-1};return window.addEventListener("pointermove",t),()=>window.removeEventListener("pointermove",t)},[o]),n.jsx(He,{dpr:[1,1.6],gl:{antialias:!0,alpha:!0},camera:{position:[0,0,6.2],fov:45},children:n.jsxs(c.Suspense,{fallback:null,children:[n.jsx("ambientLight",{intensity:.6}),n.jsx("pointLight",{position:[6,6,8],intensity:1.1,color:a.cyan}),n.jsx("pointLight",{position:[-6,-4,-6],intensity:.7,color:a.violet}),n.jsx(ft,{animate:o,pointer:e})]})})}const L={hidden:{opacity:0,y:28},show:(o=0)=>({opacity:1,y:0,transition:{duration:.7,delay:o*.08,ease:[.22,1,.36,1]}})};function G({children:o}){return n.jsx("span",{className:"inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]",style:{borderColor:"rgba(80,123,255,0.35)",background:"rgba(79,123,255,0.08)",color:a.cyan},children:o})}function V({value:o,suffix:e,label:t,decimals:s=0,reduce:i}){const r=c.useRef(null),[d,l]=c.useState(i?o:0);return c.useEffect(()=>{if(i){l(o);return}const u=r.current;if(!u)return;const f={n:0};let p=!1;const h=new IntersectionObserver(y=>{y[0].isIntersecting&&!p&&(p=!0,B.to(f,{n:o,duration:1.8,ease:"power2.out",onUpdate:()=>l(f.n)}))},{threshold:.4});return h.observe(u),()=>h.disconnect()},[o,i]),n.jsxs("div",{ref:r,className:"text-center",children:[n.jsxs("div",{className:"text-4xl font-black tracking-tight md:text-6xl",style:{background:`linear-gradient(180deg, ${a.ink}, ${a.cyan})`,WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"},children:[d.toFixed(s),e]}),n.jsx("div",{className:"mt-2 text-xs font-medium uppercase tracking-[0.18em] md:text-sm",style:{color:a.sub},children:t})]})}function mt({service:o,index:e}){const t=o.icon;return n.jsxs(S.div,{custom:e,variants:L,className:"group relative overflow-hidden rounded-2xl border p-6 transition-colors duration-300",style:{borderColor:a.line,background:a.panel,backdropFilter:"blur(10px)"},whileHover:{y:-6},children:[n.jsx("div",{className:"pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60",style:{background:a.blue}}),n.jsx("span",{className:"relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border",style:{borderColor:"rgba(80,123,255,0.3)",background:"rgba(53,224,255,0.08)",color:a.cyan},children:n.jsx(t,{className:"h-6 w-6"})}),n.jsx("h3",{className:"relative text-base font-bold leading-snug md:text-lg",style:{color:a.ink},children:o.title}),n.jsx("p",{className:"relative mt-2 text-sm",style:{color:a.sub},children:o.tagline})]})}function K({title:o,blurb:e,items:t}){return n.jsxs("div",{className:"mb-16 last:mb-0",children:[n.jsxs("div",{className:"mb-6 flex flex-col gap-1",children:[n.jsx("h3",{className:"text-xl font-bold md:text-2xl",style:{color:a.ink},children:o}),n.jsx("p",{className:"text-sm",style:{color:a.faint},children:e})]}),n.jsx(S.div,{className:"grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",variants:{show:{transition:{staggerChildren:.06}}},initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-80px"},children:t.map((s,i)=>n.jsx(mt,{service:s,index:i},s.id))})]})}const ht=[{icon:Ee,title:"Discover",text:"We map your goals, constraints, and the highest-leverage problem worth solving first."},{icon:je,title:"Architect",text:"A pragmatic blueprint — systems, data, and security designed to scale without rewrites."},{icon:Qe,title:"Build & Ship",text:"Tight iterations, CI/CD, and zero-drama deploys. You see progress every single week."},{icon:Je,title:"Operate & Scale",text:"Monitoring, hardening, and handover so the system stays fast, safe, and yours."}],xt=[{quote:"IFLEON took us from quarterly releases to shipping daily. Build times went from 40 minutes to under five — and our 2 AM hotfixes are gone.",name:"Head of Engineering",role:"B2B SaaS, Bengaluru"},{quote:"Their AI assistant now deflects over 40% of our support tickets. It answers from our own docs, accurately, in seconds.",name:"Operations Director",role:"Fintech, Singapore"},{quote:"We closed two enterprise deals faster after the ISO 27001 readiness work. Audit-ready documentation, no penalties, no drama.",name:"Founder & CEO",role:"HealthTech, Hyderabad"}];function Et(){const o=Ue(),e=!o,t=c.useRef(null),{scrollYProgress:s}=Oe(),i=q(s,[0,.12],[1,0]),r=se(q(s,[0,.18],[0,-120]),{stiffness:120,damping:30}),d=se(q(s,[0,.25],[0,90]),{stiffness:80,damping:28});c.useEffect(()=>{if(o)return;B.registerPlugin(Ve);const u=B.context(()=>{B.utils.toArray("[data-reveal]").forEach(p=>{B.fromTo(p,{autoAlpha:0,y:60},{autoAlpha:1,y:0,duration:.9,ease:"power3.out",scrollTrigger:{trigger:p,start:"top 82%"}})});const f=document.querySelector("[data-cinematic]");f&&B.fromTo(f,{clipPath:"inset(18% 12% round 28px)",opacity:.55},{clipPath:"inset(0% 0% round 0px)",opacity:1,ease:"none",scrollTrigger:{trigger:f,start:"top 88%",end:"top 32%",scrub:!0}})},t);return()=>u.revert()},[o]);const l={background:`radial-gradient(1200px 700px at 70% -10%, rgba(79,123,255,0.18), transparent 60%), radial-gradient(900px 600px at 10% 20%, rgba(154,107,255,0.12), transparent 55%), linear-gradient(180deg, ${a.bg}, ${a.bg2})`,color:a.ink};return n.jsxs("div",{ref:t,className:"relative min-h-screen overflow-hidden",style:l,children:[n.jsx("div",{className:"pointer-events-none absolute inset-0 opacity-[0.35]",style:{backgroundImage:"linear-gradient(rgba(120,150,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,255,0.06) 1px, transparent 1px)",backgroundSize:"54px 54px",maskImage:"radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)",WebkitMaskImage:"radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)"}}),n.jsxs("section",{className:"relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center px-6 pt-28 md:pt-32",children:[n.jsx(S.div,{className:"absolute inset-x-0 top-10 mx-auto h-[60vh] max-w-4xl md:h-[78vh]",style:{y:e?d:0},children:n.jsx(pt,{animate:e})}),n.jsxs(S.div,{className:"relative z-10 mt-[34vh] flex flex-col items-center text-center md:mt-[40vh]",style:{opacity:e?i:1,y:e?r:0},children:[n.jsx(S.div,{initial:"hidden",animate:"show",variants:L,custom:0,children:n.jsxs(G,{children:[n.jsx($e,{className:"h-3.5 w-3.5"}),"IFLEON · Infinite Logical Elements of Network"]})}),n.jsxs(S.h1,{initial:"hidden",animate:"show",variants:L,custom:1,className:"mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl",children:["Infinite Possibilities,"," ",n.jsx("span",{style:{background:`linear-gradient(120deg, ${a.cyan}, ${a.blue} 55%, ${a.violet})`,WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent"},children:"Logical Solutions."})]}),n.jsx(S.p,{initial:"hidden",animate:"show",variants:L,custom:2,className:"mt-6 max-w-2xl text-base leading-relaxed md:text-lg",style:{color:a.sub},children:"A founder-led AI, DevOps, Cloud & Cybersecurity consultancy out of Nellore, India — engineering connected systems for businesses and individuals, across India and the globe."}),n.jsxs(S.div,{initial:"hidden",animate:"show",variants:L,custom:3,className:"mt-9 flex flex-col gap-4 sm:flex-row",children:[n.jsxs("a",{href:"mailto:info@ifleon.com",className:"group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.03]",style:{background:`linear-gradient(120deg, ${a.cyan}, ${a.blue})`,color:"#04060f",boxShadow:"0 10px 40px rgba(53,224,255,0.3)"},children:[n.jsx(de,{className:"h-4 w-4"}),"Request a Free Consultation"]}),n.jsxs(oe,{to:"/services",className:"group inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold transition-colors duration-200",style:{borderColor:"rgba(120,150,255,0.35)",background:"rgba(255,255,255,0.02)",color:a.ink},children:["Explore Services",n.jsx(ue,{className:"h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"})]})]}),n.jsx(S.p,{initial:"hidden",animate:"show",variants:L,custom:4,className:"mt-8 text-xs uppercase tracking-[0.2em]",style:{color:a.faint},children:"ISO 27001 · DPDP · SOC 2 — compliance-ready by design"})]})]}),n.jsx("section",{className:"relative mx-auto max-w-6xl px-6 py-20","data-reveal":!0,children:n.jsxs("div",{className:"grid grid-cols-2 gap-8 rounded-3xl border px-6 py-12 md:grid-cols-4",style:{borderColor:a.line,background:a.panel,backdropFilter:"blur(12px)"},children:[n.jsx(V,{value:25,label:"Projects Delivered",reduce:!e}),n.jsx(V,{value:6,label:"Industries Served",reduce:!e}),n.jsx(V,{value:50,suffix:"+",label:"Clients Worldwide",reduce:!e}),n.jsx(V,{value:99.9,suffix:"%",decimals:1,label:"Uptime SLA",reduce:!e})]})}),n.jsxs("section",{className:"relative mx-auto max-w-7xl px-6 py-16","data-reveal":!0,children:[n.jsxs("div",{className:"mb-12 max-w-2xl",children:[n.jsxs(G,{children:[n.jsx(je,{className:"h-3.5 w-3.5"}),"Capabilities"]}),n.jsx("h2",{className:"mt-5 text-3xl font-black tracking-tight md:text-5xl",style:{color:a.ink},children:"One network, sixteen ways to move forward."}),n.jsx("p",{className:"mt-4 text-base",style:{color:a.sub},children:"From enterprise AI and cloud to securing your home and launching your career — every node connects to the same logical core."})]}),n.jsx(K,{title:"For Business",blurb:"Enterprise-grade engineering, security, and transformation.",items:qe}),n.jsx(K,{title:"For Individuals",blurb:"Personal tech, security, and guidance that actually helps.",items:Ye}),n.jsx(K,{title:"Specialty & Add-Ons",blurb:"Focused engagements that plug into any engagement above.",items:Xe})]}),n.jsx("section",{className:"relative py-20","data-cinematic":!0,children:n.jsxs("div",{className:"mx-auto max-w-7xl px-6 py-16",style:{background:"linear-gradient(180deg, rgba(79,123,255,0.06), rgba(4,6,15,0))",borderTop:`1px solid ${a.line}`,borderBottom:`1px solid ${a.line}`},children:[n.jsxs("div",{className:"mb-12 max-w-2xl",children:[n.jsxs(G,{children:[n.jsx(Ee,{className:"h-3.5 w-3.5"}),"How we work"]}),n.jsx("h2",{className:"mt-5 text-3xl font-black tracking-tight md:text-5xl",style:{color:a.ink},children:"A clear path from idea to running system."})]}),n.jsx("div",{className:"grid grid-cols-1 gap-6 md:grid-cols-4",children:ht.map((u,f)=>{const p=u.icon;return n.jsxs(S.div,{custom:f,variants:L,initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-60px"},className:"relative rounded-2xl border p-6",style:{borderColor:a.line,background:a.panel},children:[n.jsxs("div",{className:"mb-4 text-xs font-bold",style:{color:a.cyan},children:["STEP ",String(f+1).padStart(2,"0")]}),n.jsx("span",{className:"mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border",style:{borderColor:"rgba(80,123,255,0.3)",background:"rgba(53,224,255,0.08)",color:a.cyan},children:n.jsx(p,{className:"h-5 w-5"})}),n.jsx("h3",{className:"text-lg font-bold",style:{color:a.ink},children:u.title}),n.jsx("p",{className:"mt-2 text-sm",style:{color:a.sub},children:u.text})]},u.title)})})]})}),n.jsxs("section",{className:"relative mx-auto max-w-7xl px-6 py-20","data-reveal":!0,children:[n.jsxs("div",{className:"mb-12 max-w-2xl",children:[n.jsxs(G,{children:[n.jsx(fe,{className:"h-3.5 w-3.5"}),"Signal from the field"]}),n.jsx("h2",{className:"mt-5 text-3xl font-black tracking-tight md:text-5xl",style:{color:a.ink},children:"Outcomes, not adjectives."})]}),n.jsx("div",{className:"grid grid-cols-1 gap-6 md:grid-cols-3",children:xt.map((u,f)=>n.jsxs(S.figure,{custom:f,variants:L,initial:"hidden",whileInView:"show",viewport:{once:!0,margin:"-60px"},className:"relative flex flex-col rounded-2xl border p-7",style:{borderColor:a.line,background:a.panel,backdropFilter:"blur(10px)"},children:[n.jsx(fe,{className:"mb-4 h-7 w-7",style:{color:a.blue,opacity:.7}}),n.jsxs("blockquote",{className:"flex-1 text-sm leading-relaxed md:text-base",style:{color:a.ink},children:["“",u.quote,"”"]}),n.jsxs("figcaption",{className:"mt-6",children:[n.jsx("div",{className:"text-sm font-bold",style:{color:a.cyan},children:u.name}),n.jsx("div",{className:"text-xs",style:{color:a.faint},children:u.role})]})]},f))})]}),n.jsx("section",{className:"relative mx-auto max-w-5xl px-6 pb-28 pt-8","data-reveal":!0,children:n.jsxs("div",{className:"relative overflow-hidden rounded-3xl border px-8 py-16 text-center md:px-16 md:py-20",style:{borderColor:"rgba(80,123,255,0.35)",background:"radial-gradient(700px 400px at 50% -20%, rgba(53,224,255,0.16), transparent 60%), linear-gradient(180deg, rgba(13,19,40,0.85), rgba(7,11,28,0.95))"},children:[n.jsx("div",{className:"pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-30 blur-3xl",style:{background:a.violet}}),n.jsx("div",{className:"pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-30 blur-3xl",style:{background:a.cyan}}),n.jsx("h2",{className:"relative mx-auto max-w-3xl text-3xl font-black leading-tight tracking-tight md:text-5xl",style:{color:a.ink},children:"Let's connect your next idea to the network."}),n.jsx("p",{className:"relative mx-auto mt-5 max-w-xl text-base",style:{color:a.sub},children:"Tell us what you're building. We'll reply with a clear path, honest timeline, and the first node to light up."}),n.jsxs("div",{className:"relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row",children:[n.jsxs("a",{href:"mailto:info@ifleon.com",className:"inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.03]",style:{background:`linear-gradient(120deg, ${a.cyan}, ${a.blue})`,color:"#04060f",boxShadow:"0 10px 40px rgba(53,224,255,0.3)"},children:[n.jsx(de,{className:"h-4 w-4"}),"info@ifleon.com"]}),n.jsxs(oe,{to:"/services",className:"inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold",style:{borderColor:"rgba(120,150,255,0.35)",color:a.ink},children:["Explore Services",n.jsx(ue,{className:"h-4 w-4"})]}),n.jsxs("a",{href:"https://github.com/ifleonlabs",target:"_blank",rel:"noreferrer",className:"inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold transition-colors duration-200",style:{borderColor:"rgba(120,150,255,0.2)",color:a.sub},children:[n.jsx(Ke,{className:"h-4 w-4"}),"github.com/ifleonlabs"]})]})]})})]})}export{Et as default};
