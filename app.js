/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 697:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Application: () => (/* binding */ Application),
/* harmony export */   FormClassName: () => (/* binding */ FormClassName),
/* harmony export */   LoadingElementClass: () => (/* binding */ LoadingElementClass),
/* harmony export */   NavIgnoreAttributeName: () => (/* binding */ NavIgnoreAttributeName),
/* harmony export */   NavUrlAttributeName: () => (/* binding */ NavUrlAttributeName),
/* harmony export */   NavUrlClassName: () => (/* binding */ NavUrlClassName),
/* harmony export */   NavUrlReplaceAttributeName: () => (/* binding */ NavUrlReplaceAttributeName)
/* harmony export */ });
/* harmony import */ var brandup_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(424);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(661);
/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(160);
/* harmony import */ var _invoker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(256);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var FormClassName = "appform";
var LoadingElementClass = "loading";
var NavUrlClassName = "applink";
var NavUrlAttributeName = "data-nav-url";
var NavUrlReplaceAttributeName = "data-nav-replace";
var NavIgnoreAttributeName = "data-nav-ignore";
var Application = /** @class */ (function (_super) {
    __extends(Application, _super);
    function Application(env, model, middlewares) {
        var _this = _super.call(this) || this;
        _this.__isInit = false;
        _this.__isLoad = false;
        _this.__isDestroy = false;
        _this._ctrlPressed = false;
        _this.__middlewares = {};
        _this.__middlewaresNames = {};
        _this.__loadingCounter = 0;
        _this.env = env;
        _this.model = model;
        _this.setElement(document.body);
        var core = new _middleware__WEBPACK_IMPORTED_MODULE_2__.Middleware();
        core.bind(_this);
        _this.__invoker = new _invoker__WEBPACK_IMPORTED_MODULE_3__.MiddlewareInvoker(core);
        if (middlewares && middlewares.length > 0) {
            middlewares.forEach(function (m) {
                m.bind(_this);
                var name = m.constructor.name.toLowerCase();
                if (name.endsWith("middleware"))
                    name = name.substring(0, name.length - "middleware".length);
                if (_this.__middlewares.hasOwnProperty(name))
                    throw "Middleware \"".concat(name, "\" already registered.");
                _this.__middlewares[name] = m;
                _this.__middlewaresNames[m.constructor.name] = name;
                _this.__invoker.next(m);
            });
        }
        return _this;
    }
    Object.defineProperty(Application.prototype, "typeName", {
        get: function () { return "Application"; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Application.prototype, "invoker", {
        get: function () { return this.__invoker; },
        enumerable: false,
        configurable: true
    });
    Application.prototype.middleware = function (c) {
        var name = this.__middlewaresNames[c.name];
        if (!name)
            throw "Middleware ".concat(c.name, " is not registered.");
        return this.__middlewares[name];
    };
    Application.prototype.start = function (callback) {
        var _this = this;
        if (this.__isInit)
            return;
        this.__isInit = true;
        console.info("app starting");
        window.addEventListener("click", this.__clickFunc = function (e) { return _this.__onClick(e); }, false);
        window.addEventListener("keydown", this.__keyDownUpFunc = function (e) { return _this.__onKeyDownUp(e); }, false);
        window.addEventListener("keyup", this.__keyDownUpFunc, false);
        window.addEventListener("submit", this.__submitFunc = function (e) { return _this.__onSubmit(e); }, false);
        var context = {
            items: {}
        };
        this.__invoker.invoke("start", context, function () {
            console.info("app started");
            if (callback)
                callback(_this);
        });
    };
    Application.prototype.load = function (callback) {
        var _this = this;
        if (!this.__isInit)
            throw "Before executing the load method, you need to execute the init method.";
        if (this.__isLoad)
            return;
        this.__isLoad = true;
        console.info("app loading");
        var context = {
            items: {}
        };
        this.__invoker.invoke("loaded", context, function () {
            console.info("app loaded");
            if (callback)
                callback(_this);
            _this.endLoadingIndicator();
        });
    };
    Application.prototype.destroy = function (callback) {
        var _this = this;
        if (this.__isDestroy)
            return;
        this.__isDestroy = true;
        console.info("app destroing");
        window.removeEventListener("click", this.__clickFunc, false);
        window.removeEventListener("keydown", this.__keyDownUpFunc, false);
        window.removeEventListener("keyup", this.__keyDownUpFunc, false);
        window.removeEventListener("submit", this.__submitFunc, false);
        var context = {
            items: {}
        };
        this.__invoker.invoke("stop", context, function () {
            console.info("app stopped");
            if (callback)
                callback(_this);
        });
    };
    Application.prototype.uri = function (path, queryParams) {
        var url = this.env.basePath;
        if (path) {
            if (path.startsWith("/"))
                path = path.substring(1);
            url += path;
        }
        if (queryParams) {
            var query = "";
            var i = 0;
            for (var key in queryParams) {
                var value = queryParams[key];
                if (value === null || typeof value === "undefined")
                    continue;
                if (i > 0)
                    query += "&";
                query += encodeURIComponent(key);
                if (value)
                    query += "=" + encodeURIComponent(value);
                i++;
            }
            if (query)
                url += "?" + query;
        }
        return url;
    };
    Application.prototype.nav = function (options) {
        var _this = this;
        var url = options.url, context = options.context, callback = options.callback;
        var replace = options.replace;
        if (!callback)
            callback = function () { return; };
        if (!context)
            context = {};
        if (!url)
            url = location.href;
        if (url.startsWith("http")) {
            // Если адрес абсолютный
            var currentBaseUrl = "".concat(location.protocol, "//").concat(location.host);
            if (!url.startsWith(currentBaseUrl)) {
                // Если домен и протокол отличается от текущего, то перезагружаем страницу
                callback({ status: _common__WEBPACK_IMPORTED_MODULE_1__.NavigationStatus.External, context: context });
                location.href = url;
                return;
            }
            url = url.substring(currentBaseUrl.length);
        }
        // Вытаскиваем хеш
        var hash = null;
        var hashIndex = url.lastIndexOf("#");
        if (hashIndex > 0) {
            hash = url.substring(hashIndex + 1);
            url = url.substring(0, hashIndex);
            if (hash.startsWith("#"))
                hash = hash.substring(1);
        }
        // Вытаскиваем параметры
        var query = null;
        var queryParams = {};
        var qyeryIndex = url.indexOf("?");
        if (qyeryIndex > 0) {
            query = url.substring(qyeryIndex + 1);
            url = url.substring(0, qyeryIndex);
            var q = new URLSearchParams(query);
            q.forEach(function (v, k) {
                if (!queryParams[k])
                    queryParams[k] = [v];
                else
                    queryParams[k].push(v);
            });
        }
        // Вытаскиваем путь
        var path = url;
        // Собираем полный адрес без домена
        var fullUrl = path;
        if (query)
            fullUrl += "?" + query;
        if (hash)
            fullUrl += "#" + hash;
        try {
            console.info("app navigate: ".concat(fullUrl));
            this.beginLoadingIndicator();
            var navContext = {
                items: {},
                url: fullUrl,
                path: path,
                query: query,
                queryParams: queryParams,
                hash: hash,
                replace: replace,
                context: context
            };
            console.info(navContext);
            this.__invoker.invoke("navigate", navContext, function () {
                callback({ status: _common__WEBPACK_IMPORTED_MODULE_1__.NavigationStatus.Success, context: context });
                _this.endLoadingIndicator();
            });
        }
        catch (e) {
            console.error("navigation error");
            console.error(e);
            callback({ status: _common__WEBPACK_IMPORTED_MODULE_1__.NavigationStatus.Error, context: context });
            this.endLoadingIndicator();
        }
    };
    Application.prototype.submit = function (options) {
        var _this = this;
        var form = options.form, button = options.button;
        var context = options.context, callback = options.callback;
        if (form.classList.contains(LoadingElementClass))
            return false;
        form.classList.add(LoadingElementClass);
        if (button)
            button.classList.add(LoadingElementClass);
        if (!callback)
            callback = function () { return; };
        if (!context)
            context = {};
        context["formSubmit"] = form;
        var method = form.method;
        var enctype = form.enctype;
        var url = form.action ? form.action : location.href;
        if (button) {
            // Если отправка с кнопки, то берём её параметры
            if (button.hasAttribute("formmethod"))
                method = button.formMethod;
            if (button.hasAttribute("formenctype"))
                enctype = button.formEnctype;
            if (button.hasAttribute("formaction"))
                url = button.formAction;
        }
        var urlHashIndex = url.lastIndexOf("#");
        if (urlHashIndex > 0)
            url = url.substring(0, urlHashIndex);
        console.info("form sibmiting: ".concat(method.toUpperCase(), " ").concat(url));
        var complexCallback = function () {
            form.classList.remove(LoadingElementClass);
            if (button)
                button.classList.remove(LoadingElementClass);
            callback({ context: context });
            _this.endLoadingIndicator();
            console.info("form sibmited");
        };
        this.beginLoadingIndicator();
        if (method === "get") {
            var formData = new FormData(form);
            var p_1 = new Array();
            formData.forEach(function (v, k) { p_1.push("".concat(encodeURIComponent(k), "=").concat(encodeURIComponent(v.toString()))); });
            var queryParams = p_1.join('&');
            if (queryParams) {
                if (url.lastIndexOf("?") === -1)
                    url += "?";
                url += queryParams;
            }
            this.nav({
                url: url,
                replace: form.hasAttribute(NavUrlReplaceAttributeName),
                context: context,
                callback: complexCallback
            });
            return;
        }
        var submitContext = {
            form: form,
            button: button,
            method: method,
            enctype: enctype,
            url: url,
            items: {},
            context: context
        };
        this.__invoker.invoke("submit", submitContext, complexCallback);
    };
    Application.prototype.reload = function () {
        this.nav({ url: null, replace: true });
    };
    Application.prototype.__onClick = function (e) {
        var elem = e.target;
        var ignore = false;
        while (elem) {
            if (elem.hasAttribute(NavIgnoreAttributeName)) {
                ignore = true;
                break;
            }
            if (elem.classList && elem.classList.contains(NavUrlClassName))
                break;
            if (elem === e.currentTarget)
                return;
            if (typeof elem.parentElement === "undefined")
                elem = elem.parentNode;
            else
                elem = elem.parentElement;
            if (!elem)
                return true;
        }
        if (this._ctrlPressed)
            return true;
        if (elem.hasAttribute("target")) {
            if (elem.getAttribute("target") === "_blank")
                return true;
        }
        e.preventDefault();
        e.stopPropagation();
        if (ignore)
            return false;
        var url = null;
        if (elem.tagName === "A")
            url = elem.getAttribute("href");
        else if (elem.hasAttribute(NavUrlAttributeName))
            url = elem.getAttribute(NavUrlAttributeName);
        else
            throw "Не удалось получить Url адрес для перехода.";
        if (elem.classList.contains(LoadingElementClass))
            return false;
        elem.classList.add(LoadingElementClass);
        this.nav({
            url: url,
            replace: elem.hasAttribute(NavUrlReplaceAttributeName),
            callback: function () { elem.classList.remove(LoadingElementClass); }
        });
        return false;
    };
    Application.prototype.__onKeyDownUp = function (e) {
        this._ctrlPressed = e.ctrlKey;
    };
    Application.prototype.__onSubmit = function (e) {
        var form = e.target;
        if (!form.classList.contains(FormClassName))
            return;
        e.preventDefault();
        this.submit({
            form: form,
            button: e.submitter instanceof HTMLButtonElement ? e.submitter : null
        });
    };
    Application.prototype.beginLoadingIndicator = function () {
        this.__loadingCounter++;
        document.body.classList.remove("bp-state-loaded");
        document.body.classList.add("bp-state-loading");
    };
    Application.prototype.endLoadingIndicator = function () {
        this.__loadingCounter--;
        if (this.__loadingCounter < 0)
            this.__loadingCounter = 0;
        if (this.__loadingCounter <= 0) {
            document.body.classList.remove("bp-state-loading");
            document.body.classList.add("bp-state-loaded");
        }
    };
    return Application;
}(brandup_ui__WEBPACK_IMPORTED_MODULE_0__.UIElement));



/***/ }),

