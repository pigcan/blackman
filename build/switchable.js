!function(a,b,c){function d(a,c){var d,e=this,f=arguments.length;if("string"==typeof arguments[0]){if(e.ele=b.querySelector(arguments[0]),!e.ele)throw new Error("element not found");e.fromHtmlNode=!0,d=c||{}}else{if(0!=f&&"object"!=typeof arguments[0])throw new Error("Configuration Error");d=arguments[0]||{}}e.itemWidth=d.itemWidth,e.distance=d.distance,e.maxPoint=d.maxPoint,e.duration=d.duration||350,e.loop=d.loop||!1,e.dtnY=d.dtnY||!1,e.dtnY?(e.axisDtn="Y",e.itemHeight=d.itemHeight):e.axisDtn="X",e.root=b.createDocumentFragment(),e.begin=b.createComment("slide-begin"),e.end=b.createComment("slide-end"),e.fromHtmlNode?(e.div=e.ele,e.element=e.ele.querySelector("ul"),e.ele.parentNode.insertBefore(e.begin,e.ele),e.ele.parentNode.insertBefore(e.end,e.ele.nextSibling)):(e.root.appendChild(e.begin),e.div=b.createElement("div"),e.element=b.createElement("ul"),e.div.appendChild(e.element),e.root.appendChild(e.div),e.root.appendChild(e.end),e.vm=null),e.div.style.cssText="overflow:hidden;margin: 0 auto;position:relative;-webkit-transform : translateZ(0)",e.div.className="slide",e["current"+e.axisDtn]=0,e.currentPoint=0,e.element.addEventListener(l.start[k],e,!1),b.addEventListener("gesturestart",function(){j=!0}),b.addEventListener("gestureend",function(){j=!1});var g=null;Object.defineProperty(this,"position",{set:function(a){g=a,o.apply(e,[g])},get:function(){return g}});var h=0;return Object.defineProperty(this,"currentSelected",{set:function(a){var b=a;h=b,e.loop&&(h=e.edgeOfLeft?e.maxPoint:e.edgeOfRight?0:a,e.edgeOfLeft&&--b,e.edgeOfRight&&++b),s.apply(e,[b])},get:function(){return parseInt(h)}}),e.fromHtmlNode&&e.asyncViewModel(),e}var e=function(a,b,c,d){function e(a){return(3*k*a+2*l)*a+m}function f(a){return((k*a+l)*a+m)*a}function g(a){return((n*a+o)*a+p)*a}function h(a){for(var b,c,d=a,g=0;8>g;g++){if(c=f(d)-a,Math.abs(c)<j)return d;if(b=e(d),Math.abs(b)<j)break;d-=c/b}var h=1,i=0;for(d=a;h>i;){if(c=f(d)-a,Math.abs(c)<j)return d;c>0?h=d:i=d,d=(h+i)/2}return d}function i(a){return g(h(a))}var j=1e-6,k=3*a-3*c+1,l=3*c-6*a,m=3*a,n=3*b-3*d+1,o=3*d-6*b,p=3*b;return i},f=function(a,b,c,d,e,f){this.handler=null,this.start=function(){this.handler&&this.stop();var e=Date.now(),h=this;this.handler=setInterval(function(){var i=Date.now(),j=i-e;if(j>=d){clearInterval(h.handler),j=d;a.loop&&(a.direction<=0&&a.edgeOfLeft&&(console.log("右滑最后一个，位置复位"),a.element.style.cssText+="-webkit-transform:"+g.gv1+"-"+a.maxPoint*a.distance+"px,0"+g.gv2),1==a.direction&&a.edgeOfRight&&(console.log("左滑最后一个，位置复位"),a.element.style.cssText+="-webkit-transform:"+g.gv1+"0px,0"+g.gv2)),this.isPlaying||n.apply(a,["afterSwitch",!0,!0])}a[b]=c(j),j>=d?a[b]=f:n.apply(a,["switch",!0,!0]),a.loop&&j>=d&&(a.edgeOfLeft&&(a.position=-a.maxPoint*a.distance),a.edgeOfLeft=!1,a.edgeOfRight&&(a.position=0),a.edgeOfRight=!1)},10)},this.stop=function(){console.log("stop setInterval end time is",Date.now()),clearInterval(this.handler)};var h=null;Object.defineProperty(this,"isPlaying",{set:function(a){h=a},get:function(){return this.handler?!0:!1}})},g=(d.util={},d.support={}),h=function(a){return a.some(function(a){return!!(a in b.documentElement.style)})},i=function(){var a=!1;if(h(["WebkitPerspective"])&&h(["webkitPerspective"])){var c,d=b.createElement("div");c=['<style id="smodernizr">',"@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}","</style>"].join(""),d.id="modernizr",d.innerHTML=c,b.body.appendChild(d),a=9===d.offsetLeft&&5===d.offsetHeight,d.parentNode.removeChild(d)}return a};g.transform=h(["WebkitTransform"]),g.transition=h(["WebkitTransitionProperty"]),g.transform3d=i(),g.gv1=g.transform3d?"translate3d(":"translate(",g.gv2=g.transform3d?",0)":")",g.cssAnimation=(g.transform3d||g.transform)&&g.transition,g.isMobile=a.navigator.userAgent.match(/mobile/gi)?!0:!1;var j=!1,k=g.isMobile?"touch":"mouse",l={start:{touch:"touchstart",mouse:"mousedown"},move:{touch:"touchmove",mouse:"mousemove"},end:{touch:"touchend",mouse:"mouseup"}},m=function(a,b){return a.changedTouches?a.changedTouches[0][b]:a[b]};d.prototype.on=function(){var a=this;console.log(arguments);var b=arguments[0],c=arguments[1];return"beforeSwitch"==b&&c===!1?(a.switchCancel=!0,void(a.loop=!1)):void a.element.addEventListener.apply(a.element,arguments)},d.prototype.generate=function(a,c,d){var e,f=this;if("[object String]"!=Object.prototype.toString.call(a)||!b.querySelector(a))throw new Error("element selector should be a string and have exited");if(e=b.querySelector(a),"[object Array]"!==Object.prototype.toString.call(c))throw new Error("vm format error");f.vm=c,e.appendChild(f.root);var d=d||{},g=d.slient||!1;g&&f.asyncViewModel()},d.prototype.remove=function(){var a=this,c=b.createRange();c.setStartBefore(a.begin),c.setEndAfter(a.end),a.fromHtmlNode||0!=a.root.childNodes.length?a.fromHtmlNode&&a.root.appendChild(c.extractContents()):a.root.appendChild(c.extractContents())},d.prototype.content=function(a,d){var e=this,f=!1,d=d||{};if(!(11==a.nodeType&&0!=a.childNodes.length||"[object String]"==Object.prototype.toString.call(a)&&""!=a&&(f=!0)))throw new Error("illegal node type");if(e.fromHtmlNode||(e.fromHtmlNode=!0),f){var g=b.createDocumentFragment(),h=b.createElement("div");h.innerHTML=a;for(var i=h.childNodes,j=i.length,k=0;j>k;k++){var l=i[0];1==l.nodeType&&g.appendChild(l)}}e.element.appendChild(f?g:a),e.maxPoint=d.maxPoint||c,e.asyncViewModel()},d.prototype.asyncViewModel=function(){var a=this,d=a.dtnY?"Height":"Width";a.element.style.cssText="-webkit-backface-visibility:hidden;position:absolute;height:100%;top:0;left:0;";var e=0,f=0;if(a.fromHtmlNode){if(console.log("来源于已有节点创建"),!a.div.querySelector("li"))throw new Error("element of <li> not found");f=a["item"+d]||a.div.querySelector("li")["offset"+d]||a.div["offset"+d];for(var g=a.element.childNodes,h=0;h<g.length;h++)1==g[h].nodeType&&++e&&(a.dtnY?g[h].style.height=f+"px":g[h].style.float="left")}else{if(console.log("来源于脚本创建"),!a.vm)return;f=a["item"+d]||a.div["offset"+d],e=a.vm.length;for(var i=b.createDocumentFragment(),h=0;h<a.vm.length;h++){var j=a.vm[h],k=b.createElement("li");a.dtnY?k.style.height=f+"px":k.style.width=f+"px",a.dtnY||(k.style.float="left");var l=b.createElement("a");l.href=j.href;var m=new Image;a.dtnY?m.setAttribute("height",f):m.setAttribute("width",f),m.src=j.url,m.setAttribute("switch-data",j.attr),l.appendChild(m),k.appendChild(l),i.appendChild(k)}a.element.appendChild(i)}var n={};if(n[d]=e*f,a.loop&&n[d]>a.div["offset"+d]){var o=Math.ceil(a.div["offset"+d]/f),p=a.element.querySelectorAll("li"),q=b.createDocumentFragment();n["full"+d]=2*o*f+n[d];for(var h=0;o>h;h++)q.appendChild(p[h].cloneNode(!0));for(var r=0;o>r;r++){var s=p[p.length-1-r].cloneNode(!0);s.style.position="relative";var t=-(p.length+o+2*r+1)*f+"px";a.dtnY?s.style.top=t:s.style.left=t,q.appendChild(s)}a.element.appendChild(q),a.dtnY?a.element.style.height=n["full"+d]+"px":a.element.style.width=n["full"+d]+"px"}else a.loop=!1,a.dtnY?a.element.style.height=n[d]+"px":a.element.style.width=n[d]+"px";a.loop&&(a.maxPoint=c),a.maxPoint=0==a.maxPoint?a.maxPoint:a.maxPoint?a.maxPoint:e-1,a.distance=a.distance?a.distance:a.fromHtmlNode?function(){return 0==e?0:a.element["offset"+d]/(a.maxPoint+1+(a.loop?2*o:0))}():n[d]>a.div["offset"+d]?f:a.div["offset"+d],a.loop?console.log("distance and maxPoint",a.distance,a.maxPoint):(a.maxEdage=-a.distance*a.maxPoint,console.log("distance and maxPoint and maxEdage",a.distance,a.maxPoint,a.maxEdage))},d.prototype.gonext=function(){var a=this,b=!0,c=a.currentSelected,d=++c;return d>=a.maxPoint&&(d!=a.maxPoint&&(d=a.maxPoint,a.loop&&(a.edgeOfRight=!0)),a.loop||(b=!1)),a.currentSelected=d,b},d.prototype.gopre=function(){var a=this,b=!0,c=a.currentSelected,d=--c;return 0>=d&&(0!=d&&(d=0,a.loop&&(a.edgeOfLeft=!0)),a.loop||(b=!1)),a.currentSelected=d,b},d.prototype.handleEvent=function(a){var b=this;switch(a.type){case l.start.touch:p.apply(b,[a,"touch"]);break;case l.start.mouse:p.apply(b,[a,"mouse"]);break;case l.move.touch:q.apply(b,[a,"touch"]);break;case l.move.mouse:q.apply(b,[a,"mouse"]);break;case l.end.touch:r.apply(b,[a,"touch"]);break;case l.end.mouse:r.apply(b,[a,"mouse"])}};var n=function(a,c,d,e){var f=this,g=b.createEvent("Event");if(g.initEvent(a,c,d),e)for(var h in e)e.hasOwnProperty(h)&&(g[h]=e[h]);return f.element.dispatchEvent(g)},o=function(a){var b=this;if(b["current"+b.axisDtn]=a,g.cssAnimation){var c=b.dtnY?"0,"+a+"px":a+"px,0";b.element.style.cssText+="-webkit-transform:"+g.gv1+c+g.gv2}},p=function(a,d){var e=this;if(!j){e.animation&&e.animation.isPlaying&&e.animation.stop(),e.element.addEventListener(l.move[d],e,!1),b.addEventListener(l.end[d],e,!1);var f=a.target.tagName;"mouse"===d&&"SELECT"!==f&&"INPUT"!==f&&"TEXTAREA"!==f&&"BUTTON"!==f&&a.preventDefault(),e.startPageX=m(a,"pageX"),e.startPageY=m(a,"pageY"),e["basePage"+e.axisDtn]=e["startPage"+e.axisDtn],e.direction=0,e.sud=c,n.apply(e,["slidertouchstart",!0,!1])}},q=function(a){var b=this;if(!b.dtnY&&b.sud||b.dtnY&&"undefined"!=typeof b.sud&&!b.sud||j)return void console.log("认为是上下滑动，被返回,被return");var c={};if(c.pageX=m(a,"pageX"),c.pageY=m(a,"pageY"),"undefined"==typeof b.sud){var d=Math.abs(b.startPageX-c.pageX),e=Math.abs(b.startPageY-c.pageY);if(d>e){if(a.preventDefault(),b.sud=!1,b.dtnY)return}else{if(b.sud=!0,!b.dtnY)return;a.preventDefault()}}var f;f=c["page"+b.axisDtn]-b["basePage"+b.axisDtn];var g=b["current"+b.axisDtn]+f;!b.loop&&(g>0||g<b.maxEdage)&&(console.log("边界"),g=Math.round(b["current"+b.axisDtn]+f/3)),b.direction=0===f?b.direction:f>0?-1:1,n.apply(b,["slidertouchmove",!0,!0,{delta:g,direction:b.direction}]),b.position=g,b["basePage"+b.axisDtn]=c["page"+b.axisDtn]},r=function(a,c){var d=this;if(n.apply(d,["slidertouchend",!0,!1]),d.element.removeEventListener(l.move[c],d,!1),b.removeEventListener(l.end[c],d,!1),Math.abs(Math.round(d["current"+d.axisDtn]))==d.distance*(d.currentSelected||0))return void console.log("不管如何，只要位置偏移不改变就被return");var e=-d["current"+d.axisDtn]/d.distance;e=d.direction>0?Math.ceil(e):d.direction<0?Math.floor(e):Math.round(e),0>e?(e=0,d.loop&&(d.edgeOfLeft=!0)):e>d.maxPoint&&(e=d.maxPoint,d.loop&&(d.edgeOfRight=!0)),d.currentSelected=e},s=function(a){var b=this,c=e(.25,.1,.25,1),d=b.position,g=-b.distance*a;b.animation=new f(b,"position",function(a){var e=d+(g-d)*c(a/b.duration);return e},b.duration,d,g),n.apply(b,["beforeSwitch",!0,!0]),b.switchCancel&&b.position<0&&Math.abs(b.position)<=Math.abs(b.maxEdage)||b.animation.start()};"object"==typeof exports?module.exports=d:"function"==typeof define&&define.amd?define(function(){return d}):a.Switchable=d}(window,window.document);