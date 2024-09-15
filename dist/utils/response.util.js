"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createResponse", {
    enumerable: true,
    get: function() {
        return createResponse;
    }
});
function createResponse(statusCode, result, message) {
    return {
        message,
        result,
        statusCode
    };
}

//# sourceMappingURL=response.util.js.map