/***/ 477:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApplicationBuilder: () => (/* binding */ ApplicationBuilder)
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(697);

var ApplicationBuilder = /** @class */ (function () {
    function ApplicationBuilder() {
        this.__middlewares = [];
        this.__appType = _app__WEBPACK_IMPORTED_MODULE_0__.Application;
    }
    ApplicationBuilder.prototype.setAppType = function (appType) {
        this.__appType = appType;
        return this;
    };
    ApplicationBuilder.prototype.useMiddleware = function (middleware) {
        if (!middleware)
            throw "Middleware propery is required.";
        this.__middlewares.push(middleware);
        return this;
    };
    ApplicationBuilder.prototype.build = function (env, model) {
        return new this.__appType(env, model, this.__middlewares);
    };
    return ApplicationBuilder;
}());



/***/ }),

/***/ 661:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationStatus: () => (/* binding */ NavigationStatus)
/* harmony export */ });
var NavigationStatus;
(function (NavigationStatus) {
    NavigationStatus[NavigationStatus["Success"] = 1] = "Success";
    NavigationStatus[NavigationStatus["Cancelled"] = 2] = "Cancelled";
    NavigationStatus[NavigationStatus["Error"] = 3] = "Error";
    NavigationStatus[NavigationStatus["External"] = 4] = "External";
})(NavigationStatus || (NavigationStatus = {}));


