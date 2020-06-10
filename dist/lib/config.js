"use strict";
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
exports.SKIP_REQUEST = exports.SKIP_NEXT = void 0;
exports.SKIP_NEXT = {};
exports.SKIP_REQUEST = {};
function getConfig(config, configMap, defaultPriority) {
    var priority = config.priority;
    var targetConfig = Object.keys(config).filter(function (configName) {
        return configName !== 'priority' && configMap.has(configName);
    });
    if (priority) {
        targetConfig = targetConfig.sort(function (a, b) {
            function formatPriority(num) {
                return (typeof priority[num] === 'number') ? priority[num] : defaultPriority;
            }
            return formatPriority(a) - formatPriority(b);
        });
    }
    return targetConfig.map(function (configName) {
        var handler = configMap.get(configName);
        var resolve;
        var reject;
        if (handler) {
            resolve = ('resolve' in handler) ? handler === null || handler === void 0 ? void 0 : handler.resolve : handler;
            reject = ('reject' in handler) ? handler.reject : undefined;
        }
        return {
            params: config[configName],
            resolve: resolve,
            reject: reject,
        };
    });
}
exports.default = {
    pre: function (config, configMap, initData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (config) {
                    return [2 /*return*/, getConfig(config, configMap, 50).reduce(function (pre, configHandler) {
                            return pre.then(function (prevData) {
                                if (configHandler.resolve) {
                                    return configHandler.resolve(initData, configHandler.params, prevData);
                                }
                                return prevData;
                            }, function (error) {
                                if (configHandler.reject) {
                                    return configHandler.reject(initData, configHandler.params, error);
                                }
                                return Promise.reject(error);
                            });
                        }, Promise.resolve(initData))];
                }
                return [2 /*return*/, initData];
            });
        });
    },
    post: function (config, configMap, initData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (config) {
                    return [2 /*return*/, getConfig(config, configMap, 50).reduce(function (pre, configHandler) {
                            return pre.then(function (prevData) {
                                if (configHandler.resolve) {
                                    return configHandler.resolve(prevData, configHandler.params, initData);
                                }
                                return prevData;
                            }, function (error) {
                                if (configHandler.reject) {
                                    return configHandler.reject(error, configHandler.params, initData);
                                }
                                return Promise.reject(error);
                            });
                        }, Promise.resolve(initData))];
                }
                return [2 /*return*/, initData];
            });
        });
    }
};
