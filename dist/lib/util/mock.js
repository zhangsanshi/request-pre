"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addMock(requestInfo) {
    var config = requestInfo.config, mock = requestInfo.mock;
    var mockStatus = config && config.mock;
    var mockInfo = mockStatus && mock && mock[mockStatus];
    if (mockInfo) {
        return new Promise(function (res, rej) {
            var action = mockInfo.success ? res : rej;
            action(typeof mockInfo.data === 'function' ? mockInfo.data(config) : mockInfo.data);
        });
    }
}
exports.default = addMock;