/***/ }),

/***/ 578:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(661);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _common__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _common__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _builder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(477);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _builder__WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _builder__WEBPACK_IMPORTED_MODULE_1__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(160);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _middleware__WEBPACK_IMPORTED_MODULE_2__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _middleware__WEBPACK_IMPORTED_MODULE_2__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(697);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _app__WEBPACK_IMPORTED_MODULE_3__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _app__WEBPACK_IMPORTED_MODULE_3__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);






/***/ }),

/***/ 256:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MiddlewareInvoker: () => (/* binding */ MiddlewareInvoker)
/* harmony export */ });
var MiddlewareInvoker = /** @class */ (function () {
    function MiddlewareInvoker(middleware) {
        this.middleware = middleware;
    }
    MiddlewareInvoker.prototype.next = function (middleware) {
        if (this.__next) {
            this.__next.next(middleware);
            return;
        }
        this.__next = new MiddlewareInvoker(middleware);
    };
    MiddlewareInvoker.prototype.invoke = function (method, context, callback) {
        var _this = this;
        if (!callback)
            callback = MiddlewareInvoker.emptyFunc;
        var nextFunc = this.__next ? function () { _this.__next.invoke(method, context, callback); } : callback;
        var endFunc = function () { callback(); };
        if (typeof this.middleware[method] === "function")
            this.middleware[method](context, nextFunc, endFunc);
        else
            nextFunc();
    };
    MiddlewareInvoker.emptyFunc = function () { return; };
    return MiddlewareInvoker;
}());



