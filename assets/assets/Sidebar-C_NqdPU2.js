import{j as e}from"./vendor-motion-SFxk91kW.js";import{r,c as g,L as j}from"./vendor-react-CKzJvXsF.js";import{c as a,X as v,f as y,H as N,g as w,h as k,U as C}from"./index-C-aYgKN8.js";import{S}from"./search-DaTgob--.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=a("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=a("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=a("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=a("HelpCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=a("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=a("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),A=[{id:"dashboard",name:"Dashboard",icon:N,href:"/dashboard"},{id:"analytics",name:"Analytics",icon:w,href:"/analytics"},{id:"documents",name:"Documents",icon:H,href:"/documents",badge:"3"},{id:"notifications",name:"Notifications",icon:k,href:"/notifications",badge:"12"},{id:"profile",name:"Profile",icon:C,href:"/profile"},{id:"settings",name:"Settings",icon:E,href:"/settings"},{id:"help",name:"Help & Support",icon:M,href:"/help"}];function R({className:c="",children:m}){const[n,l]=r.useState(!1),[t,x]=r.useState(!1),o=g(),[u,h]=r.useState(o.pathname);r.useEffect(()=>{h(o.pathname)},[o.pathname]),r.useEffect(()=>{const s=()=>{window.innerWidth>=768?l(!0):l(!1)};return s(),window.addEventListener("resize",s),()=>window.removeEventListener("resize",s)},[]);const i=()=>l(!n),f=()=>x(!t),p=()=>{window.location.reload()};return e.jsxs("div",{className:"flex min-h-screen bg-background",children:[e.jsx("button",{onClick:i,className:"fixed top-6 left-6 z-50 p-3 rounded-lg bg-card shadow-card border border-border md:hidden hover:bg-muted transition-all duration-200","aria-label":"Toggle sidebar",children:n?e.jsx(v,{className:"h-5 w-5 text-muted-foreground"}):e.jsx(y,{className:"h-5 w-5 text-muted-foreground"})}),n&&e.jsx("div",{className:"fixed inset-0 bg-background/70 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300",onClick:i}),e.jsxs("div",{className:`
          fixed top-0 left-0 h-full bg-card border-r border-border z-40 transition-all duration-300 ease-in-out flex flex-col
          ${n?"translate-x-0":"-translate-x-full"}
          ${t?"w-28":"w-78"}
          md:translate-x-0 md:relative
          ${c}
        `,children:[e.jsxs("div",{className:"flex items-center justify-between p-5 border-b border-border bg-muted/40",children:[!t&&e.jsxs("div",{className:"flex items-center space-x-2.5",children:[e.jsx("div",{className:"w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-card",children:e.jsx("span",{className:"text-primary-foreground font-bold text-base",children:"A"})}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"font-semibold text-foreground text-base",children:"Acme Corp"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Enterprise Dashboard"})]})]}),t&&e.jsx("div",{className:"w-9 h-9 bg-primary rounded-lg flex items-center justify-center mx-auto shadow-card",children:e.jsx("span",{className:"text-primary-foreground font-bold text-base",children:"A"})}),e.jsx("button",{onClick:f,className:"hidden md:flex p-1.5 rounded-md hover:bg-muted transition-all duration-200","aria-label":t?"Expand sidebar":"Collapse sidebar",children:t?e.jsx(z,{className:"h-4 w-4 text-muted-foreground"}):e.jsx(L,{className:"h-4 w-4 text-muted-foreground"})})]}),!t&&e.jsx("div",{className:"px-4 py-3",children:e.jsxs("div",{className:"relative",children:[e.jsx(S,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"}),e.jsx("input",{type:"text",placeholder:"Search...",className:"w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"})]})}),e.jsx("nav",{className:"flex-1 px-3 py-2 overflow-y-auto",children:e.jsx("ul",{className:"space-y-0.5",children:A.map(s=>{const b=s.icon,d=u===s.href;return e.jsx("li",{children:e.jsxs(j,{to:s.href,className:`
                      w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group
                      ${d?"bg-primary/10 text-brand":"text-muted-foreground hover:bg-muted hover:text-foreground"}
                      ${t?"justify-center px-2":""}
                    `,title:t?s.name:void 0,children:[e.jsx("div",{className:"flex items-center justify-center min-w-[24px]",children:e.jsx(b,{className:`
                          h-4.5 w-4.5 flex-shrink-0
                          ${d?"text-brand":"text-muted-foreground group-hover:text-foreground"}
                        `})}),!t&&e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("span",{className:`text-sm ${d?"font-medium":"font-normal"}`,children:s.name}),s.badge&&e.jsx("span",{className:`
                            px-1.5 py-0.5 text-xs font-medium rounded-full
                            ${d?"bg-primary/10 text-brand":"bg-muted text-muted-foreground"}
                          `,children:s.badge})]})]})},s.id)})})}),e.jsxs("div",{className:"mt-auto border-t border-border",children:[e.jsx("div",{className:`border-b border-border bg-muted/20 ${t?"py-3 px-2":"p-3"}`,children:t?e.jsx("div",{className:"flex justify-center",children:e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"w-9 h-9 bg-muted rounded-full flex items-center justify-center",children:e.jsx("span",{className:"text-foreground font-medium text-sm",children:"JD"})}),e.jsx("div",{className:"absolute -bottom-1 -right-1 w-3 h-3 bg-brand-2 rounded-full border-2 border-card"})]})}):e.jsxs("div",{className:"flex items-center px-3 py-2 rounded-md bg-card hover:bg-muted transition-colors duration-200",children:[e.jsx("div",{className:"w-8 h-8 bg-muted rounded-full flex items-center justify-center",children:e.jsx("span",{className:"text-foreground font-medium text-sm",children:"JD"})}),e.jsxs("div",{className:"flex-1 min-w-0 ml-2.5",children:[e.jsx("p",{className:"text-sm font-medium text-foreground truncate",children:"John Doe"}),e.jsx("p",{className:"text-xs text-muted-foreground truncate",children:"Senior Administrator"})]}),e.jsx("div",{className:"w-2 h-2 bg-brand-2 rounded-full ml-2",title:"Online"})]})}),e.jsx("div",{className:"p-3",children:e.jsxs("button",{onClick:p,className:`
                w-full flex items-center rounded-md text-left transition-all duration-200 group
                text-destructive hover:bg-destructive/10
                ${t?"justify-center p-2.5":"space-x-2.5 px-3 py-2.5"}
              `,title:t?"Logout":void 0,children:[e.jsx("div",{className:"flex items-center justify-center min-w-[24px]",children:e.jsx($,{className:"h-4.5 w-4.5 flex-shrink-0 text-destructive"})}),!t&&e.jsx("span",{className:"text-sm",children:"Logout"})]})})]})]}),e.jsxs("main",{className:`
          flex-1 transition-all duration-300 ease-in-out p-6
        `,children:[e.jsx("div",{className:"md:hidden h-16"}),m]})]})}export{R as S};
