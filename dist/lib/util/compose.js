"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(middlewareList) {
    return function (ctx, next) {
        var index = -1;
        var dispatch = function (i) {
            if (i <= index) {
                return Promise.reject(new Error('next() called multiple times'));
            }
            index = i;
            var fn = middlewareList[i];
            if (i === middlewareList.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve(ctx);
            }
            else {
                return Promise.resolve(fn(ctx, fn === next ? undefined : dispatch.bind(null, i + 1)));
            }
        };
        return dispatch(0);
    };
}
exports.default = default_1;
