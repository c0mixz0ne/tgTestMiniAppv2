"use strict";
(self["webpackChunktgapp"] = self["webpackChunktgapp"] || []).push([[37],{

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

/***/ 37:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67);
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


var StatisticsModel = /** @class */ (function (_super) {
    __extends(StatisticsModel, _super);
    function StatisticsModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(StatisticsModel.prototype, "typeName", {
        get: function () { return "StatisticsModel"; },
        enumerable: false,
        configurable: true
    });
    // get header(): string { return "Statistics" }
    StatisticsModel.prototype._onRenderElement = function (element) {
        _super.prototype._onRenderElement.call(this, element);
        element.appendChild(brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("p", null, "Statistics page content."));
        element.appendChild(brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("form", { class: "appform", method: "post", action: this.app.uri("/send") }, [
            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("input", { type: "text", name: "value" }),
            brandup_ui_dom__WEBPACK_IMPORTED_MODULE_0__.DOM.tag("button", { type: "submit" }, "Send")
        ]));
    };
    return StatisticsModel;
}(_base__WEBPACK_IMPORTED_MODULE_1__.PageModel));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StatisticsModel);


/***/ })

}]);