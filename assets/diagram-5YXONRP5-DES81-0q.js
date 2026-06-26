import{c as I}from"./chunk-JQRUD6KW-C_S6LwzH.js";import{l as S}from"./cynefin-VYW2F7L2-2VAHYKR6-BJuXdiFi.js";import{h as E,n as F,g as z,d as P,a as R,l as B,m as c,a2 as D,s as W,L as y,I as w,w as G,p as V,a7 as _,o as j}from"./mermaid.esm.min-Bqz5VZ8U.js";import"./app-DfVcRTsU.js";var h={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},b={axes:[],curves:[],options:h},x=structuredClone(b),H=G.radar,U=c(()=>y({...H,...w().radar}),"getConfig"),C=c(()=>x.axes,"getAxes"),Z=c(()=>x.curves,"getCurves"),q=c(()=>x.options,"getOptions"),J=c(a=>{x.axes=a.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),K=c(a=>{x.curves=a.map(t=>({name:t.name,label:t.label??t.name,entries:N(t.entries)}))},"setCurves"),N=c(a=>{if(a[0].axis==null)return a.map(e=>e.value);let t=C();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(e=>{let r=a.find(i=>i.axis?.$refText===e.name);if(r===void 0)throw new Error("Missing entry for axis "+e.label);return r.value})},"computeCurveEntries"),Q=c(a=>{let t=a.reduce((e,r)=>(e[r.name]=r,e),{});x.options={showLegend:t.showLegend?.value??h.showLegend,ticks:t.ticks?.value??h.ticks,max:t.max?.value??h.max,min:t.min?.value??h.min,graticule:t.graticule?.value??h.graticule}},"setOptions"),X=c(()=>{W(),x=structuredClone(b)},"clear"),f={getAxes:C,getCurves:Z,getOptions:q,setAxes:J,setCurves:K,setOptions:Q,getConfig:U,clear:X,setAccTitle:B,getAccTitle:R,setDiagramTitle:P,getDiagramTitle:z,getAccDescription:F,setAccDescription:E},Y=c(a=>{I(a,f);let{axes:t,curves:e,options:r}=a;f.setAxes(t),f.setCurves(e),f.setOptions(r)},"populate"),tt={parse:c(async a=>{let t=await S("radar",a);V.debug(t),Y(t)},"parse")},et=c((a,t,e,r)=>{let i=r.db,n=i.getAxes(),o=i.getCurves(),s=i.getOptions(),l=i.getConfig(),d=i.getDiagramTitle(),p=D(t),g=at(p,l),u=s.max??Math.max(...o.map(v=>Math.max(...v.entries))),m=s.min,$=Math.min(l.width,l.height)/2;rt(g,n,$,s.ticks,s.graticule),it(g,n,$,l),L(g,n,o,m,u,s.graticule,l),k(g,o,s.showLegend,l),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-l.height/2-l.marginTop)},"draw"),at=c((a,t)=>{let e=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return j(a,r,e,t.useMaxWidth??!0),a.attr("viewBox",`0 0 ${e} ${r}`).attr("overflow","visible"),a.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),rt=c((a,t,e,r,i)=>{if(i==="circle")for(let n=0;n<r;n++){let o=e*(n+1)/r;a.append("circle").attr("r",o).attr("class","radarGraticule")}else if(i==="polygon"){let n=t.length;for(let o=0;o<r;o++){let s=e*(o+1)/r,l=t.map((d,p)=>{let g=2*p*Math.PI/n-Math.PI/2,u=s*Math.cos(g),m=s*Math.sin(g);return`${u},${m}`}).join(" ");a.append("polygon").attr("points",l).attr("class","radarGraticule")}}},"drawGraticule"),it=c((a,t,e,r)=>{let i=t.length;for(let n=0;n<i;n++){let o=t[n].label,s=2*n*Math.PI/i-Math.PI/2,l=Math.cos(s),d=Math.sin(s);a.append("line").attr("x1",0).attr("y1",0).attr("x2",e*r.axisScaleFactor*l).attr("y2",e*r.axisScaleFactor*d).attr("class","radarAxisLine");let p=l>.01?"start":l<-.01?"end":"middle",g=d>.01?"hanging":d<-.01?"auto":"central",u=4;a.append("text").text(o).attr("x",e*r.axisLabelFactor*l+u*l).attr("y",e*r.axisLabelFactor*d+u*d).attr("text-anchor",p).attr("dominant-baseline",g).attr("class","radarAxisLabel")}},"drawAxes");function L(a,t,e,r,i,n,o){let s=t.length,l=Math.min(o.width,o.height)/2;e.forEach((d,p)=>{if(d.entries.length!==s)return;let g=d.entries.map((u,m)=>{let $=2*Math.PI*m/s-Math.PI/2,v=M(u,r,i,l),A=v*Math.cos($),O=v*Math.sin($);return{x:A,y:O}});n==="circle"?a.append("path").attr("d",T(g,o.curveTension)).attr("class",`radarCurve-${p}`):n==="polygon"&&a.append("polygon").attr("points",g.map(u=>`${u.x},${u.y}`).join(" ")).attr("class",`radarCurve-${p}`)})}c(L,"drawCurves");function M(a,t,e,r){let i=Math.min(Math.max(a,t),e);return r*(i-t)/(e-t)}c(M,"relativeRadius");function T(a,t){let e=a.length,r=`M${a[0].x},${a[0].y}`;for(let i=0;i<e;i++){let n=a[(i-1+e)%e],o=a[i],s=a[(i+1)%e],l=a[(i+2)%e],d={x:o.x+(s.x-n.x)*t,y:o.y+(s.y-n.y)*t},p={x:s.x-(l.x-o.x)*t,y:s.y-(l.y-o.y)*t};r+=` C${d.x},${d.y} ${p.x},${p.y} ${s.x},${s.y}`}return`${r} Z`}c(T,"closedRoundCurve");function k(a,t,e,r){if(!e)return;let i=(r.width/2+r.marginRight)*3/4,n=-(r.height/2+r.marginTop)*3/4,o=20;t.forEach((s,l)=>{let d=a.append("g").attr("transform",`translate(${i}, ${n+l*o})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${l}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(s.label)})}c(k,"drawLegend");var st={draw:et},lt=c((a,t)=>{let e="";for(let r=0;r<a.THEME_COLOR_LIMIT;r++){let i=a[`cScale${r}`];e+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return e},"genIndexStyles"),nt=c(a=>{let t=_(),e=w(),r=y(t,e.themeVariables),i=y(r.radar,a);return{themeVariables:r,radarOptions:i}},"buildRadarStyleOptions"),ot=c(({radar:a}={})=>{let{themeVariables:t,radarOptions:e}=nt(a);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${e.axisColor};
		stroke-width: ${e.axisStrokeWidth};
	}
	.radarAxisLabel {
		font-size: ${e.axisLabelFontSize}px;
		color: ${e.axisColor};
	}
	.radarGraticule {
		fill: ${e.graticuleColor};
		fill-opacity: ${e.graticuleOpacity};
		stroke: ${e.graticuleColor};
		stroke-width: ${e.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${e.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${lt(t,e)}
	`},"styles"),ut={parser:tt,db:f,renderer:st,styles:ot};export{ut as diagram};