/***/ }),

/***/ 160:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Middleware: () => (/* binding */ Middleware)
/* harmony export */ });
var Middleware = /** @class */ (function () {
    function Middleware() {
    }
    Object.defineProperty(Middleware.prototype, "app", {
        get: function () { return this._app; },
        enumerable: false,
        configurable: true
    });
    Middleware.prototype.bind = function (app) {
        this._app = app;
    };
    Middleware.prototype.start = function (context, next, end) {
        next();
    };
    Middleware.prototype.loaded = function (context, next, end) {
        next();
    };
    Middleware.prototype.navigate = function (context, next, end) {
        next();
    };
    Middleware.prototype.submit = function (context, next, end) {
        next();
    };
    Middleware.prototype.stop = function (context, next, end) {
        next();
    };
    return Middleware;
}());



/***/ }),

/***/ 131:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOM: () => (/* binding */ DOM)
/* harmony export */ });
var DOM = /** @class */ (function () {
    function DOM() {
    }
    DOM.getElementById = function (id) {
        return document.getElementById(id);
    };
    DOM.getElementByClass = function (parentElement, className) {
        var elements = parentElement.getElementsByClassName(className);
        if (elements.length === 0)
            return null;
        return elements.item(0);
    };
    DOM.getElementByName = function (name) {
        var elements = document.getElementsByName(name);
        if (elements.length === 0)
            return null;
        return elements.item(0);
    };
    DOM.getElementByTagName = function (parentElement, tagName) {
        var elements = parentElement.getElementsByTagName(tagName);
        if (elements.length === 0)
            return null;
        return elements.item(0);
    };
    DOM.getElementsByTagName = function (parentElement, tagName) {
        return parentElement.getElementsByTagName(tagName);
    };
    DOM.queryElement = function (parentElement, query) {
        return parentElement.querySelector(query);
    };
    DOM.queryElements = function (parentElement, query) {
        return parentElement.querySelectorAll(query);
    };
    DOM.nextElementByClass = function (currentElement, className) {
        var n = currentElement.nextSibling;
        while (n) {
            if (n.nodeType === 1) {
                if (n.classList.contains(className))
                    return n;
            }
            n = n.nextSibling;
        }
        return null;
    };
    DOM.prevElementByClass = function (currentElement, className) {
        var n = currentElement.previousSibling;
        while (n) {
            if (n.nodeType === 1) {
                if (n.classList.contains(className))
                    return n;
            }
            n = n.previousSibling;
        }
        return null;
    };
    DOM.prevElement = function (currentElement) {
        var n = currentElement.previousSibling;
        while (n) {
            if (n.nodeType === 1) {
                return n;
            }
            n = n.previousSibling;
        }
        return null;
    };
    DOM.nextElement = function (currentElement) {
        var n = currentElement.nextSibling;
        while (n) {
            if (n.nodeType === 1) {
                return n;
            }
            n = n.nextSibling;
        }
        return null;
    };
    DOM.tag = function (tagName, options, children) {
        var elem = document.createElement(tagName);
        if (options) {
            if (typeof options === "string") {
                elem.className = options;
            }
            else {
                for (var key in options) {
                    var value = options[key];
                    switch (key) {
                        case "id": {
                            elem.id = value;
                            break;
                        }
                        case "styles": {
                            for (var sKey in value) {
                                elem.style[sKey] = value[sKey];
                            }
                            break;
                        }
                        case "class": {
                            if (typeof value === "string")
                                elem.className = value;
                            else if (value instanceof Array) {
                                for (var iClass = 0; iClass < value.length; iClass++) {
                                    elem.classList.add(value[iClass]);
                                }
                            }
                            else
                                throw "Invalid element class value.";
                            break;
                        }
                        case "command": {
                            elem.dataset["command"] = value;
                            break;
                        }
                        case "dataset": {
                            for (var dataName in value) {
                                elem.dataset[dataName] = value[dataName];
                            }
                            break;
                        }
                        case "events": {
                            for (var eventName in value) {
                                elem.addEventListener(eventName, value[eventName]);
                            }
                            break;
                        }
                        default: {
                            if (typeof value === "object") {
                                elem.setAttribute(key, value !== null ? JSON.stringify(value) : "");
                            }
                            else if (typeof value === "string") {
                                elem.setAttribute(key, value !== null ? value : "");
                            }
                            else {
                                elem.setAttribute(key, value !== null ? value.toString() : "");
                            }
                            break;
                        }
                    }
                }
            }
        }
        if (children) {
            if (children instanceof Element) {
                elem.insertAdjacentElement("beforeend", children);
            }
            else if (children instanceof Array) {
                for (var i = 0; i < children.length; i++) {
                    var chd = children[i];
                    if (chd instanceof Element)
                        elem.insertAdjacentElement("beforeend", chd);
                    else if (typeof chd === "function") {
                        var chdElem = chd(elem);
                        if (chdElem)
                            elem.insertAdjacentElement("beforeend", chdElem);
                    }
                    else if (typeof chd === "string") {
                        elem.insertAdjacentHTML("beforeend", chd);
                    }
                }
            }
            else if (typeof children === "string") {
                elem.innerHTML = children;
            }
            else if (typeof children === "function") {
                children(elem);
            }
            else
                throw new Error();
        }
        return elem;
    };
    DOM.addClass = function (container, selectors, className) {
        var nodes = container.querySelectorAll(selectors);
        for (var i = 0; i < nodes.length; i++) {
            nodes.item(i).classList.add(className);
        }
    };
    DOM.removeClass = function (container, selectors, className) {
        var nodes = container.querySelectorAll(selectors);
        for (var i = 0; i < nodes.length; i++) {
            nodes.item(i).classList.remove(className);
        }
    };
    DOM.empty = function (element) {
        while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
        }
    };
    return DOM;
}());



