// src/logger/my-logger.service.ts
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MyLogger", {
    enumerable: true,
    get: function() {
        return MyLogger;
    }
});
const _common = require("@nestjs/common");
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MyLogger = class MyLogger {
    log(message, ...optionalParams) {
        this.writeLog('LOG', message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        this.writeLog('ERROR', message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        this.writeLog('WARN', message, ...optionalParams);
    }
    debug(message, ...optionalParams) {
        this.writeLog('DEBUG', message, ...optionalParams);
    }
    verbose(message, ...optionalParams) {
        this.writeLog('VERBOSE', message, ...optionalParams);
    }
    fatal(message, ...optionalParams) {
        this.writeLog('FATAL', message, ...optionalParams);
    }
    writeLog(level, message, ...optionalParams) {
        const formattedMessage = this.formatLog(level, message, ...optionalParams);
        console.log(formattedMessage);
        this.appendLogToFile(formattedMessage);
    }
    formatLog(level, message, ...optionalParams) {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${level}] ${message} ${optionalParams.join(' ')}`;
    }
    appendLogToFile(message) {
        _fs.appendFile(this.logFilePath, message + '\n', (err)=>{
            if (err) {
                console.error('Failed to write log to file:', err);
            }
        });
    }
    constructor(){
        this.logFilePath = _path.join(__dirname, '../logs/app.log');
    }
};
MyLogger = _ts_decorate([
    (0, _common.Injectable)()
], MyLogger);

//# sourceMappingURL=custom-logger-write.service.js.map