"use strict";
(self["webpackChunktgapp"] = self["webpackChunktgapp"] || []).push([[683],{

/***/ 67:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PageModel: () => (/* binding */ PageModel)
/* harmony export */ });
/* harmony import */ var brandup_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(424);
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


var PageModel = /** @class */ (function (_super) {
    __extends(PageModel, _super);
    // abstract get header(): string;
    function PageModel(app, containerElement) {
        var _this = _super.call(this) || this;
        _this.app = app;
        _this.setElement(containerElement);
        return _this;
    }
    // protected _onRenderElement(element: HTMLElement) {
    //     element.appendChild(DOM.tag("header", "page-header", [
    //         DOM.tag("h1", null, this.header)
    //     ]));
    // }
    PageModel.prototype.destroy = function () {
        brandup_ui_dom__WEBPACK_IMPORTED_MODULE_1__.DOM.empty(this.element);
        _super.prototype.destroy.call(this);
    };
    return PageModel;
}(brandup_ui__WEBPACK_IMPORTED_MODULE_0__.UIElement));



/***/ }),

/***/ 683:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67);
/* harmony import */ var _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(305);
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



var SupportModel = /** @class */ (function (_super) {
    __extends(SupportModel, _super);
    function SupportModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SupportModel.prototype, "typeName", {
        get: function () { return "SupportModel"; },
        enumerable: false,
        configurable: true
    });
    // get header(): string { return "Support" }
    SupportModel.prototype._onRenderElement = function (element) {
        _super.prototype._onRenderElement.call(this, element);
        // TGAPP - start
        var SUPPORTLINK = 'https://t.me/wsenderru_support_bot';
        if (_twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].colorScheme === "light") {
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.bg_color = '#F4F4F4';
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.secondary_bg_color = '#FFFFFF';
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.text_color = '#1C1C1C';
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.header_bg_color = '#F4F4F4';
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.hint_color = '#8D8D8D';
            console.log("theme ".concat(_twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].colorScheme));
        }
        if (_twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].colorScheme === "dark") {
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.bg_color = '#1C1C1C';
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.secondary_bg_color = '#494949';
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.text_color = '#F4F4F4';
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.header_bg_color = '#1C1C1C';
            _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].themeParams.hint_color = '#BBB';
            console.log("theme ".concat(_twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].colorScheme));
        }
        _twa_dev_sdk__WEBPACK_IMPORTED_MODULE_2__["default"].MainButton.setParams({
            color: '#0D907C',
            text: 'Написать в поддержку1',
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
        element.appendChild(brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("h1", null, "Wsender на связи, наши телефоны поддержки"));
        element.appendChild(brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("ul", { class: "phone-list" }, [
            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("li", { class: "list-item" }, [
                brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("a", { class: "applink", onclick: "window.open('tel:+79232229022')" }, [
                    brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("div", { class: "phone-item" }, [
                        brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("div", { class: "phone-icon" }, [
                            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("img", { src: "../images/phone-icon.svg" }),
                            // DOM.tag("svg", {xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox:"0 0 16 16", fill: "none",}, [
                            //     DOM.tag("g", {id: "Icon/IOS/Phone"}, [
                            //         DOM.tag("path", {id: "Vector", d: "M11.9683 14.2222C11.9639 14.2222 11.9594 14.2222 11.955 14.2222C9.82925 14.1526 7.33886 12.0923 5.62298 10.3755C3.9049 8.65869 1.8443 6.16747 1.77801 4.05187C1.7537 3.30948 3.57565 1.9893 3.59443 1.97604C4.06732 1.64683 4.59213 1.76393 4.80758 2.06221C4.95343 2.26438 6.33452 4.35679 6.48479 4.59431C6.64057 4.84067 6.61737 5.20744 6.42291 5.57533C6.31574 5.77971 5.95997 6.405 5.79313 6.69665C5.97323 6.95295 6.44943 7.58156 7.43277 8.56479C8.41722 9.54802 9.04479 10.0253 9.30222 10.2053C9.59391 10.0385 10.2193 9.6828 10.4237 9.57563C10.7861 9.38341 11.1507 9.3591 11.3993 9.51156C11.6534 9.66733 13.7405 11.0549 13.9328 11.1886C14.0941 11.3024 14.1979 11.4968 14.2189 11.7233C14.2388 11.952 14.1681 12.1939 14.0211 12.4049C14.009 12.4226 12.7041 14.2222 11.9683 14.2222Z", fill: "#0D907C"}) //Как сделать path не парным? Можно ли передать элемент строкой?
                            //     ])
                            // ]),
                        ]),
                        brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("div", { class: "phone-data" }, [
                            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("p", null, "+7 923 222 9022"),
                            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("span", null, "Российская Федерация"),
                        ])
                    ])
                ])
            ]),
            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("li", { class: "list-item" }, [
                brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("a", { class: "applink", onclick: "window.open('tel:+77001550077')" }, [
                    brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("div", { class: "phone-item" }, [
                        brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("div", { class: "phone-icon" }, [
                            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("img", { src: "../images/phone-icon.svg" }),
                        ]),
                        brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("div", { class: "phone-data" }, [
                            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("p", null, "+7 700 155 0077"),
                            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("span", null, "Казахстан и СНГ"),
                        ])
                    ])
                ])
            ]),
        ]));
    };
    return SupportModel;
}(_base__WEBPACK_IMPORTED_MODULE_1__.PageModel));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SupportModel);


/***/ })

}]);