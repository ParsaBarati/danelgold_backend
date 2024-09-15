"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CustomLogger", {
    enumerable: true,
    get: function() {
        return CustomLogger;
    }
});
const _common = require("@nestjs/common");
let CustomLogger = class CustomLogger extends _common.ConsoleLogger {
    log(message, context) {
        super.log(message, context);
    }
    error(message, trace, context) {
        super.error(message, trace, context);
    }
    warn(message, context) {
        super.warn(message, context);
    }
    debug(message, context) {
        super.debug(message, context);
    }
    verbose(message, context) {
        super.verbose(message, context);
    }
    constructor(context){
        super(context);
    }
};

//# sourceMappingURL=logger.service.js.map