/***/ }),

/***/ 464:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommandAttributeName: () => (/* binding */ CommandAttributeName),
/* harmony export */   CommandExecutingCssClassName: () => (/* binding */ CommandExecutingCssClassName),
/* harmony export */   CommandsExecStatus: () => (/* binding */ CommandsExecStatus),
/* harmony export */   ElemAttributeName: () => (/* binding */ ElemAttributeName),
/* harmony export */   ElemPropertyName: () => (/* binding */ ElemPropertyName),
/* harmony export */   UIElement: () => (/* binding */ UIElement)
/* harmony export */ });
var ElemAttributeName = "uiElement";
var ElemPropertyName = "brandupUiElement";
var CommandAttributeName = "command";
var CommandExecutingCssClassName = "executing";
var UIElement = /** @class */ (function () {
    function UIElement() {
        this.__events = {};
        this.__commandHandlers = {};
    }
    UIElement.hasElement = function (elem) {
        return !!elem.dataset[ElemAttributeName];
    };
    Object.defineProperty(UIElement.prototype, "element", {
        get: function () { return this.__element; },
        enumerable: false,
        configurable: true
    });
    UIElement.prototype.setElement = function (elem) {
        if (!elem)
            throw "Not set value elem.";
        if (this.__element || UIElement.hasElement(elem))
            throw "UIElement already defined";
        this.__element = elem;
        this.__element[ElemPropertyName] = this;
        this.__element.dataset[ElemAttributeName] = this.typeName;
        this.defineEvent("command", { cancelable: false, bubbles: true });
        this._onRenderElement(elem);
    };
    // HTMLElement Events
    UIElement.prototype.defineEvent = function (eventName, eventOptions) {
        this.__events[eventName] = eventOptions ? eventOptions : null;
    };
    UIElement.prototype.raiseEvent = function (eventName, eventArgs) {
        if (!(eventName in this.__events))
            throw "Not found event \"".concat(eventName, "\".");
        var eventOptions = this.__events[eventName];
        var eventInit = {};
        if (eventOptions) {
            if (eventOptions.bubbles)
                eventInit.bubbles = eventOptions.bubbles;
            if (eventOptions.cancelable)
                eventInit.cancelable = eventOptions.cancelable;
            if (eventOptions.composed)
                eventInit.composed = eventOptions.composed;
        }
        eventInit.detail = eventArgs ? eventArgs : null;
        var event = new CustomEvent(eventName, eventInit);
        return this.dispatchEvent(event);
    };
    UIElement.prototype.addEventListener = function (type, listener, options) {
        this.__element.addEventListener(type, listener, options);
    };
    UIElement.prototype.removeEventListener = function (type, listener, options) {
        this.__element.removeEventListener(type, listener, options);
    };
    UIElement.prototype.dispatchEvent = function (event) {
        return this.__element.dispatchEvent(event);
    };
    // Commands
    UIElement.prototype.registerCommand = function (name, execute, canExecute) {
        if (canExecute === void 0) { canExecute = null; }
        name = this.verifyCommandName(name);
        this.__commandHandlers[name] = {
            name: name,
            execute: execute,
            canExecute: canExecute,
            isExecuting: false
        };
    };
    UIElement.prototype.registerAsyncCommand = function (name, delegate, canExecute) {
        if (canExecute === void 0) { canExecute = null; }
        name = this.verifyCommandName(name);
        this.__commandHandlers[name] = {
            name: name,
            delegate: delegate,
            canExecute: canExecute,
            isExecuting: false
        };
    };
    UIElement.prototype.verifyCommandName = function (name) {
        var key = name.toLowerCase();
        if (key in this.__commandHandlers)
            throw "Command \"".concat(name, "\" already registered.");
        return key;
    };
    UIElement.prototype.hasCommand = function (name) {
        return name.toLowerCase() in this.__commandHandlers;
    };
    UIElement.prototype.execCommand = function (name, elem) {
        var key = name.toLowerCase();
        if (!(key in this.__commandHandlers))
            throw "Command \"".concat(name, "\" is not registered.");
        var context = {
            target: elem,
            uiElem: this,
            transparent: false
        };
        var handler = this.__commandHandlers[key];
        if (handler.isExecuting)
            return { result: CommandsExecStatus.AlreadyExecuting, context: context };
        handler.isExecuting = true;
        if (!this._onCanExecCommand(name, elem)) {
            handler.isExecuting = false;
            return { result: CommandsExecStatus.NotAllow, context: context };
        }
        if (handler.canExecute && !handler.canExecute(elem, context)) {
            handler.isExecuting = false;
            return { result: CommandsExecStatus.NotAllow, context: context };
        }
        this.raiseEvent("command", {
            name: handler.name,
            uiElem: this,
            elem: this.__element
        });
        if (handler.execute) {
            // Если команда синхронная.
            try {
                handler.execute(elem, context);
            }
            finally {
                handler.isExecuting = false;
            }
        }
        else {
            // Если команда асинхронная.
            elem.classList.add(CommandExecutingCssClassName);
            var asyncContext_1 = {
                target: elem,
                uiElem: this,
                transparent: context.transparent,
                complate: null,
                timeout: 30000,
                timeoutCallback: null
            };
            var endFunc_1 = function () {
                handler.isExecuting = false;
                elem.classList.remove(CommandExecutingCssClassName);
            };
            var timeoutId_1 = null;
            asyncContext_1.complate = function () {
                clearTimeout(timeoutId_1);
                endFunc_1();
            };
            handler.delegate(asyncContext_1);
            if (handler.isExecuting) {
                timeoutId_1 = window.setTimeout(function () {
                    if (asyncContext_1.timeoutCallback)
                        asyncContext_1.timeoutCallback();
                    endFunc_1();
                }, asyncContext_1.timeout);
            }
            context.transparent = asyncContext_1.transparent;
        }
        return { result: CommandsExecStatus.Success, context: context };
    };
    UIElement.prototype._onRenderElement = function (_elem) {
        return;
    };
    UIElement.prototype._onCanExecCommand = function (_name, _elem) {
        return true;
    };
    UIElement.prototype.destroy = function () {
        if (this.__element) {
            //this.__element.removeAttribute(ElemAttributeName);
            delete this.__element.dataset[ElemAttributeName];
            delete this.__element[ElemPropertyName];
            this.__element = null;
        }
    };
    return UIElement;
}());

