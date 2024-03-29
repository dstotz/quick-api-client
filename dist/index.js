"use strict";
var __extends = (this && this.__extends) || (function () {
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRequestUrl = exports.buildQueryParams = exports.createQuickApiClient = exports.RequestFailed = void 0;
var fetch = require('node-fetch');
var RequestFailed = (function (_super) {
    __extends(RequestFailed, _super);
    function RequestFailed(response) {
        var _this = this;
        var _a;
        _this = _super.call(this, 'Request failed') || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        _this.status = response.status;
        _this.statusText = response.statusText;
        _this.headers = JSON.stringify(response.headers.raw());
        _this.url = response.url;
        _this.body = (_a = response.body) === null || _a === void 0 ? void 0 : _a.read().toString();
        return _this;
    }
    return RequestFailed;
}(Error));
exports.RequestFailed = RequestFailed;
var createQuickApiClient = function (clientOptions) {
    var makeRequest = function (endpoint, init, queryParams) { return __awaiter(void 0, void 0, void 0, function () {
        var requestUrl, requestInit, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestUrl = (0, exports.buildRequestUrl)(clientOptions, endpoint, queryParams);
                    requestInit = __assign(__assign(__assign({}, clientOptions.defaultInit), init), {
                        headers: __assign(__assign({}, clientOptions.headers), init.headers),
                    });
                    return [4, fetch(requestUrl, requestInit)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3, 3];
                    return [4, response.json()];
                case 2:
                    data = _a.sent();
                    return [2, data];
                case 3: throw new RequestFailed(response);
            }
        });
    }); };
    var get = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var endpoint, headers, body, params, init;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = options.endpoint, headers = options.headers, body = options.body, params = options.params, init = options.init;
                    return [4, makeRequest(endpoint, __assign({ method: 'GET', headers: headers, body: body }, init), params)];
                case 1: return [2, _a.sent()];
            }
        });
    }); };
    var getPaginated = function (options, callback, page) { return __awaiter(void 0, void 0, void 0, function () {
        var pageParam, params, currentPage, done, resultKey, rawResults, results;
        var _a;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    pageParam = ((_b = clientOptions.paginationOptions) === null || _b === void 0 ? void 0 : _b.pageParam) || 'page';
                    params = options.params || {};
                    currentPage = page || params[pageParam] || 1;
                    done = false;
                    resultKey = (_c = clientOptions.paginationOptions) === null || _c === void 0 ? void 0 : _c.resultKey;
                    _f.label = 1;
                case 1: return [4, get(__assign(__assign({}, options), { params: __assign(__assign({}, options.params), (_a = {}, _a[pageParam] = currentPage, _a)) }))];
                case 2:
                    rawResults = _f.sent();
                    results = resultKey ? rawResults[resultKey] : rawResults;
                    if (!results || (Array.isArray(results) && results.length === 0)) {
                        done = true;
                        return [2];
                    }
                    if (((_d = clientOptions.paginationOptions) === null || _d === void 0 ? void 0 : _d.lastPage) &&
                        ((_e = clientOptions.paginationOptions) === null || _e === void 0 ? void 0 : _e.lastPage(results))) {
                        done = true;
                        return [2];
                    }
                    return [4, callback(results, rawResults)];
                case 3:
                    _f.sent();
                    currentPage++;
                    _f.label = 4;
                case 4:
                    if (done === false) return [3, 1];
                    _f.label = 5;
                case 5: return [2];
            }
        });
    }); };
    var put = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var endpoint, headers, body, params, init;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = options.endpoint, headers = options.headers, body = options.body, params = options.params, init = options.init;
                    return [4, makeRequest(endpoint, __assign({ method: 'PUT', headers: headers, body: body }, init), params)];
                case 1: return [2, _a.sent()];
            }
        });
    }); };
    var post = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var endpoint, headers, body, params, init;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = options.endpoint, headers = options.headers, body = options.body, params = options.params, init = options.init;
                    return [4, makeRequest(endpoint, __assign({ method: 'POST', headers: headers, body: body }, init), params)];
                case 1: return [2, _a.sent()];
            }
        });
    }); };
    var del = function (options) { return __awaiter(void 0, void 0, void 0, function () {
        var endpoint, headers, body, params, init;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpoint = options.endpoint, headers = options.headers, body = options.body, params = options.params, init = options.init;
                    return [4, makeRequest(endpoint, __assign({ method: 'DELETE', headers: headers, body: body }, init), params)];
                case 1: return [2, _a.sent()];
            }
        });
    }); };
    return {
        get: get,
        getPaginated: getPaginated,
        put: put,
        post: post,
        del: del,
        clientOptions: clientOptions,
    };
};
exports.createQuickApiClient = createQuickApiClient;
var buildQueryParams = function (clientOptions, queryParams) {
    if (!queryParams && !clientOptions.defaultQueryParams)
        return null;
    var allParams = __assign(__assign({}, clientOptions.defaultQueryParams), queryParams);
    var searchParams = new URLSearchParams();
    Object.keys(allParams).forEach(function (key) {
        var val = allParams[key];
        if (key.includes('[]')) {
            val.forEach(function (v) { return searchParams.append(key, v); });
        }
        else {
            searchParams.append(key, val);
        }
    });
    return searchParams.toString();
};
exports.buildQueryParams = buildQueryParams;
var buildRequestUrl = function (clientOptions, endpoint, queryParams) {
    var parts = [endpoint];
    if (clientOptions.baseUrl &&
        !endpoint.includes('http://') &&
        !endpoint.includes('https://')) {
        parts.unshift(clientOptions.baseUrl);
    }
    var urlString = parts
        .map(function (part) {
        var urlPart = part;
        var lastChar = urlPart.charAt(urlPart.length - 1);
        if (lastChar === '/') {
            urlPart = urlPart.slice(0, -1);
        }
        if (urlPart[0] === '/') {
            urlPart = urlPart.substring(1);
        }
        return urlPart;
    })
        .join('/');
    var queryString = (0, exports.buildQueryParams)(clientOptions, queryParams);
    if (queryString) {
        var urlLastChar = urlString[urlString.length - 1];
        if (urlLastChar !== '?' && urlLastChar !== '&') {
            if (urlString.includes('?')) {
                urlString += '&';
            }
            else {
                urlString += '?';
            }
        }
        urlString += queryString;
    }
    return new URL(urlString).toString();
};
exports.buildRequestUrl = buildRequestUrl;
exports.default = exports.createQuickApiClient;
