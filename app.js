(()=>{"use strict";var e,t,n={697:(e,t,n)=>{n.r(t),n.d(t,{Application:()=>m,FormClassName:()=>c,LoadingElementClass:()=>u,NavIgnoreAttributeName:()=>f,NavUrlAttributeName:()=>p,NavUrlClassName:()=>d,NavUrlReplaceAttributeName:()=>_});var r,i=n(424),o=n(661),a=n(160),s=n(256),l=(r=function(e,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},r(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function __(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(__.prototype=t.prototype,new __)}),c="appform",u="loading",d="applink",p="data-nav-url",_="data-nav-replace",f="data-nav-ignore",m=function(e){function Application(t,n,r){var i=e.call(this)||this;i.__isInit=!1,i.__isLoad=!1,i.__isDestroy=!1,i._ctrlPressed=!1,i.__middlewares={},i.__middlewaresNames={},i.__loadingCounter=0,i.env=t,i.model=n,i.setElement(document.body);var o=new a.Middleware;return o.bind(i),i.__invoker=new s.MiddlewareInvoker(o),r&&r.length>0&&r.forEach((function(e){e.bind(i);var t=e.constructor.name.toLowerCase();if(t.endsWith("middleware")&&(t=t.substring(0,t.length-10)),i.__middlewares.hasOwnProperty(t))throw'Middleware "'.concat(t,'" already registered.');i.__middlewares[t]=e,i.__middlewaresNames[e.constructor.name]=t,i.__invoker.next(e)})),i}return l(Application,e),Object.defineProperty(Application.prototype,"typeName",{get:function(){return"Application"},enumerable:!1,configurable:!0}),Object.defineProperty(Application.prototype,"invoker",{get:function(){return this.__invoker},enumerable:!1,configurable:!0}),Application.prototype.middleware=function(e){var t=this.__middlewaresNames[e.name];if(!t)throw"Middleware ".concat(e.name," is not registered.");return this.__middlewares[t]},Application.prototype.start=function(e){var t=this;if(!this.__isInit){this.__isInit=!0,console.info("app starting"),window.addEventListener("click",this.__clickFunc=function(e){return t.__onClick(e)},!1),window.addEventListener("keydown",this.__keyDownUpFunc=function(e){return t.__onKeyDownUp(e)},!1),window.addEventListener("keyup",this.__keyDownUpFunc,!1),window.addEventListener("submit",this.__submitFunc=function(e){return t.__onSubmit(e)},!1);this.__invoker.invoke("start",{items:{}},(function(){console.info("app started"),e&&e(t)}))}},Application.prototype.load=function(e){var t=this;if(!this.__isInit)throw"Before executing the load method, you need to execute the init method.";if(!this.__isLoad){this.__isLoad=!0,console.info("app loading");this.__invoker.invoke("loaded",{items:{}},(function(){console.info("app loaded"),e&&e(t),t.endLoadingIndicator()}))}},Application.prototype.destroy=function(e){var t=this;if(!this.__isDestroy){this.__isDestroy=!0,console.info("app destroing"),window.removeEventListener("click",this.__clickFunc,!1),window.removeEventListener("keydown",this.__keyDownUpFunc,!1),window.removeEventListener("keyup",this.__keyDownUpFunc,!1),window.removeEventListener("submit",this.__submitFunc,!1);this.__invoker.invoke("stop",{items:{}},(function(){console.info("app stopped"),e&&e(t)}))}},Application.prototype.uri=function(e,t){var n=this.env.basePath;if(e&&(e.startsWith("/")&&(e=e.substring(1)),n+=e),t){var r="",i=0;for(var o in t){var a=t[o];null!=a&&(i>0&&(r+="&"),r+=encodeURIComponent(o),a&&(r+="="+encodeURIComponent(a)),i++)}r&&(n+="?"+r)}return n},Application.prototype.nav=function(e){var t=this,n=e.url,r=e.context,i=e.callback,a=e.replace;if(i||(i=function(){}),r||(r={}),n||(n=location.href),n.startsWith("http")){var s="".concat(location.protocol,"//").concat(location.host);if(!n.startsWith(s))return i({status:o.NavigationStatus.External,context:r}),void(location.href=n);n=n.substring(s.length)}var l=null,c=n.lastIndexOf("#");c>0&&(l=n.substring(c+1),n=n.substring(0,c),l.startsWith("#")&&(l=l.substring(1)));var u=null,d={},p=n.indexOf("?");p>0&&(u=n.substring(p+1),n=n.substring(0,p),new URLSearchParams(u).forEach((function(e,t){d[t]?d[t].push(e):d[t]=[e]})));var _=n,f=_;u&&(f+="?"+u),l&&(f+="#"+l);try{console.info("app navigate: ".concat(f)),this.beginLoadingIndicator();var m={items:{},url:f,path:_,query:u,queryParams:d,hash:l,replace:a,context:r};console.info(m),this.__invoker.invoke("navigate",m,(function(){i({status:o.NavigationStatus.Success,context:r}),t.endLoadingIndicator()}))}catch(e){console.error("navigation error"),console.error(e),i({status:o.NavigationStatus.Error,context:r}),this.endLoadingIndicator()}},Application.prototype.submit=function(e){var t=this,n=e.form,r=e.button,i=e.context,o=e.callback;if(n.classList.contains(u))return!1;n.classList.add(u),r&&r.classList.add(u),o||(o=function(){}),i||(i={}),i.formSubmit=n;var a=n.method,s=n.enctype,l=n.action?n.action:location.href;r&&(r.hasAttribute("formmethod")&&(a=r.formMethod),r.hasAttribute("formenctype")&&(s=r.formEnctype),r.hasAttribute("formaction")&&(l=r.formAction));var c=l.lastIndexOf("#");c>0&&(l=l.substring(0,c)),console.info("form sibmiting: ".concat(a.toUpperCase()," ").concat(l));var complexCallback=function(){n.classList.remove(u),r&&r.classList.remove(u),o({context:i}),t.endLoadingIndicator(),console.info("form sibmited")};if(this.beginLoadingIndicator(),"get"===a){var d=new FormData(n),p=new Array;d.forEach((function(e,t){p.push("".concat(encodeURIComponent(t),"=").concat(encodeURIComponent(e.toString())))}));var f=p.join("&");return f&&(-1===l.lastIndexOf("?")&&(l+="?"),l+=f),void this.nav({url:l,replace:n.hasAttribute(_),context:i,callback:complexCallback})}var m={form:n,button:r,method:a,enctype:s,url:l,items:{},context:i};this.__invoker.invoke("submit",m,complexCallback)},Application.prototype.reload=function(){this.nav({url:null,replace:!0})},Application.prototype.__onClick=function(e){for(var t=e.target,n=!1;t;){if(t.hasAttribute(f)){n=!0;break}if(t.classList&&t.classList.contains(d))break;if(t===e.currentTarget)return;if(!(t=void 0===t.parentElement?t.parentNode:t.parentElement))return!0}if(this._ctrlPressed)return!0;if(t.hasAttribute("target")&&"_blank"===t.getAttribute("target"))return!0;if(e.preventDefault(),e.stopPropagation(),n)return!1;var r=null;if("A"===t.tagName)r=t.getAttribute("href");else{if(!t.hasAttribute(p))throw"Не удалось получить Url адрес для перехода.";r=t.getAttribute(p)}return t.classList.contains(u)||(t.classList.add(u),this.nav({url:r,replace:t.hasAttribute(_),callback:function(){t.classList.remove(u)}})),!1},Application.prototype.__onKeyDownUp=function(e){this._ctrlPressed=e.ctrlKey},Application.prototype.__onSubmit=function(e){var t=e.target;t.classList.contains(c)&&(e.preventDefault(),this.submit({form:t,button:e.submitter instanceof HTMLButtonElement?e.submitter:null}))},Application.prototype.beginLoadingIndicator=function(){this.__loadingCounter++,document.body.classList.remove("bp-state-loaded"),document.body.classList.add("bp-state-loading")},Application.prototype.endLoadingIndicator=function(){this.__loadingCounter--,this.__loadingCounter<0&&(this.__loadingCounter=0),this.__loadingCounter<=0&&(document.body.classList.remove("bp-state-loading"),document.body.classList.add("bp-state-loaded"))},Application}(i.UIElement)},477:(e,t,n)=>{n.r(t),n.d(t,{ApplicationBuilder:()=>i});var r=n(697),i=function(){function ApplicationBuilder(){this.__middlewares=[],this.__appType=r.Application}return ApplicationBuilder.prototype.setAppType=function(e){return this.__appType=e,this},ApplicationBuilder.prototype.useMiddleware=function(e){if(!e)throw"Middleware propery is required.";return this.__middlewares.push(e),this},ApplicationBuilder.prototype.build=function(e,t){return new this.__appType(e,t,this.__middlewares)},ApplicationBuilder}()},661:(e,t,n)=>{var r;n.r(t),n.d(t,{NavigationStatus:()=>r}),function(e){e[e.Success=1]="Success",e[e.Cancelled=2]="Cancelled",e[e.Error=3]="Error",e[e.External=4]="External"}(r||(r={}))},578:(e,t,n)=>{n.r(t);var r=n(661),i={};for(const e in r)"default"!==e&&(i[e]=()=>r[e]);n.d(t,i);var o=n(477);i={};for(const e in o)"default"!==e&&(i[e]=()=>o[e]);n.d(t,i);var a=n(160);i={};for(const e in a)"default"!==e&&(i[e]=()=>a[e]);n.d(t,i);var s=n(697);i={};for(const e in s)"default"!==e&&(i[e]=()=>s[e]);n.d(t,i)},256:(e,t,n)=>{n.r(t),n.d(t,{MiddlewareInvoker:()=>r});var r=function(){function MiddlewareInvoker(e){this.middleware=e}return MiddlewareInvoker.prototype.next=function(e){this.__next?this.__next.next(e):this.__next=new MiddlewareInvoker(e)},MiddlewareInvoker.prototype.invoke=function(e,t,n){var r=this;n||(n=MiddlewareInvoker.emptyFunc);var i=this.__next?function(){r.__next.invoke(e,t,n)}:n;"function"==typeof this.middleware[e]?this.middleware[e](t,i,(function(){n()})):i()},MiddlewareInvoker.emptyFunc=function(){},MiddlewareInvoker}()},160:(e,t,n)=>{n.r(t),n.d(t,{Middleware:()=>r});var r=function(){function Middleware(){}return Object.defineProperty(Middleware.prototype,"app",{get:function(){return this._app},enumerable:!1,configurable:!0}),Middleware.prototype.bind=function(e){this._app=e},Middleware.prototype.start=function(e,t,n){t()},Middleware.prototype.loaded=function(e,t,n){t()},Middleware.prototype.navigate=function(e,t,n){t()},Middleware.prototype.submit=function(e,t,n){t()},Middleware.prototype.stop=function(e,t,n){t()},Middleware}()},131:(e,t,n)=>{n.r(t),n.d(t,{DOM:()=>r});var r=function(){function DOM(){}return DOM.getElementById=function(e){return document.getElementById(e)},DOM.getElementByClass=function(e,t){var n=e.getElementsByClassName(t);return 0===n.length?null:n.item(0)},DOM.getElementByName=function(e){var t=document.getElementsByName(e);return 0===t.length?null:t.item(0)},DOM.getElementByTagName=function(e,t){var n=e.getElementsByTagName(t);return 0===n.length?null:n.item(0)},DOM.getElementsByTagName=function(e,t){return e.getElementsByTagName(t)},DOM.queryElement=function(e,t){return e.querySelector(t)},DOM.queryElements=function(e,t){return e.querySelectorAll(t)},DOM.nextElementByClass=function(e,t){for(var n=e.nextSibling;n;){if(1===n.nodeType&&n.classList.contains(t))return n;n=n.nextSibling}return null},DOM.prevElementByClass=function(e,t){for(var n=e.previousSibling;n;){if(1===n.nodeType&&n.classList.contains(t))return n;n=n.previousSibling}return null},DOM.prevElement=function(e){for(var t=e.previousSibling;t;){if(1===t.nodeType)return t;t=t.previousSibling}return null},DOM.nextElement=function(e){for(var t=e.nextSibling;t;){if(1===t.nodeType)return t;t=t.nextSibling}return null},DOM.tag=function(e,t,n){var r=document.createElement(e);if(t)if("string"==typeof t)r.className=t;else for(var i in t){var o=t[i];switch(i){case"id":r.id=o;break;case"styles":for(var a in o)r.style[a]=o[a];break;case"class":if("string"==typeof o)r.className=o;else{if(!(o instanceof Array))throw"Invalid element class value.";for(var s=0;s<o.length;s++)r.classList.add(o[s])}break;case"command":r.dataset.command=o;break;case"dataset":for(var l in o)r.dataset[l]=o[l];break;case"events":for(var c in o)r.addEventListener(c,o[c]);break;default:"object"==typeof o?r.setAttribute(i,null!==o?JSON.stringify(o):""):"string"==typeof o?r.setAttribute(i,null!==o?o:""):r.setAttribute(i,null!==o?o.toString():"")}}if(n)if(n instanceof Element)r.insertAdjacentElement("beforeend",n);else if(n instanceof Array)for(var u=0;u<n.length;u++){var d=n[u];if(d instanceof Element)r.insertAdjacentElement("beforeend",d);else if("function"==typeof d){var p=d(r);p&&r.insertAdjacentElement("beforeend",p)}else"string"==typeof d&&r.insertAdjacentHTML("beforeend",d)}else if("string"==typeof n)r.innerHTML=n;else{if("function"!=typeof n)throw new Error;n(r)}return r},DOM.addClass=function(e,t,n){for(var r=e.querySelectorAll(t),i=0;i<r.length;i++)r.item(i).classList.add(n)},DOM.removeClass=function(e,t,n){for(var r=e.querySelectorAll(t),i=0;i<r.length;i++)r.item(i).classList.remove(n)},DOM.empty=function(e){for(;e.hasChildNodes();)e.removeChild(e.firstChild)},DOM}()},464:(e,t,n)=>{n.r(t),n.d(t,{CommandAttributeName:()=>a,CommandExecutingCssClassName:()=>s,CommandsExecStatus:()=>r,ElemAttributeName:()=>i,ElemPropertyName:()=>o,UIElement:()=>l});var r,i="uiElement",o="brandupUiElement",a="command",s="executing",l=function(){function UIElement(){this.__events={},this.__commandHandlers={}}return UIElement.hasElement=function(e){return!!e.dataset[i]},Object.defineProperty(UIElement.prototype,"element",{get:function(){return this.__element},enumerable:!1,configurable:!0}),UIElement.prototype.setElement=function(e){if(!e)throw"Not set value elem.";if(this.__element||UIElement.hasElement(e))throw"UIElement already defined";this.__element=e,this.__element[o]=this,this.__element.dataset[i]=this.typeName,this.defineEvent("command",{cancelable:!1,bubbles:!0}),this._onRenderElement(e)},UIElement.prototype.defineEvent=function(e,t){this.__events[e]=t||null},UIElement.prototype.raiseEvent=function(e,t){if(!(e in this.__events))throw'Not found event "'.concat(e,'".');var n=this.__events[e],r={};n&&(n.bubbles&&(r.bubbles=n.bubbles),n.cancelable&&(r.cancelable=n.cancelable),n.composed&&(r.composed=n.composed)),r.detail=t||null;var i=new CustomEvent(e,r);return this.dispatchEvent(i)},UIElement.prototype.addEventListener=function(e,t,n){this.__element.addEventListener(e,t,n)},UIElement.prototype.removeEventListener=function(e,t,n){this.__element.removeEventListener(e,t,n)},UIElement.prototype.dispatchEvent=function(e){return this.__element.dispatchEvent(e)},UIElement.prototype.registerCommand=function(e,t,n){void 0===n&&(n=null),e=this.verifyCommandName(e),this.__commandHandlers[e]={name:e,execute:t,canExecute:n,isExecuting:!1}},UIElement.prototype.registerAsyncCommand=function(e,t,n){void 0===n&&(n=null),e=this.verifyCommandName(e),this.__commandHandlers[e]={name:e,delegate:t,canExecute:n,isExecuting:!1}},UIElement.prototype.verifyCommandName=function(e){var t=e.toLowerCase();if(t in this.__commandHandlers)throw'Command "'.concat(e,'" already registered.');return t},UIElement.prototype.hasCommand=function(e){return e.toLowerCase()in this.__commandHandlers},UIElement.prototype.execCommand=function(e,t){var n=e.toLowerCase();if(!(n in this.__commandHandlers))throw'Command "'.concat(e,'" is not registered.');var i={target:t,uiElem:this,transparent:!1},o=this.__commandHandlers[n];if(o.isExecuting)return{result:r.AlreadyExecuting,context:i};if(o.isExecuting=!0,!this._onCanExecCommand(e,t))return o.isExecuting=!1,{result:r.NotAllow,context:i};if(o.canExecute&&!o.canExecute(t,i))return o.isExecuting=!1,{result:r.NotAllow,context:i};if(this.raiseEvent("command",{name:o.name,uiElem:this,elem:this.__element}),o.execute)try{o.execute(t,i)}finally{o.isExecuting=!1}else{t.classList.add(s);var a={target:t,uiElem:this,transparent:i.transparent,complate:null,timeout:3e4,timeoutCallback:null},endFunc_1=function(){o.isExecuting=!1,t.classList.remove(s)},l=null;a.complate=function(){clearTimeout(l),endFunc_1()},o.delegate(a),o.isExecuting&&(l=window.setTimeout((function(){a.timeoutCallback&&a.timeoutCallback(),endFunc_1()}),a.timeout)),i.transparent=a.transparent}return{result:r.Success,context:i}},UIElement.prototype._onRenderElement=function(e){},UIElement.prototype._onCanExecCommand=function(e,t){return!0},UIElement.prototype.destroy=function(){this.__element&&(delete this.__element.dataset[i],delete this.__element[o],this.__element=null)},UIElement}();!function(e){e[e.NotAllow=1]="NotAllow",e[e.AlreadyExecuting=2]="AlreadyExecuting",e[e.Success=3]="Success"}(r||(r={}));window.addEventListener("click",(function(e){for(var t=e.target;t&&!t.dataset[a];){if(t===e.currentTarget)return;t=void 0===t.parentElement?t.parentNode:t.parentElement}if(t){var n=t.dataset[a],r=function(e,t){for(;e;){if(e.dataset[i]){var n=e[o];if(n.hasCommand(t))return n}e=void 0===e.parentElement?e.parentNode:e.parentElement}return null}(t,n);if(null===r)console.warn('Not find handler for command "'.concat(n,'".'));else if(r.execCommand(n,t).context.transparent)return;e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation()}}),!1)},51:(e,t,n)=>{n.r(t);var r=n(131),i={};for(const e in r)"default"!==e&&(i[e]=()=>r[e]);n.d(t,i)},424:(e,t,n)=>{n.r(t);var r=n(464),i={};for(const e in r)"default"!==e&&(i[e]=()=>r[e]);n.d(t,i)},921:(e,t,n)=>{n.r(t),n.d(t,{PagesMiddleware:()=>s});var r,i=n(578),o=n(51),a=(r=function(e,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},r(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function __(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(__.prototype=t.prototype,new __)}),s=function(e){function PagesMiddleware(){var t=null!==e&&e.apply(this,arguments)||this;return t._page=null,t}return a(PagesMiddleware,e),PagesMiddleware.prototype.start=function(t,r,i){if(this._appContentElem=document.getElementById("app-content"),!this._appContentElem)throw new Error("Not found page content container.");this._pages={support:{type:function(){return Promise.all([n.e(305),n.e(683)]).then(n.bind(n,683))},title:"Support page"},statistics:{type:function(){return n.e(37).then(n.bind(n,37))},title:"Statistics page"},default:{type:function(){return Promise.all([n.e(305),n.e(683)]).then(n.bind(n,683))},title:"Support page"}},e.prototype.start.call(this,t,r,i)},PagesMiddleware.prototype.loaded=function(t,n,r){e.prototype.loaded.call(this,t,n,r)},PagesMiddleware.prototype.navigate=function(t,n,r){var i=this;this._page&&(this._page.destroy(),this._page=null);var a=t.queryParams.page?t.queryParams.page[0]:"default",s=this._pages[a];if(!s)return this._nav(t,"Page not found"),o.DOM.empty(this._appContentElem),this._appContentElem.innerText="Page not found",void r();this._nav(t,s.title),s.type().then((function(a){o.DOM.empty(i._appContentElem);var s=document.createDocumentFragment(),l=o.DOM.tag("div","page");s.appendChild(l),i._page=new a.default(i.app,l),i._appContentElem.appendChild(s),e.prototype.navigate.call(i,t,n,r)})).catch((function(e){console.error(e),r()}))},PagesMiddleware.prototype._nav=function(e,t){document.title=t},PagesMiddleware}(i.Middleware)}},r={};function __webpack_require__(e){var t=r[e];if(void 0!==t)return t.exports;var i=r[e]={exports:{}};return n[e](i,i.exports,__webpack_require__),i.exports}__webpack_require__.m=n,__webpack_require__.d=(e,t)=>{for(var n in t)__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__webpack_require__.f={},__webpack_require__.e=e=>Promise.all(Object.keys(__webpack_require__.f).reduce(((t,n)=>(__webpack_require__.f[n](e,t),t)),[])),__webpack_require__.u=e=>e+"."+{37:"6f30e89392d0a15e213e",305:"10455ca6e794df823ddd",683:"320f4bfecee3fe94b375"}[e]+".js",__webpack_require__.miniCssF=e=>{},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="tgapp:",__webpack_require__.l=(n,r,i,o)=>{if(e[n])e[n].push(r);else{var a,s;if(void 0!==i)for(var l=document.getElementsByTagName("script"),c=0;c<l.length;c++){var u=l[c];if(u.getAttribute("src")==n||u.getAttribute("data-webpack")==t+i){a=u;break}}a||(s=!0,(a=document.createElement("script")).charset="utf-8",a.timeout=120,__webpack_require__.nc&&a.setAttribute("nonce",__webpack_require__.nc),a.setAttribute("data-webpack",t+i),a.src=n),e[n]=[r];var onScriptComplete=(t,r)=>{a.onerror=a.onload=null,clearTimeout(d);var i=e[n];if(delete e[n],a.parentNode&&a.parentNode.removeChild(a),i&&i.forEach((e=>e(r))),t)return t(r)},d=setTimeout(onScriptComplete.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=onScriptComplete.bind(null,a.onerror),a.onload=onScriptComplete.bind(null,a.onload),s&&document.head.appendChild(a)}},__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.p="/dist_tgapp/",(()=>{var e={524:0};__webpack_require__.f.j=(t,n)=>{var r=__webpack_require__.o(e,t)?e[t]:void 0;if(0!==r)if(r)n.push(r[2]);else{var i=new Promise(((n,i)=>r=e[t]=[n,i]));n.push(r[2]=i);var o=__webpack_require__.p+__webpack_require__.u(t),a=new Error;__webpack_require__.l(o,(n=>{if(__webpack_require__.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var i=n&&("load"===n.type?"missing":n.type),o=n&&n.target&&n.target.src;a.message="Loading chunk "+t+" failed.\n("+i+": "+o+")",a.name="ChunkLoadError",a.type=i,a.request=o,r[1](a)}}),"chunk-"+t,t)}};var webpackJsonpCallback=(t,n)=>{var r,i,[o,a,s]=n,l=0;if(o.some((t=>0!==e[t]))){for(r in a)__webpack_require__.o(a,r)&&(__webpack_require__.m[r]=a[r]);if(s)s(__webpack_require__)}for(t&&t(n);l<o.length;l++)i=o[l],__webpack_require__.o(e,i)&&e[i]&&e[i][0](),e[i]=0},t=self.webpackChunktgapp=self.webpackChunktgapp||[];t.forEach(webpackJsonpCallback.bind(null,0)),t.push=webpackJsonpCallback.bind(null,t.push.bind(t))})();__webpack_require__.r({});var i=__webpack_require__(578),o=__webpack_require__(921),a=new i.ApplicationBuilder;a.useMiddleware(new o.PagesMiddleware);var s=a.build({basePath:"/"},{});s.start((function(){console.log("app start callback")})),s.load((function(){console.log("app load callback")})),s.nav({url:null,replace:!0})})();