var CommandsExecStatus;
(function (CommandsExecStatus) {
    CommandsExecStatus[CommandsExecStatus["NotAllow"] = 1] = "NotAllow";
    CommandsExecStatus[CommandsExecStatus["AlreadyExecuting"] = 2] = "AlreadyExecuting";
    CommandsExecStatus[CommandsExecStatus["Success"] = 3] = "Success";
})(CommandsExecStatus || (CommandsExecStatus = {}));
var fundUiElementByCommand = function (elem, commandName) {
    while (elem) {
        if (elem.dataset[ElemAttributeName]) {
            var uiElem = elem[ElemPropertyName];
            if (uiElem.hasCommand(commandName))
                return uiElem;
        }
        if (typeof elem.parentElement === "undefined")
            elem = elem.parentNode;
        else
            elem = elem.parentElement;
    }
    return null;
};
var commandClickHandler = function (e) {
    var commandElem = e.target;
    while (commandElem) {
        if (commandElem.dataset[CommandAttributeName])
            break;
        if (commandElem === e.currentTarget)
            return;
        if (typeof commandElem.parentElement === "undefined")
            commandElem = commandElem.parentNode;
        else
            commandElem = commandElem.parentElement;
    }
    if (!commandElem)
        return;
    var commandName = commandElem.dataset[CommandAttributeName];
    var uiElem = fundUiElementByCommand(commandElem, commandName);
    if (uiElem === null) {
        console.warn("Not find handler for command \"".concat(commandName, "\"."));
    }
    else {
        var commandResult = uiElem.execCommand(commandName, commandElem);
        if (commandResult.context.transparent)
            return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
};
window.addEventListener("click", commandClickHandler, false);


/***/ }),

