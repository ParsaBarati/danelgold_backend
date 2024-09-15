"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SmsService", {
    enumerable: true,
    get: function() {
        return SmsService;
    }
});
const _common = require("@nestjs/common");
const _kavenegar = /*#__PURE__*/ _interop_require_wildcard(require("kavenegar"));
const _dotenv = /*#__PURE__*/ _interop_require_wildcard(require("dotenv"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
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
_dotenv.config();
let SmsService = class SmsService {
    sendSMS(phones, smsText) {
        var _this = this;
        return _async_to_generator(function*() {
            const sender = '10004400064000';
            const phoneNumbers = Array.isArray(phones) ? phones : [
                phones
            ];
            const batchSize = 200;
            const totalNumbers = phoneNumbers.length;
            let currentIndex = 0;
            while(currentIndex < totalNumbers){
                const batchNumbers = phoneNumbers.slice(currentIndex, currentIndex + batchSize);
                const receptor = batchNumbers.join(',');
                // const kavenegarUrl = `https://api.kavenegar.com/v1/${process.env.KAVENEGAR_API_KEY}/sms/send.json?receptor=${receptor}&sender=${sender}&message=${smsText}`;
                // const response = await axios.get(kavenegarUrl);
                _this.logger.log(`SMS >>> ${receptor}`);
                currentIndex += batchSize;
            }
        })();
    }
    sendSignUpSMS(phones, username, pass) {
        var _this = this;
        return _async_to_generator(function*() {
            const phoneNumbers = Array.isArray(phones) ? phones : [
                phones
            ];
            const batchSize = 200;
            const totalNumbers = phoneNumbers.length;
            const OtpApi = _kavenegar.KavenegarApi({
                apikey: process.env.KAVENEGAR_API_KEY
            });
            let currentIndex = 0;
            while(currentIndex < totalNumbers){
                const batchNumbers = phoneNumbers.slice(currentIndex, currentIndex + batchSize);
                yield Promise.all(batchNumbers.map((phone)=>{
                    return new Promise((resolve, reject)=>{
                        OtpApi.VerifyLookup({
                            receptor: phone,
                            token: username,
                            token2: pass,
                            template: 'sendSignup'
                        }, (response, status)=>{
                            if (status === 200) {
                                _this.logger.log(`Message sent to ${phone} with status: ${status}`);
                                resolve(response);
                            } else {
                                _this.logger.error(`Failed to send message to ${phone} with status: ${status}`);
                                reject(new Error(`Failed with status: ${status}`));
                            }
                        });
                    });
                }));
                currentIndex += batchSize;
            }
        })();
    }
    sendClassTimeSMS(phones, smsText) {
        var _this = this;
        return _async_to_generator(function*() {
            const phoneNumbers = Array.isArray(phones) ? phones : [
                phones
            ];
            const batchSize = 200;
            const totalNumbers = phoneNumbers.length;
            const OtpApi = _kavenegar.KavenegarApi({
                apikey: process.env.KAVENEGAR_API_KEY
            });
            let currentIndex = 0;
            while(currentIndex < totalNumbers){
                const batchNumbers = phoneNumbers.slice(currentIndex, currentIndex + batchSize);
                yield Promise.all(batchNumbers.map((phone)=>{
                    return new Promise((resolve, reject)=>{
                        const options = {
                            receptor: phone,
                            token: '.',
                            token20: smsText,
                            template: 'classTime'
                        };
                        OtpApi.VerifyLookup(options, (response, status)=>{
                            if (status === 200) {
                                _this.logger.log(`Message sent to ${phone} with status: ${status}`);
                                resolve(response);
                            } else {
                                _this.logger.error(`Failed to send message to ${phone} with status: ${status}`);
                                reject(new Error(`Failed with status: ${status}`));
                            }
                        });
                    });
                }));
                currentIndex += batchSize;
            }
        })();
    }
    constructor(){
        this.logger = new _common.Logger(SmsService.name);
    }
};
SmsService = _ts_decorate([
    (0, _common.Injectable)()
], SmsService);

//# sourceMappingURL=sms.service.js.map