/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 305:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


    Object.defineProperty(exports, "__esModule", ({ value: true }));
    var sdk_1 = __webpack_require__(925);
    exports["default"] = sdk_1.WebApp;
    //# sourceMappingURL=index.js.map
    
    /***/ }),
    
    /***/ 925:
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.WebApp = void 0;
    __webpack_require__(538);
    var telegramWindow = window;
    exports.WebApp = telegramWindow.Telegram.WebApp;
    //# sourceMappingURL=sdk.js.map
    
    /***/ }),
    
    /***/ 538:
    /***/ (() => {
    
    
    // WebView
    (function () {
        var eventHandlers = {};
        var locationHash = '';
        try {
            locationHash = location.hash.toString();
        }
        catch (e) { }
        var initParams = urlParseHashParams(locationHash);
        var storedParams = sessionStorageGet('initParams');
        if (storedParams) {
            for (var key in storedParams) {
                if (typeof initParams[key] === 'undefined') {
                    initParams[key] = storedParams[key];
                }
            }
        }
        sessionStorageSet('initParams', initParams);
        var isIframe = false, iFrameStyle;
        try {
            isIframe = (window.parent != null && window != window.parent);
            if (isIframe) {
                window.addEventListener('message', function (event) {
                    if (event.source !== window.parent)
                        return;
                    try {
                        var dataParsed = JSON.parse(event.data);
                    }
                    catch (e) {
                        return;
                    }
                    if (!dataParsed || !dataParsed.eventType) {
                        return;
                    }
                    if (dataParsed.eventType == 'set_custom_style') {
                        if (event.origin === 'https://web.telegram.org') {
                            iFrameStyle.innerHTML = dataParsed.eventData;
                        }
                    }
                    else if (dataParsed.eventType == 'reload_iframe') {
                        try {
                            window.parent.postMessage(JSON.stringify({ eventType: 'iframe_will_reload' }), '*');
                        }
                        catch (e) { }
                        location.reload();
                    }
                    else {
                        receiveEvent(dataParsed.eventType, dataParsed.eventData);
                    }
                });
                iFrameStyle = document.createElement('style');
                document.head.appendChild(iFrameStyle);
                try {
                    window.parent.postMessage(JSON.stringify({ eventType: 'iframe_ready', eventData: { reload_supported: true } }), '*');
                }
                catch (e) { }
            }
        }
        catch (e) { }
        function urlSafeDecode(urlencoded) {
            try {
                urlencoded = urlencoded.replace(/\+/g, '%20');
                return decodeURIComponent(urlencoded);
            }
            catch (e) {
                return urlencoded;
            }
        }
        function urlParseHashParams(locationHash) {
            locationHash = locationHash.replace(/^#/, '');
            var params = {};
            if (!locationHash.length) {
                return params;
            }
            if (locationHash.indexOf('=') < 0 && locationHash.indexOf('?') < 0) {
                params._path = urlSafeDecode(locationHash);
                return params;
            }
            var qIndex = locationHash.indexOf('?');
            if (qIndex >= 0) {
                var pathParam = locationHash.substr(0, qIndex);
                params._path = urlSafeDecode(pathParam);
                locationHash = locationHash.substr(qIndex + 1);
            }
            var query_params = urlParseQueryString(locationHash);
            for (var k in query_params) {
                params[k] = query_params[k];
            }
            return params;
        }
        function urlParseQueryString(queryString) {
            var params = {};
            if (!queryString.length) {
                return params;
            }
            var queryStringParams = queryString.split('&');
            var i, param, paramName, paramValue;
            for (i = 0; i < queryStringParams.length; i++) {
                param = queryStringParams[i].split('=');
                paramName = urlSafeDecode(param[0]);
                paramValue = param[1] == null ? null : urlSafeDecode(param[1]);
                params[paramName] = paramValue;
            }
            return params;
        }
        // Telegram apps will implement this logic to add service params (e.g. tgShareScoreUrl) to game URL
        function urlAppendHashParams(url, addHash) {
            // url looks like 'https://game.com/path?query=1#hash'
            // addHash looks like 'tgShareScoreUrl=' + encodeURIComponent('tgb://share_game_score?hash=very_long_hash123')
            var ind = url.indexOf('#');
            if (ind < 0) {
                // https://game.com/path -> https://game.com/path#tgShareScoreUrl=etc
                return url + '#' + addHash;
            }
            var curHash = url.substr(ind + 1);
            if (curHash.indexOf('=') >= 0 || curHash.indexOf('?') >= 0) {
                // https://game.com/#hash=1 -> https://game.com/#hash=1&tgShareScoreUrl=etc
                // https://game.com/#path?query -> https://game.com/#path?query&tgShareScoreUrl=etc
                return url + '&' + addHash;
            }
            // https://game.com/#hash -> https://game.com/#hash?tgShareScoreUrl=etc
            if (curHash.length > 0) {
                return url + '?' + addHash;
            }
            // https://game.com/# -> https://game.com/#tgShareScoreUrl=etc
            return url + addHash;
        }
        function postEvent(eventType, callback, eventData) {
            if (!callback) {
                callback = function () { };
            }
            if (eventData === undefined) {
                eventData = '';
            }
            console.log('[Telegram.WebView] > postEvent', eventType, eventData);
            if (window.TelegramWebviewProxy !== undefined) {
                TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData));
                callback();
            }
            else if (window.external && 'notify' in window.external) {
                window.external.notify(JSON.stringify({ eventType: eventType, eventData: eventData }));
                callback();
            }
            else if (isIframe) {
                try {
                    var trustedTarget = 'https://web.telegram.org';
                    // For now we don't restrict target, for testing purposes
                    trustedTarget = '*';
                    window.parent.postMessage(JSON.stringify({ eventType: eventType, eventData: eventData }), trustedTarget);
                    callback();
                }
                catch (e) {
                    callback(e);
                }
            }
            else {
                callback({ notAvailable: true });
            }
        }
        ;
        function receiveEvent(eventType, eventData) {
            console.log('[Telegram.WebView] < receiveEvent', eventType, eventData);
            callEventCallbacks(eventType, function (callback) {
                callback(eventType, eventData);
            });
        }
        function callEventCallbacks(eventType, func) {
            var curEventHandlers = eventHandlers[eventType];
            if (curEventHandlers === undefined ||
                !curEventHandlers.length) {
                return;
            }
            for (var i = 0; i < curEventHandlers.length; i++) {
                try {
                    func(curEventHandlers[i]);
                }
                catch (e) { }
            }
        }
        function onEvent(eventType, callback) {
            if (eventHandlers[eventType] === undefined) {
                eventHandlers[eventType] = [];
            }
            var index = eventHandlers[eventType].indexOf(callback);
            if (index === -1) {
                eventHandlers[eventType].push(callback);
            }
        }
        ;
        function offEvent(eventType, callback) {
            if (eventHandlers[eventType] === undefined) {
                return;
            }
            var index = eventHandlers[eventType].indexOf(callback);
            if (index === -1) {
                return;
            }
            eventHandlers[eventType].splice(index, 1);
        }
        ;
        function openProtoUrl(url) {
            if (!url.match(/^(web\+)?tgb?:\/\/./)) {
                return false;
            }
            var useIframe = navigator.userAgent.match(/iOS|iPhone OS|iPhone|iPod|iPad/i) ? true : false;
            if (useIframe) {
                var iframeContEl = document.getElementById('tgme_frame_cont') || document.body;
                var iframeEl = document.createElement('iframe');
                iframeContEl.appendChild(iframeEl);
                var pageHidden = false;
                var enableHidden = function () {
                    pageHidden = true;
                };
                window.addEventListener('pagehide', enableHidden, false);
                window.addEventListener('blur', enableHidden, false);
                if (iframeEl !== null) {
                    iframeEl.src = url;
                }
                setTimeout(function () {
                    if (!pageHidden) {
                        window.location = url;
                    }
                    window.removeEventListener('pagehide', enableHidden, false);
                    window.removeEventListener('blur', enableHidden, false);
                }, 2000);
            }
            else {
                window.location = url;
            }
            return true;
        }
        function sessionStorageSet(key, value) {
            try {
                window.sessionStorage.setItem('__telegram__' + key, JSON.stringify(value));
                return true;
            }
            catch (e) { }
            return false;
        }
        function sessionStorageGet(key) {
            try {
                return JSON.parse(window.sessionStorage.getItem('__telegram__' + key));
            }
            catch (e) { }
            return null;
        }
        if (!window.Telegram) {
            window.Telegram = {};
        }
        window.Telegram.WebView = {
            initParams: initParams,
            isIframe: isIframe,
            onEvent: onEvent,
            offEvent: offEvent,
            postEvent: postEvent,
            receiveEvent: receiveEvent,
            callEventCallbacks: callEventCallbacks
        };
        window.Telegram.Utils = {
            urlSafeDecode: urlSafeDecode,
            urlParseQueryString: urlParseQueryString,
            urlParseHashParams: urlParseHashParams,
            urlAppendHashParams: urlAppendHashParams,
            sessionStorageSet: sessionStorageSet,
            sessionStorageGet: sessionStorageGet
        };
        // For Windows Phone app
        window.TelegramGameProxy_receiveEvent = receiveEvent;
        // App backward compatibility
        window.TelegramGameProxy = {
            receiveEvent: receiveEvent
        };
    })();
    // WebApp
    (function () {
        var Utils = window.Telegram.Utils;
        var WebView = window.Telegram.WebView;
        var initParams = WebView.initParams;
        var isIframe = WebView.isIframe;
        var WebApp = {};
        var webAppInitData = '', webAppInitDataUnsafe = {};
        var themeParams = {}, colorScheme = 'light';
        var webAppVersion = '6.0';
        var webAppPlatform = 'unknown';
        if (initParams.tgWebAppData && initParams.tgWebAppData.length) {
            webAppInitData = initParams.tgWebAppData;
            webAppInitDataUnsafe = Utils.urlParseQueryString(webAppInitData);
            for (var key in webAppInitDataUnsafe) {
                var val = webAppInitDataUnsafe[key];
                try {
                    if (val.substr(0, 1) == '{' && val.substr(-1) == '}' ||
                        val.substr(0, 1) == '[' && val.substr(-1) == ']') {
                        webAppInitDataUnsafe[key] = JSON.parse(val);
                    }
                }
                catch (e) { }
            }
        }
        if (initParams.tgWebAppThemeParams && initParams.tgWebAppThemeParams.length) {
            var themeParamsRaw = initParams.tgWebAppThemeParams;
            try {
                var theme_params = JSON.parse(themeParamsRaw);
                if (theme_params) {
                    setThemeParams(theme_params);
                }
            }
            catch (e) { }
        }
        var theme_params = Utils.sessionStorageGet('themeParams');
        if (theme_params) {
            setThemeParams(theme_params);
        }
        if (initParams.tgWebAppVersion) {
            webAppVersion = initParams.tgWebAppVersion;
        }
        if (initParams.tgWebAppPlatform) {
            webAppPlatform = initParams.tgWebAppPlatform;
        }
        function onThemeChanged(eventType, eventData) {
            if (eventData.theme_params) {
                setThemeParams(eventData.theme_params);
                window.Telegram.WebApp.MainButton.setParams({});
                updateBackgroundColor();
                receiveWebViewEvent('themeChanged');
            }
        }
        var lastWindowHeight = window.innerHeight;
        function onViewportChanged(eventType, eventData) {
            if (eventData.height) {
                window.removeEventListener('resize', onWindowResize);
                setViewportHeight(eventData);
            }
        }
        function onWindowResize(e) {
            if (lastWindowHeight != window.innerHeight) {
                lastWindowHeight = window.innerHeight;
                receiveWebViewEvent('viewportChanged', {
                    isStateStable: true
                });
            }
        }
        function linkHandler(e) {
            if (e.metaKey || e.ctrlKey)
                return;
            var el = e.target;
            while (el.tagName != 'A' && el.parentNode) {
                el = el.parentNode;
            }
            if (el.tagName == 'A' &&
                el.target != '_blank' &&
                (el.protocol == 'http:' || el.protocol == 'https:') &&
                el.hostname == 't.me') {
                WebApp.openTgLink(el.href);
                e.preventDefault();
            }
        }
        function strTrim(str) {
            return str.toString().replace(/^\s+|\s+$/g, '');
        }
        function receiveWebViewEvent(eventType) {
            var args = Array.prototype.slice.call(arguments);
            eventType = args.shift();
            WebView.callEventCallbacks('webview:' + eventType, function (callback) {
                callback.apply(WebApp, args);
            });
        }
        function onWebViewEvent(eventType, callback) {
            WebView.onEvent('webview:' + eventType, callback);
        }
        ;
        function offWebViewEvent(eventType, callback) {
            WebView.offEvent('webview:' + eventType, callback);
        }
        ;
        function setCssProperty(name, value) {
            var root = document.documentElement;
            if (root && root.style && root.style.setProperty) {
                root.style.setProperty('--tg-' + name, value);
            }
        }
        function setThemeParams(theme_params) {
            // temp iOS fix
            if (theme_params.bg_color == '#1c1c1d' &&
                theme_params.bg_color == theme_params.secondary_bg_color) {
                theme_params.secondary_bg_color = '#2c2c2e';
            }
            var color;
            for (var key in theme_params) {
                if (color = parseColorToHex(theme_params[key])) {
                    themeParams[key] = color;
                    if (key == 'bg_color') {
                        colorScheme = isColorDark(color) ? 'dark' : 'light';
                        setCssProperty('color-scheme', colorScheme);
                    }
                    key = 'theme-' + key.split('_').join('-');
                    setCssProperty(key, color);
                }
            }
            Utils.sessionStorageSet('themeParams', themeParams);
        }
        var webAppCallbacks = {};
        function generateCallbackId(len) {
            var tries = 100;
            while (--tries) {
                var id = '', chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', chars_len = chars.length;
                for (var i = 0; i < len; i++) {
                    id += chars[Math.floor(Math.random() * chars_len)];
                }
                if (!webAppCallbacks[id]) {
                    webAppCallbacks[id] = {};
                    return id;
                }
            }
            throw Error('WebAppCallbackIdGenerateFailed');
        }
        var viewportHeight = false, viewportStableHeight = false, isExpanded = true;
        function setViewportHeight(data) {
            if (typeof data !== 'undefined') {
                isExpanded = !!data.is_expanded;
                viewportHeight = data.height;
                if (data.is_state_stable) {
                    viewportStableHeight = data.height;
                }
                receiveWebViewEvent('viewportChanged', {
                    isStateStable: !!data.is_state_stable
                });
            }
            var height, stable_height;
            if (viewportHeight !== false) {
                height = (viewportHeight - mainButtonHeight) + 'px';
            }
            else {
                height = mainButtonHeight ? 'calc(100vh - ' + mainButtonHeight + 'px)' : '100vh';
            }
            if (viewportStableHeight !== false) {
                stable_height = (viewportStableHeight - mainButtonHeight) + 'px';
            }
            else {
                stable_height = mainButtonHeight ? 'calc(100vh - ' + mainButtonHeight + 'px)' : '100vh';
            }
            setCssProperty('viewport-height', height);
            setCssProperty('viewport-stable-height', stable_height);
        }
        var isClosingConfirmationEnabled = false;
        function setClosingConfirmation(need_confirmation) {
            if (!versionAtLeast('6.2')) {
                console.warn('[Telegram.WebApp] Closing confirmation is not supported in version ' + webAppVersion);
                return;
            }
            isClosingConfirmationEnabled = !!need_confirmation;
            WebView.postEvent('web_app_setup_closing_behavior', false, { need_confirmation: isClosingConfirmationEnabled });
        }
        var headerColorKey = 'bg_color', headerColor = null;
        function getHeaderColor() {
            if (headerColorKey == 'secondary_bg_color') {
                return themeParams.secondary_bg_color;
            }
            else if (headerColorKey == 'bg_color') {
                return themeParams.bg_color;
            }
            return headerColor;
        }
        function setHeaderColor(color) {
            if (!versionAtLeast('6.1')) {
                console.warn('[Telegram.WebApp] Header color is not supported in version ' + webAppVersion);
                return;
            }
            if (!versionAtLeast('6.9')) {
                if (themeParams.bg_color &&
                    themeParams.bg_color == color) {
                    color = 'bg_color';
                }
                else if (themeParams.secondary_bg_color &&
                    themeParams.secondary_bg_color == color) {
                    color = 'secondary_bg_color';
                }
            }
            var head_color = null, color_key = null;
            if (color == 'bg_color' || color == 'secondary_bg_color') {
                color_key = color;
            }
            else if (versionAtLeast('6.9')) {
                head_color = parseColorToHex(color);
                if (!head_color) {
                    console.error('[Telegram.WebApp] Header color format is invalid', color);
                    throw Error('WebAppHeaderColorInvalid');
                }
            }
            if (!versionAtLeast('6.9') &&
                color_key != 'bg_color' &&
                color_key != 'secondary_bg_color') {
                console.error('[Telegram.WebApp] Header color key should be one of Telegram.WebApp.themeParams.bg_color, Telegram.WebApp.themeParams.secondary_bg_color, \'bg_color\', \'secondary_bg_color\'', color);
                throw Error('WebAppHeaderColorKeyInvalid');
            }
            headerColorKey = color_key;
            headerColor = head_color;
            updateHeaderColor();
        }
        var appHeaderColorKey = null, appHeaderColor = null;
        function updateHeaderColor() {
            if (appHeaderColorKey != headerColorKey ||
                appHeaderColor != headerColor) {
                appHeaderColorKey = headerColorKey;
                appHeaderColor = headerColor;
                if (appHeaderColor) {
                    WebView.postEvent('web_app_set_header_color', false, { color: headerColor });
                }
                else {
                    WebView.postEvent('web_app_set_header_color', false, { color_key: headerColorKey });
                }
            }
        }
        var backgroundColor = 'bg_color';
        function getBackgroundColor() {
            if (backgroundColor == 'secondary_bg_color') {
                return themeParams.secondary_bg_color;
            }
            else if (backgroundColor == 'bg_color') {
                return themeParams.bg_color;
            }
            return backgroundColor;
        }
        function setBackgroundColor(color) {
            if (!versionAtLeast('6.1')) {
                console.warn('[Telegram.WebApp] Background color is not supported in version ' + webAppVersion);
                return;
            }
            var bg_color;
            if (color == 'bg_color' || color == 'secondary_bg_color') {
                bg_color = color;
            }
            else {
                bg_color = parseColorToHex(color);
                if (!bg_color) {
                    console.error('[Telegram.WebApp] Background color format is invalid', color);
                    throw Error('WebAppBackgroundColorInvalid');
                }
            }
            backgroundColor = bg_color;
            updateBackgroundColor();
        }
        var appBackgroundColor = null;
        function updateBackgroundColor() {
            var color = getBackgroundColor();
            if (appBackgroundColor != color) {
                appBackgroundColor = color;
                WebView.postEvent('web_app_set_background_color', false, { color: color });
            }
        }
        function parseColorToHex(color) {
            color += '';
            var match;
            if (match = /^\s*#([0-9a-f]{6})\s*$/i.exec(color)) {
                return '#' + match[1].toLowerCase();
            }
            else if (match = /^\s*#([0-9a-f])([0-9a-f])([0-9a-f])\s*$/i.exec(color)) {
                return ('#' + match[1] + match[1] + match[2] + match[2] + match[3] + match[3]).toLowerCase();
            }
            else if (match = /^\s*rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)\s*$/.exec(color)) {
                var r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
                r = (r < 16 ? '0' : '') + r.toString(16);
                g = (g < 16 ? '0' : '') + g.toString(16);
                b = (b < 16 ? '0' : '') + b.toString(16);
                return '#' + r + g + b;
            }
            return false;
        }
        function isColorDark(rgb) {
            rgb = rgb.replace(/[\s#]/g, '');
            if (rgb.length == 3) {
                rgb = rgb[0] + rgb[0] + rgb[1] + rgb[1] + rgb[2] + rgb[2];
            }
            var r = parseInt(rgb.substr(0, 2), 16);
            var g = parseInt(rgb.substr(2, 2), 16);
            var b = parseInt(rgb.substr(4, 2), 16);
            var hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
            return hsp < 120;
        }
        function versionCompare(v1, v2) {
            if (typeof v1 !== 'string')
                v1 = '';
            if (typeof v2 !== 'string')
                v2 = '';
            v1 = v1.replace(/^\s+|\s+$/g, '').split('.');
            v2 = v2.replace(/^\s+|\s+$/g, '').split('.');
            var a = Math.max(v1.length, v2.length), i, p1, p2;
            for (i = 0; i < a; i++) {
                p1 = parseInt(v1[i]) || 0;
                p2 = parseInt(v2[i]) || 0;
                if (p1 == p2)
                    continue;
                if (p1 > p2)
                    return 1;
                return -1;
            }
            return 0;
        }
        function versionAtLeast(ver) {
            return versionCompare(webAppVersion, ver) >= 0;
        }
        function byteLength(str) {
            if (window.Blob) {
                try {
                    return new Blob([str]).size;
                }
                catch (e) { }
            }
            var s = str.length;
            for (var i = str.length - 1; i >= 0; i--) {
                var code = str.charCodeAt(i);
                if (code > 0x7f && code <= 0x7ff)
                    s++;
                else if (code > 0x7ff && code <= 0xffff)
                    s += 2;
                if (code >= 0xdc00 && code <= 0xdfff)
                    i--;
            }
            return s;
        }
        var BackButton = (function () {
            var isVisible = false;
            var backButton = {};
            Object.defineProperty(backButton, 'isVisible', {
                set: function (val) { setParams({ is_visible: val }); },
                get: function () { return isVisible; },
                enumerable: true
            });
            var curButtonState = null;
            WebView.onEvent('back_button_pressed', onBackButtonPressed);
            function onBackButtonPressed() {
                receiveWebViewEvent('backButtonClicked');
            }
            function buttonParams() {
                return { is_visible: isVisible };
            }
            function buttonState(btn_params) {
                if (typeof btn_params === 'undefined') {
                    btn_params = buttonParams();
                }
                return JSON.stringify(btn_params);
            }
            function buttonCheckVersion() {
                if (!versionAtLeast('6.1')) {
                    console.warn('[Telegram.WebApp] BackButton is not supported in version ' + webAppVersion);
                    return false;
                }
                return true;
            }
            function updateButton() {
                var btn_params = buttonParams();
                var btn_state = buttonState(btn_params);
                if (curButtonState === btn_state) {
                    return;
                }
                curButtonState = btn_state;
                WebView.postEvent('web_app_setup_back_button', false, btn_params);
            }
            function setParams(params) {
                if (!buttonCheckVersion()) {
                    return backButton;
                }
                if (typeof params.is_visible !== 'undefined') {
                    isVisible = !!params.is_visible;
                }
                updateButton();
                return backButton;
            }
            backButton.onClick = function (callback) {
                if (buttonCheckVersion()) {
                    onWebViewEvent('backButtonClicked', callback);
                }
                return backButton;
            };
            backButton.offClick = function (callback) {
                if (buttonCheckVersion()) {
                    offWebViewEvent('backButtonClicked', callback);
                }
                return backButton;
            };
            backButton.show = function () {
                return setParams({ is_visible: true });
            };
            backButton.hide = function () {
                return setParams({ is_visible: false });
            };
            return backButton;
        })();
        var mainButtonHeight = 0;
        var MainButton = (function () {
            var isVisible = false;
            var isActive = true;
            var isProgressVisible = false;
            var buttonText = 'CONTINUE';
            var buttonColor = false;
            var buttonTextColor = false;
            var mainButton = {};
            Object.defineProperty(mainButton, 'text', {
                set: function (val) { mainButton.setParams({ text: val }); },
                get: function () { return buttonText; },
                enumerable: true
            });
            Object.defineProperty(mainButton, 'color', {
                set: function (val) { mainButton.setParams({ color: val }); },
                get: function () { return buttonColor || themeParams.button_color || '#2481cc'; },
                enumerable: true
            });
            Object.defineProperty(mainButton, 'textColor', {
                set: function (val) { mainButton.setParams({ text_color: val }); },
                get: function () { return buttonTextColor || themeParams.button_text_color || '#ffffff'; },
                enumerable: true
            });
            Object.defineProperty(mainButton, 'isVisible', {
                set: function (val) { mainButton.setParams({ is_visible: val }); },
                get: function () { return isVisible; },
                enumerable: true
            });
            Object.defineProperty(mainButton, 'isProgressVisible', {
                get: function () { return isProgressVisible; },
                enumerable: true
            });
            Object.defineProperty(mainButton, 'isActive', {
                set: function (val) { mainButton.setParams({ is_active: val }); },
                get: function () { return isActive; },
                enumerable: true
            });
            var curButtonState = null;
            WebView.onEvent('main_button_pressed', onMainButtonPressed);
            var debugBtn = null, debugBtnStyle = {};
            if (initParams.tgWebAppDebug) {
                debugBtn = document.createElement('tg-main-button');
                debugBtnStyle = {
                    font: '600 14px/18px sans-serif',
                    display: 'none',
                    width: '100%',
                    height: '48px',
                    borderRadius: '0',
                    background: 'no-repeat right center',
                    position: 'fixed',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    margin: '0',
                    padding: '15px 20px',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                    zIndex: '10000'
                };
                for (var k in debugBtnStyle) {
                    debugBtn.style[k] = debugBtnStyle[k];
                }
                document.addEventListener('DOMContentLoaded', function onDomLoaded(event) {
                    document.removeEventListener('DOMContentLoaded', onDomLoaded);
                    document.body.appendChild(debugBtn);
                    debugBtn.addEventListener('click', onMainButtonPressed, false);
                });
            }
            function onMainButtonPressed() {
                if (isActive) {
                    receiveWebViewEvent('mainButtonClicked');
                }
            }
            function buttonParams() {
                var color = mainButton.color;
                var text_color = mainButton.textColor;
                return isVisible ? {
                    is_visible: true,
                    is_active: isActive,
                    is_progress_visible: isProgressVisible,
                    text: buttonText,
                    color: color,
                    text_color: text_color
                } : { is_visible: false };
            }
            function buttonState(btn_params) {
                if (typeof btn_params === 'undefined') {
                    btn_params = buttonParams();
                }
                return JSON.stringify(btn_params);
            }
            function updateButton() {
                var btn_params = buttonParams();
                var btn_state = buttonState(btn_params);
                if (curButtonState === btn_state) {
                    return;
                }
                curButtonState = btn_state;
                WebView.postEvent('web_app_setup_main_button', false, btn_params);
                if (initParams.tgWebAppDebug) {
                    updateDebugButton(btn_params);
                }
            }
            function updateDebugButton(btn_params) {
                if (btn_params.is_visible) {
                    debugBtn.style.display = 'block';
                    mainButtonHeight = 48;
                    debugBtn.style.opacity = btn_params.is_active ? '1' : '0.8';
                    debugBtn.style.cursor = btn_params.is_active ? 'pointer' : 'auto';
                    debugBtn.disabled = !btn_params.is_active;
                    debugBtn.innerText = btn_params.text;
                    debugBtn.style.backgroundImage = btn_params.is_progress_visible ? "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20viewport%3D%220%200%2048%2048%22%20width%3D%2248px%22%20height%3D%2248px%22%3E%3Ccircle%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20stroke%3D%22%23fff%22%20stroke-width%3D%222.25%22%20stroke-linecap%3D%22round%22%20fill%3D%22none%22%20stroke-dashoffset%3D%22106%22%20r%3D%229%22%20stroke-dasharray%3D%2256.52%22%20rotate%3D%22-90%22%3E%3Canimate%20attributeName%3D%22stroke-dashoffset%22%20attributeType%3D%22XML%22%20dur%3D%22360s%22%20from%3D%220%22%20to%3D%2212500%22%20repeatCount%3D%22indefinite%22%3E%3C%2Fanimate%3E%3CanimateTransform%20attributeName%3D%22transform%22%20attributeType%3D%22XML%22%20type%3D%22rotate%22%20dur%3D%221s%22%20from%3D%22-90%2024%2024%22%20to%3D%22630%2024%2024%22%20repeatCount%3D%22indefinite%22%3E%3C%2FanimateTransform%3E%3C%2Fcircle%3E%3C%2Fsvg%3E')" : 'none';
                    debugBtn.style.backgroundColor = btn_params.color;
                    debugBtn.style.color = btn_params.text_color;
                }
                else {
                    debugBtn.style.display = 'none';
                    mainButtonHeight = 0;
                }
                if (document.documentElement) {
                    document.documentElement.style.boxSizing = 'border-box';
                    document.documentElement.style.paddingBottom = mainButtonHeight + 'px';
                }
                setViewportHeight();
            }
            function setParams(params) {
                if (typeof params.text !== 'undefined') {
                    var text = strTrim(params.text);
                    if (!text.length) {
                        console.error('[Telegram.WebApp] Main button text is required', params.text);
                        throw Error('WebAppMainButtonParamInvalid');
                    }
                    if (text.length > 64) {
                        console.error('[Telegram.WebApp] Main button text is too long', text);
                        throw Error('WebAppMainButtonParamInvalid');
                    }
                    buttonText = text;
                }
                if (typeof params.color !== 'undefined') {
                    if (params.color === false ||
                        params.color === null) {
                        buttonColor = false;
                    }
                    else {
                        var color = parseColorToHex(params.color);
                        if (!color) {
                            console.error('[Telegram.WebApp] Main button color format is invalid', params.color);
                            throw Error('WebAppMainButtonParamInvalid');
                        }
                        buttonColor = color;
                    }
                }
                if (typeof params.text_color !== 'undefined') {
                    if (params.text_color === false ||
                        params.text_color === null) {
                        buttonTextColor = false;
                    }
                    else {
                        var text_color = parseColorToHex(params.text_color);
                        if (!text_color) {
                            console.error('[Telegram.WebApp] Main button text color format is invalid', params.text_color);
                            throw Error('WebAppMainButtonParamInvalid');
                        }
                        buttonTextColor = text_color;
                    }
                }
                if (typeof params.is_visible !== 'undefined') {
                    if (params.is_visible &&
                        !mainButton.text.length) {
                        console.error('[Telegram.WebApp] Main button text is required');
                        throw Error('WebAppMainButtonParamInvalid');
                    }
                    isVisible = !!params.is_visible;
                }
                if (typeof params.is_active !== 'undefined') {
                    isActive = !!params.is_active;
                }
                updateButton();
                return mainButton;
            }
            mainButton.setText = function (text) {
                return mainButton.setParams({ text: text });
            };
            mainButton.onClick = function (callback) {
                onWebViewEvent('mainButtonClicked', callback);
                return mainButton;
            };
            mainButton.offClick = function (callback) {
                offWebViewEvent('mainButtonClicked', callback);
                return mainButton;
            };
            mainButton.show = function () {
                return mainButton.setParams({ is_visible: true });
            };
            mainButton.hide = function () {
                return mainButton.setParams({ is_visible: false });
            };
            mainButton.enable = function () {
                return mainButton.setParams({ is_active: true });
            };
            mainButton.disable = function () {
                return mainButton.setParams({ is_active: false });
            };
            mainButton.showProgress = function (leaveActive) {
                isActive = !!leaveActive;
                isProgressVisible = true;
                updateButton();
                return mainButton;
            };
            mainButton.hideProgress = function () {
                if (!mainButton.isActive) {
                    isActive = true;
                }
                isProgressVisible = false;
                updateButton();
                return mainButton;
            };
            mainButton.setParams = setParams;
            return mainButton;
        })();
        var SettingsButton = (function () {
            var isVisible = false;
            var settingsButton = {};
            Object.defineProperty(settingsButton, 'isVisible', {
                set: function (val) { setParams({ is_visible: val }); },
                get: function () { return isVisible; },
                enumerable: true
            });
            var curButtonState = null;
            WebView.onEvent('settings_button_pressed', onSettingsButtonPressed);
            function onSettingsButtonPressed() {
                receiveWebViewEvent('settingsButtonClicked');
            }
            function buttonParams() {
                return { is_visible: isVisible };
            }
            function buttonState(btn_params) {
                if (typeof btn_params === 'undefined') {
                    btn_params = buttonParams();
                }
                return JSON.stringify(btn_params);
            }
            function buttonCheckVersion() {
                if (!versionAtLeast('6.10')) {
                    console.warn('[Telegram.WebApp] SettingsButton is not supported in version ' + webAppVersion);
                    return false;
                }
                return true;
            }
            function updateButton() {
                var btn_params = buttonParams();
                var btn_state = buttonState(btn_params);
                if (curButtonState === btn_state) {
                    return;
                }
                curButtonState = btn_state;
                WebView.postEvent('web_app_setup_settings_button', false, btn_params);
            }
            function setParams(params) {
                if (!buttonCheckVersion()) {
                    return settingsButton;
                }
                if (typeof params.is_visible !== 'undefined') {
                    isVisible = !!params.is_visible;
                }
                updateButton();
                return settingsButton;
            }
            settingsButton.onClick = function (callback) {
                if (buttonCheckVersion()) {
                    onWebViewEvent('settingsButtonClicked', callback);
                }
                return settingsButton;
            };
            settingsButton.offClick = function (callback) {
                if (buttonCheckVersion()) {
                    offWebViewEvent('settingsButtonClicked', callback);
                }
                return settingsButton;
            };
            settingsButton.show = function () {
                return setParams({ is_visible: true });
            };
            settingsButton.hide = function () {
                return setParams({ is_visible: false });
            };
            return settingsButton;
        })();
        var HapticFeedback = (function () {
            var hapticFeedback = {};
            function triggerFeedback(params) {
                if (!versionAtLeast('6.1')) {
                    console.warn('[Telegram.WebApp] HapticFeedback is not supported in version ' + webAppVersion);
                    return hapticFeedback;
                }
                if (params.type == 'impact') {
                    if (params.impact_style != 'light' &&
                        params.impact_style != 'medium' &&
                        params.impact_style != 'heavy' &&
                        params.impact_style != 'rigid' &&
                        params.impact_style != 'soft') {
                        console.error('[Telegram.WebApp] Haptic impact style is invalid', params.impact_style);
                        throw Error('WebAppHapticImpactStyleInvalid');
                    }
                }
                else if (params.type == 'notification') {
                    if (params.notification_type != 'error' &&
                        params.notification_type != 'success' &&
                        params.notification_type != 'warning') {
                        console.error('[Telegram.WebApp] Haptic notification type is invalid', params.notification_type);
                        throw Error('WebAppHapticNotificationTypeInvalid');
                    }
                }
                else if (params.type == 'selection_change') {
                    // no params needed
                }
                else {
                    console.error('[Telegram.WebApp] Haptic feedback type is invalid', params.type);
                    throw Error('WebAppHapticFeedbackTypeInvalid');
                }
                WebView.postEvent('web_app_trigger_haptic_feedback', false, params);
                return hapticFeedback;
            }
            hapticFeedback.impactOccurred = function (style) {
                return triggerFeedback({ type: 'impact', impact_style: style });
            };
            hapticFeedback.notificationOccurred = function (type) {
                return triggerFeedback({ type: 'notification', notification_type: type });
            };
            hapticFeedback.selectionChanged = function () {
                return triggerFeedback({ type: 'selection_change' });
            };
            return hapticFeedback;
        })();
        var CloudStorage = (function () {
            var cloudStorage = {};
            function invokeStorageMethod(method, params, callback) {
                if (!versionAtLeast('6.9')) {
                    console.error('[Telegram.WebApp] CloudStorage is not supported in version ' + webAppVersion);
                    throw Error('WebAppMethodUnsupported');
                }
                invokeCustomMethod(method, params, callback);
                return cloudStorage;
            }
            cloudStorage.setItem = function (key, value, callback) {
                return invokeStorageMethod('saveStorageValue', { key: key, value: value }, callback);
            };
            cloudStorage.getItem = function (key, callback) {
                return cloudStorage.getItems([key], callback ? function (err, res) {
                    if (err)
                        callback(err);
                    else
                        callback(null, res[key]);
                } : null);
            };
            cloudStorage.getItems = function (keys, callback) {
                return invokeStorageMethod('getStorageValues', { keys: keys }, callback);
            };
            cloudStorage.removeItem = function (key, callback) {
                return cloudStorage.removeItems([key], callback);
            };
            cloudStorage.removeItems = function (keys, callback) {
                return invokeStorageMethod('deleteStorageValues', { keys: keys }, callback);
            };
            cloudStorage.getKeys = function (callback) {
                return invokeStorageMethod('getStorageKeys', {}, callback);
            };
            return cloudStorage;
        })();
        var webAppInvoices = {};
        function onInvoiceClosed(eventType, eventData) {
            if (eventData.slug && webAppInvoices[eventData.slug]) {
                var invoiceData = webAppInvoices[eventData.slug];
                delete webAppInvoices[eventData.slug];
                if (invoiceData.callback) {
                    invoiceData.callback(eventData.status);
                }
                receiveWebViewEvent('invoiceClosed', {
                    url: invoiceData.url,
                    status: eventData.status
                });
            }
        }
        var webAppPopupOpened = false;
        function onPopupClosed(eventType, eventData) {
            if (webAppPopupOpened) {
                var popupData = webAppPopupOpened;
                webAppPopupOpened = false;
                var button_id = null;
                if (typeof eventData.button_id !== 'undefined') {
                    button_id = eventData.button_id;
                }
                if (popupData.callback) {
                    popupData.callback(button_id);
                }
                receiveWebViewEvent('popupClosed', {
                    button_id: button_id
                });
            }
        }
        var webAppScanQrPopupOpened = false;
        function onQrTextReceived(eventType, eventData) {
            if (webAppScanQrPopupOpened) {
                var popupData = webAppScanQrPopupOpened;
                var data = null;
                if (typeof eventData.data !== 'undefined') {
                    data = eventData.data;
                }
                if (popupData.callback) {
                    if (popupData.callback(data)) {
                        webAppScanQrPopupOpened = false;
                        WebView.postEvent('web_app_close_scan_qr_popup', false);
                    }
                }
                receiveWebViewEvent('qrTextReceived', {
                    data: data
                });
            }
        }
        function onScanQrPopupClosed(eventType, eventData) {
            webAppScanQrPopupOpened = false;
        }
        function onClipboardTextReceived(eventType, eventData) {
            if (eventData.req_id && webAppCallbacks[eventData.req_id]) {
                var requestData = webAppCallbacks[eventData.req_id];
                delete webAppCallbacks[eventData.req_id];
                var data = null;
                if (typeof eventData.data !== 'undefined') {
                    data = eventData.data;
                }
                if (requestData.callback) {
                    requestData.callback(data);
                }
                receiveWebViewEvent('clipboardTextReceived', {
                    data: data
                });
            }
        }
        var WebAppWriteAccessRequested = false;
        function onWriteAccessRequested(eventType, eventData) {
            if (WebAppWriteAccessRequested) {
                var requestData = WebAppWriteAccessRequested;
                WebAppWriteAccessRequested = false;
                if (requestData.callback) {
                    requestData.callback(eventData.status == 'allowed');
                }
                receiveWebViewEvent('writeAccessRequested', {
                    status: eventData.status
                });
            }
        }
        function getRequestedContact(callback, timeout) {
            var reqTo, fallbackTo, reqDelay = 0;
            var reqInvoke = function () {
                invokeCustomMethod('getRequestedContact', {}, function (err, res) {
                    if (res && res.length) {
                        clearTimeout(fallbackTo);
                        callback(res);
                    }
                    else {
                        reqDelay += 50;
                        reqTo = setTimeout(reqInvoke, reqDelay);
                    }
                });
            };
            var fallbackInvoke = function () {
                clearTimeout(reqTo);
                callback('');
            };
            fallbackTo = setTimeout(fallbackInvoke, timeout);
            reqInvoke();
        }
        var WebAppContactRequested = false;
        function onPhoneRequested(eventType, eventData) {
            if (WebAppContactRequested) {
                var requestData = WebAppContactRequested;
                WebAppContactRequested = false;
                var requestSent = eventData.status == 'sent';
                var webViewEvent = {
                    status: eventData.status
                };
                if (requestSent) {
                    getRequestedContact(function (res) {
                        if (res && res.length) {
                            webViewEvent.response = res;
                            webViewEvent.responseUnsafe = Utils.urlParseQueryString(res);
                            for (var key in webViewEvent.responseUnsafe) {
                                var val = webViewEvent.responseUnsafe[key];
                                try {
                                    if (val.substr(0, 1) == '{' && val.substr(-1) == '}' ||
                                        val.substr(0, 1) == '[' && val.substr(-1) == ']') {
                                        webViewEvent.responseUnsafe[key] = JSON.parse(val);
                                    }
                                }
                                catch (e) { }
                            }
                        }
                        if (requestData.callback) {
                            requestData.callback(requestSent, webViewEvent);
                        }
                        receiveWebViewEvent('contactRequested', webViewEvent);
                    }, 3000);
                }
                else {
                    if (requestData.callback) {
                        requestData.callback(requestSent, webViewEvent);
                    }
                    receiveWebViewEvent('contactRequested', webViewEvent);
                }
            }
        }
        function onCustomMethodInvoked(eventType, eventData) {
            if (eventData.req_id && webAppCallbacks[eventData.req_id]) {
                var requestData = webAppCallbacks[eventData.req_id];
                delete webAppCallbacks[eventData.req_id];
                var res = null, err = null;
                if (typeof eventData.result !== 'undefined') {
                    res = eventData.result;
                }
                if (typeof eventData.error !== 'undefined') {
                    err = eventData.error;
                }
                if (requestData.callback) {
                    requestData.callback(err, res);
                }
            }
        }
        function invokeCustomMethod(method, params, callback) {
            if (!versionAtLeast('6.9')) {
                console.error('[Telegram.WebApp] Method invokeCustomMethod is not supported in version ' + webAppVersion);
                throw Error('WebAppMethodUnsupported');
            }
            var req_id = generateCallbackId(16);
            var req_params = { req_id: req_id, method: method, params: params || {} };
            webAppCallbacks[req_id] = {
                callback: callback
            };
            WebView.postEvent('web_app_invoke_custom_method', false, req_params);
        }
        ;
        if (!window.Telegram) {
            window.Telegram = {};
        }
        Object.defineProperty(WebApp, 'initData', {
            get: function () { return webAppInitData; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'initDataUnsafe', {
            get: function () { return webAppInitDataUnsafe; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'version', {
            get: function () { return webAppVersion; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'platform', {
            get: function () { return webAppPlatform; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'colorScheme', {
            get: function () { return colorScheme; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'themeParams', {
            get: function () { return themeParams; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'isExpanded', {
            get: function () { return isExpanded; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'viewportHeight', {
            get: function () { return (viewportHeight === false ? window.innerHeight : viewportHeight) - mainButtonHeight; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'viewportStableHeight', {
            get: function () { return (viewportStableHeight === false ? window.innerHeight : viewportStableHeight) - mainButtonHeight; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'isClosingConfirmationEnabled', {
            set: function (val) { setClosingConfirmation(val); },
            get: function () { return isClosingConfirmationEnabled; },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'headerColor', {
            set: function (val) { setHeaderColor(val); },
            get: function () { return getHeaderColor(); },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'backgroundColor', {
            set: function (val) { setBackgroundColor(val); },
            get: function () { return getBackgroundColor(); },
            enumerable: true
        });
        Object.defineProperty(WebApp, 'BackButton', {
            value: BackButton,
            enumerable: true
        });
        Object.defineProperty(WebApp, 'MainButton', {
            value: MainButton,
            enumerable: true
        });
        Object.defineProperty(WebApp, 'SettingsButton', {
            value: SettingsButton,
            enumerable: true
        });
        Object.defineProperty(WebApp, 'HapticFeedback', {
            value: HapticFeedback,
            enumerable: true
        });
        Object.defineProperty(WebApp, 'CloudStorage', {
            value: CloudStorage,
            enumerable: true
        });
        WebApp.setHeaderColor = function (color_key) {
            WebApp.headerColor = color_key;
        };
        WebApp.setBackgroundColor = function (color) {
            WebApp.backgroundColor = color;
        };
        WebApp.enableClosingConfirmation = function () {
            WebApp.isClosingConfirmationEnabled = true;
        };
        WebApp.disableClosingConfirmation = function () {
            WebApp.isClosingConfirmationEnabled = false;
        };
        WebApp.isVersionAtLeast = function (ver) {
            return versionAtLeast(ver);
        };
        WebApp.onEvent = function (eventType, callback) {
            onWebViewEvent(eventType, callback);
        };
        WebApp.offEvent = function (eventType, callback) {
            offWebViewEvent(eventType, callback);
        };
        WebApp.sendData = function (data) {
            if (!data || !data.length) {
                console.error('[Telegram.WebApp] Data is required', data);
                throw Error('WebAppDataInvalid');
            }
            if (byteLength(data) > 4096) {
                console.error('[Telegram.WebApp] Data is too long', data);
                throw Error('WebAppDataInvalid');
            }
            WebView.postEvent('web_app_data_send', false, { data: data });
        };
        WebApp.switchInlineQuery = function (query, choose_chat_types) {
            if (!versionAtLeast('6.6')) {
                console.error('[Telegram.WebApp] Method switchInlineQuery is not supported in version ' + webAppVersion);
                throw Error('WebAppMethodUnsupported');
            }
            if (!initParams.tgWebAppBotInline) {
                console.error('[Telegram.WebApp] Inline mode is disabled for this bot. Read more about inline mode: https://core.telegram.org/bots/inline');
                throw Error('WebAppInlineModeDisabled');
            }
            query = query || '';
            if (query.length > 256) {
                console.error('[Telegram.WebApp] Inline query is too long', query);
                throw Error('WebAppInlineQueryInvalid');
            }
            var chat_types = [];
            if (choose_chat_types) {
                if (!Array.isArray(choose_chat_types)) {
                    console.error('[Telegram.WebApp] Choose chat types should be an array', choose_chat_types);
                    throw Error('WebAppInlineChooseChatTypesInvalid');
                }
                var good_types = { users: 1, bots: 1, groups: 1, channels: 1 };
                for (var i = 0; i < choose_chat_types.length; i++) {
                    var chat_type = choose_chat_types[i];
                    if (!good_types[chat_type]) {
                        console.error('[Telegram.WebApp] Choose chat type is invalid', chat_type);
                        throw Error('WebAppInlineChooseChatTypeInvalid');
                    }
                    if (good_types[chat_type] != 2) {
                        good_types[chat_type] = 2;
                        chat_types.push(chat_type);
                    }
                }
            }
            WebView.postEvent('web_app_switch_inline_query', false, { query: query, chat_types: chat_types });
        };
        WebApp.openLink = function (url, options) {
            var a = document.createElement('A');
            a.href = url;
            if (a.protocol != 'http:' &&
                a.protocol != 'https:') {
                console.error('[Telegram.WebApp] Url protocol is not supported', url);
                throw Error('WebAppTgUrlInvalid');
            }
            var url = a.href;
            options = options || {};
            if (versionAtLeast('6.1')) {
                WebView.postEvent('web_app_open_link', false, { url: url, try_instant_view: versionAtLeast('6.4') && !!options.try_instant_view });
            }
            else {
                window.open(url, '_blank');
            }
        };
        WebApp.openTelegramLink = function (url) {
            var a = document.createElement('A');
            a.href = url;
            if (a.protocol != 'http:' &&
                a.protocol != 'https:') {
                console.error('[Telegram.WebApp] Url protocol is not supported', url);
                throw Error('WebAppTgUrlInvalid');
            }
            if (a.hostname != 't.me') {
                console.error('[Telegram.WebApp] Url host is not supported', url);
                throw Error('WebAppTgUrlInvalid');
            }
            var path_full = a.pathname + a.search;
            if (isIframe || versionAtLeast('6.1')) {
                WebView.postEvent('web_app_open_tg_link', false, { path_full: path_full });
            }
            else {
                location.href = 'https://t.me' + path_full;
            }
        };
        WebApp.openInvoice = function (url, callback) {
            var a = document.createElement('A'), match, slug;
            a.href = url;
            if (a.protocol != 'http:' &&
                a.protocol != 'https:' ||
                a.hostname != 't.me' ||
                !(match = a.pathname.match(/^\/(\$|invoice\/)([A-Za-z0-9\-_=]+)$/)) ||
                !(slug = match[2])) {
                console.error('[Telegram.WebApp] Invoice url is invalid', url);
                throw Error('WebAppInvoiceUrlInvalid');
            }
            if (!versionAtLeast('6.1')) {
                console.error('[Telegram.WebApp] Method openInvoice is not supported in version ' + webAppVersion);
                throw Error('WebAppMethodUnsupported');
            }
            if (webAppInvoices[slug]) {
                console.error('[Telegram.WebApp] Invoice is already opened');
                throw Error('WebAppInvoiceOpened');
            }
            webAppInvoices[slug] = {
                url: url,
                callback: callback
            };
            WebView.postEvent('web_app_open_invoice', false, { slug: slug });
        };
        WebApp.showPopup = function (params, callback) {
            if (!versionAtLeast('6.2')) {
                console.error('[Telegram.WebApp] Method showPopup is not supported in version ' + webAppVersion);
                throw Error('WebAppMethodUnsupported');
            }
            if (webAppPopupOpened) {
                console.error('[Telegram.WebApp] Popup is already opened');
                throw Error('WebAppPopupOpened');
            }
            var title = '';
            var message = '';
            var buttons = [];
            var popup_buttons = {};
            var popup_params = {};
            if (typeof params.title !== 'undefined') {
                title = strTrim(params.title);
                if (title.length > 64) {
                    console.error('[Telegram.WebApp] Popup title is too long', title);
                    throw Error('WebAppPopupParamInvalid');
                }
                if (title.length > 0) {
                    popup_params.title = title;
                }
            }
            if (typeof params.message !== 'undefined') {
                message = strTrim(params.message);
            }
            if (!message.length) {
                console.error('[Telegram.WebApp] Popup message is required', params.message);
                throw Error('WebAppPopupParamInvalid');
            }
            if (message.length > 256) {
                console.error('[Telegram.WebApp] Popup message is too long', message);
                throw Error('WebAppPopupParamInvalid');
            }
            popup_params.message = message;
            if (typeof params.buttons !== 'undefined') {
                if (!Array.isArray(params.buttons)) {
                    console.error('[Telegram.WebApp] Popup buttons should be an array', params.buttons);
                    throw Error('WebAppPopupParamInvalid');
                }
                for (var i = 0; i < params.buttons.length; i++) {
                    var button = params.buttons[i];
                    var btn = {};
                    var id = '';
                    if (typeof button.id !== 'undefined') {
                        id = button.id.toString();
                        if (id.length > 64) {
                            console.error('[Telegram.WebApp] Popup button id is too long', id);
                            throw Error('WebAppPopupParamInvalid');
                        }
                    }
                    btn.id = id;
                    var button_type = button.type;
                    if (typeof button_type === 'undefined') {
                        button_type = 'default';
                    }
                    btn.type = button_type;
                    if (button_type == 'ok' ||
                        button_type == 'close' ||
                        button_type == 'cancel') {
                        // no params needed
                    }
                    else if (button_type == 'default' ||
                        button_type == 'destructive') {
                        var text = '';
                        if (typeof button.text !== 'undefined') {
                            text = strTrim(button.text);
                        }
                        if (!text.length) {
                            console.error('[Telegram.WebApp] Popup button text is required for type ' + button_type, button.text);
                            throw Error('WebAppPopupParamInvalid');
                        }
                        if (text.length > 64) {
                            console.error('[Telegram.WebApp] Popup button text is too long', text);
                            throw Error('WebAppPopupParamInvalid');
                        }
                        btn.text = text;
                    }
                    else {
                        console.error('[Telegram.WebApp] Popup button type is invalid', button_type);
                        throw Error('WebAppPopupParamInvalid');
                    }
                    buttons.push(btn);
                }
            }
            else {
                buttons.push({ id: '', type: 'close' });
            }
            if (buttons.length < 1) {
                console.error('[Telegram.WebApp] Popup should have at least one button');
                throw Error('WebAppPopupParamInvalid');
            }
            if (buttons.length > 3) {
                console.error('[Telegram.WebApp] Popup should not have more than 3 buttons');
                throw Error('WebAppPopupParamInvalid');
            }
            popup_params.buttons = buttons;
            webAppPopupOpened = {
                callback: callback
            };
            WebView.postEvent('web_app_open_popup', false, popup_params);
        };
        WebApp.showAlert = function (message, callback) {
            WebApp.showPopup({
                message: message
            }, callback ? function () { callback(); } : null);
        };
        WebApp.showConfirm = function (message, callback) {
            WebApp.showPopup({
                message: message,
                buttons: [
                    { type: 'ok', id: 'ok' },
                    { type: 'cancel' }
                ]
            }, callback ? function (button_id) {
                callback(button_id == 'ok');
            } : null);
        };
        WebApp.showScanQrPopup = function (params, callback) {
            if (!versionAtLeast('6.4')) {
                console.error('[Telegram.WebApp] Method showScanQrPopup is not supported in version ' + webAppVersion);
                throw Error('WebAppMethodUnsupported');
            }
            if (webAppScanQrPopupOpened) {
                console.error('[Telegram.WebApp] Popup is already opened');
                throw Error('WebAppScanQrPopupOpened');
            }
            var text = '';
            var popup_params = {};
            if (typeof params.text !== 'undefined') {
                text = strTrim(params.text);
                if (text.length > 64) {
                    console.error('[Telegram.WebApp] Scan QR popup text is too long', text);
                    throw Error('WebAppScanQrPopupParamInvalid');
                }
                if (text.length > 0) {
                    popup_params.text = text;
                }
            }
            webAppScanQrPopupOpened = {
                callback: callback
            };
            WebView.postEvent('web_app_open_scan_qr_popup', false, popup_params);
        };
        WebApp.closeScanQrPopup = function () {
            if (!versionAtLeast('6.4')) {
                console.error('[Telegram.WebApp] Method closeScanQrPopup is not supported in version ' + webAppVersion);
                throw Error('WebAppMethodUnsupported');
            }
            webAppScanQrPopupOpened = false;
            WebView.postEvent('web_app_close_scan_qr_popup', false);
        };
        WebApp.readTextFromClipboard = function (callback) {
            if (!versionAtLeast('6.4')) {
                console.error('[Telegram.WebApp] Method readTextFromClipboard is not supported in version ' + webAppVersion);
                throw Error('WebAppMethodUnsupported');
            }
            var req_id = generateCallbackId(16);
            var req_params = { req_id: req_id };
            webAppCallbacks[req_id] = {
                callback: callback
            };
            WebView.postEvent('web_app_read_text_from_clipboard', false, req_params);
        };
        WebApp.requestWriteAccess = function (callback) {
            if (!versionAtLeast('6.9')) {
                console.error('[Telegram.WebApp] Method requestWriteAccess is not supported in version ' + webAppVersion);
                throw Error('WebAppMethodUnsupported');
            }
            if (WebAppWriteAccessRequested) {
                console.error('[Telegram.WebApp] Write access is already requested');
                throw Error('WebAppWriteAccessRequested');
            }
            WebAppWriteAccessRequested = {
                callback: callback
            };
            WebView.postEvent('web_app_request_write_access');
        };
        WebApp.requestContact = function (callback) {
            if (!versionAtLeast('6.9')) {
                console.error('[Telegram.WebApp] Method requestContact is not supported in version ' + webAppVersion);
                throw Error('WebAppMethodUnsupported');
            }
            if (WebAppContactRequested) {
                console.error('[Telegram.WebApp] Contact is already requested');
                throw Error('WebAppContactRequested');
            }
            WebAppContactRequested = {
                callback: callback
            };
            WebView.postEvent('web_app_request_phone');
        };
        WebApp.invokeCustomMethod = function (method, params, callback) {
            invokeCustomMethod(method, params, callback);
        };
        WebApp.ready = function () {
            WebView.postEvent('web_app_ready');
        };
        WebApp.expand = function () {
            WebView.postEvent('web_app_expand');
        };
        WebApp.close = function () {
            WebView.postEvent('web_app_close');
        };
        window.Telegram.WebApp = WebApp;
        updateHeaderColor();
        updateBackgroundColor();
        setViewportHeight();
        if (initParams.tgWebAppShowSettings) {
            SettingsButton.show();
        }
        window.addEventListener('resize', onWindowResize);
        if (isIframe) {
            document.addEventListener('click', linkHandler);
        }
        WebView.onEvent('theme_changed', onThemeChanged);
        WebView.onEvent('viewport_changed', onViewportChanged);
        WebView.onEvent('invoice_closed', onInvoiceClosed);
        WebView.onEvent('popup_closed', onPopupClosed);
        WebView.onEvent('qr_text_received', onQrTextReceived);
        WebView.onEvent('scan_qr_popup_closed', onScanQrPopupClosed);
        WebView.onEvent('clipboard_text_received', onClipboardTextReceived);
        WebView.onEvent('write_access_requested', onWriteAccessRequested);
        WebView.onEvent('phone_requested', onPhoneRequested);
        WebView.onEvent('custom_method_invoked', onCustomMethodInvoked);
        WebView.postEvent('web_app_request_theme');
        WebView.postEvent('web_app_request_viewport');
    })();
    //# sourceMappingURL=telegram-web-apps.js.map
    
    /***/ }),
    
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
                'support': { type: function () { return __webpack_require__.e(/* import() */ 683).then(__webpack_require__.bind(__webpack_require__, 683)); }, title: "Support page" },
                'statistics': { type: function () { return __webpack_require__.e(/* import() */ 37).then(__webpack_require__.bind(__webpack_require__, 37)); }, title: "Statistics page" },
                // 'notfound':{type: () => import("../pages/statistics"), title: "Not Found page"},
                'default': { type: function () { return __webpack_require__.e(/* import() */ 683).then(__webpack_require__.bind(__webpack_require__, 683)); }, title: "Support page" } // На данный момент дефолтная страница
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
    /******/ 		__webpack_require__.p = "/tgTestMiniAppv2/";
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
    /* harmony import */ var _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(305);
    
    
    
    
    var builder = new brandup_ui_app__WEBPACK_IMPORTED_MODULE_0__.ApplicationBuilder();
    //Вынести сюда общий конфиг каких-то настроек приложения appSetting = {data1, data2 ....} ?
    builder
        .useMiddleware(new _middlewares_pages__WEBPACK_IMPORTED_MODULE_1__.PagesMiddleware());
    // .useMiddleware(new RealtimeMiddleware());
    var app = builder.build({ basePath: "/" }, {});
    // TGAPP - start
    var SUPPORTLINK = 'https://t.me/wsenderru_support_bot';
    if (_twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].colorScheme === "light") {
        // Set light colors
        _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].setHeaderColor('#F4F4F4');
        document.documentElement.style.setProperty('--color-background-general', '#F4F4F4');
        document.documentElement.style.setProperty('--color-background-secondary', '#FFFFFF');
        document.documentElement.style.setProperty('--color-text', '#1C1C1C');
        document.documentElement.style.setProperty('--color-text-secondary', '#8D8D8D');
    }
    if (_twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].colorScheme === "dark") {
        // Set dark colors
        _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].setHeaderColor('#1C1C1C');
        document.documentElement.style.setProperty('--color-background-general', '#1C1C1C');
        document.documentElement.style.setProperty('--color-background-secondary', '#494949');
        document.documentElement.style.setProperty('--color-text', '#F4F4F4');
        document.documentElement.style.setProperty('--color-text-secondary', '#BBBBBB');
    }
    _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].MainButton.setParams({
        color: '#0D907C',
        text: 'Написать в поддержку',
        text_color: '#FFFFFF',
        is_active: true,
        is_visible: true
    });
    _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].MainButton.onClick(function () {
        _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].openTelegramLink(SUPPORTLINK);
        // Close Mini App
        _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].close();
    });
    // TGAPP - end
    app.start(function () { console.log("app start callback"); });
    app.load(function () { console.log("app load callback"); });
    app.nav({ url: null, replace: true });
    
    /******/ })()
    ;