/***/ 51:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(131);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _dom__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _dom__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);



/***/ }),

/***/ 424:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(464);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _element__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _element__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);



/***/ }),

/***/ 921:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PagesMiddleware: () => (/* binding */ PagesMiddleware)
/* harmony export */ });
/* harmony import */ var brandup_ui_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(578);
/* harmony import */ var brandup_ui_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(51);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var PagesMiddleware = /** @class */ (function (_super) {
    __extends(PagesMiddleware, _super);
    function PagesMiddleware() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._page = null;
        return _this;
    }
    PagesMiddleware.prototype.start = function (context, next, end) {
        this._appContentElem = document.getElementById("app-content");
        if (!this._appContentElem)
            throw new Error("Not found page content container.");
        this._pages = {
            'support': { type: function () { return Promise.all(/* import() */[__webpack_require__.e(305), __webpack_require__.e(683)]).then(__webpack_require__.bind(__webpack_require__, 683)); }, title: "Support page" },
            'statistics': { type: function () { return __webpack_require__.e(/* import() */ 37).then(__webpack_require__.bind(__webpack_require__, 37)); }, title: "Statistics page" },
            // 'notfound':{type: () => import("../pages/statistics"), title: "Not Found page"},
            'default': { type: function () { return Promise.all(/* import() */[__webpack_require__.e(305), __webpack_require__.e(683)]).then(__webpack_require__.bind(__webpack_require__, 683)); }, title: "Support page" } // На данный момент дефолтная страница
        };
        _super.prototype.start.call(this, context, next, end);
    };
    PagesMiddleware.prototype.loaded = function (context, next, end) {
        _super.prototype.loaded.call(this, context, next, end);
    };
    PagesMiddleware.prototype.navigate = function (context, next, end) {
        var _this = this;
        if (this._page) {
            this._page.destroy();
            this._page = null;
        }
        var pageName = context.queryParams["page"] ? context.queryParams["page"][0] : "default";
        var pageDef = this._pages[pageName];
        if (!pageDef) {
            this._nav(context, "Page not found");
            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_1__.DOM.empty(this._appContentElem);
            this._appContentElem.innerText = "Page not found";
            end();
            return;
        }
        this._nav(context, pageDef.title);
        pageDef.type()
            .then(function (t) {
            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_1__.DOM.empty(_this._appContentElem);
            var content = document.createDocumentFragment();
            var contentElem = brandup_ui_dom__WEBPACK_IMPORTED_MODULE_1__.DOM.tag("div", "page");
            content.appendChild(contentElem);
            _this._page = new t.default(_this.app, contentElem);
            _this._appContentElem.appendChild(content);
            _super.prototype.navigate.call(_this, context, next, end);
        })
            .catch(function (reason) {
            console.error(reason);
            end();
        });
    };
    PagesMiddleware.prototype._nav = function (context, title) {
        document.title = title;
    };
    return PagesMiddleware;
}(brandup_ui_app__WEBPACK_IMPORTED_MODULE_0__.Middleware));



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "tgapp:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/dist_tgapp/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			524: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunktgapp"] = self["webpackChunktgapp"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var brandup_ui_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(578);
/* harmony import */ var _middlewares_pages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(921);



var builder = new brandup_ui_app__WEBPACK_IMPORTED_MODULE_0__.ApplicationBuilder();
//Вынести сюда общий конфиг каких-то настроек приложения appSetting = {data1, data2 ....} ?
builder
    .useMiddleware(new _middlewares_pages__WEBPACK_IMPORTED_MODULE_1__.PagesMiddleware());
// .useMiddleware(new RealtimeMiddleware());
var app = builder.build({ basePath: "/" }, {});
app.start(function () { console.log("app start callback"); });
app.load(function () { console.log("app load callback"); });
app.nav({ url: null, replace: true });

/******/ })()
;