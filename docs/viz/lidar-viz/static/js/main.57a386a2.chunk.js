(this["webpackJsonppotree-test"]=this["webpackJsonppotree-test"]||[]).push([[0],{47:function(t,e,n){},66:function(t,e,n){},67:function(t,e,n){"use strict";n.r(e);var a=n(0),i=n.n(a),r=n(13),o=n.n(r),s=(n(47),n(9)),c=n(10),u=n(16),d=n(15),l=n(38),p=n(42),v=n(11),b=l.a.div.withConfig({displayName:"PotreeViewer__Wrapper",componentId:"sc-c8zanb-0"})(["background-color:black;display:flex;flex-direction:column;height:100vh;overflow:auto;position:static;align-content:center;"]),g=window.Potree,m=function(t){for(var e=t.updateParams,n={},i=0,r=["elevation","classification","number of returns","return number","intensity"];i<r.length;i++){var o=r[i];n[o]=o}for(var s={},c=0,u=["spectral","plasma","grayscale","rainbow","contour"];c<u.length;c++){var d=u[c];s[d]=d}var l=Object(p.a)({attribute:{options:n},gradient:{options:s,render:function(t){return"elevation"==t("attribute")}},point_budget:{value:2e6,min:1e5,max:5e6,step:1},FOV:{value:50,min:20,max:100,step:1}}),v=l.attribute,b=l.gradient,g=l.point_budget,m=l.FOV;return Object(a.useEffect)((function(){e({params:{attribute:v,gradient:b,point_budget:g,FOV:m}})}),[v,b,g,m]),null},h=function(t){Object(u.a)(n,t);var e=Object(d.a)(n);function n(t){var a;Object(s.a)(this,n);var r=new URLSearchParams(window.location.search),o=r.get("attribute"),c=r.get("gradient");return(a=e.call(this,t)).potreeContainerDiv=i.a.createRef(),a.handleParamUpdate=function(t){console.log("updating params"),a.setState(t)},a.state={params:{attribute:o,gradient:c,point_budget:2e6,FOV:60},view:null,queryAttribute:o,queryGradient:c},a}return Object(c.a)(n,[{key:"render",value:function(){return Object(v.jsxs)("div",{id:"potree-root",children:[Object(v.jsx)(b,{ref:this.potreeContainerDiv,className:"potree_container ",children:Object(v.jsx)("div",{id:"potree_render_area"})}),null===this.state.queryAttribute?Object(v.jsx)(m,{updateParams:this.handleParamUpdate}):null]})}},{key:"componentDidMount",value:function(){var t=this.potreeContainerDiv.current,e=new g.Viewer(t);this.setState({viewer:e});new URLSearchParams(window.location.search);var n=this.state.params,a=n.attribute,i=n.gradient,r="";r=null===a||"elevation"===a?"elevation":a,e.setEDLEnabled(!0),e.setPointBudget(0),e.setControls(e.orbitControls);g.loadPointCloud("./pointcloud/metadata.json").then((function(t){var n=e.scene,a=t.pointcloud,o=a.material;o.minSize=2,o.pointSizeType=g.PointSizeType.ATTENUATED,o.activeAttributeName=r,o.gradient=g.Gradients.SPECTRAL,"plasma"===i||"PLASMA"===i?o.gradient=g.Gradients.PLASMA:"grayscale"===i||"GRAYSCALE"===i?o.gradient=g.Gradients.GRAYSCALE:"rainbow"===i||"RAINBOW"===i?o.gradient=g.Gradients.RAINBOW:"contour"!==i&&"CONTOUR"!==i||(o.gradient=g.Gradients.CONTOUR),e.scene.addPointCloud(a),e.setFOV(50),n.view.position.set(485755.8425622129,5457897.079154126,121.79049529340284),n.view.lookAt(485620.651,5457902.803,27.656)}),(function(t){return console.err("ERROR: ",t)}))}},{key:"componentDidUpdate",value:function(){this.state.viewer&&(this.state.viewer.setPointBudget(this.state.params.point_budget),this.state.viewer.setFOV(this.state.params.FOV));var t=this.state.params.attribute,e=this.state.params.gradient,n=this.state.viewer.scene.pointclouds[0];if(void 0!=n){var a=n.material;a.minSize=2,a.pointSizeType=g.PointSizeType.ATTENUATED,a.activeAttributeName=t,a.gradient=g.Gradients.SPECTRAL,a.gradient="plasma"===e||"PLASMA"===e?g.Gradients.PLASMA:"grayscale"===e||"GRAYSCALE"===e?g.Gradients.GRAYSCALE:"rainbow"===e||"RAINBOW"===e?g.Gradients.RAINBOW:"contour"===e||"CONTOUR"===e?g.Gradients.CONTOUR:g.Gradients.SPECTRAL}}}]),n}(i.a.Component);n(66);var O=function(){return Object(v.jsx)(h,{})},A=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,68)).then((function(e){var n=e.getCLS,a=e.getFID,i=e.getFCP,r=e.getLCP,o=e.getTTFB;n(t),a(t),i(t),r(t),o(t)}))};o.a.render(Object(v.jsx)(i.a.StrictMode,{children:Object(v.jsx)(O,{})}),document.getElementById("root")),A()}},[[67,1,2]]]);
//# sourceMappingURL=main.57a386a2.chunk.js.map