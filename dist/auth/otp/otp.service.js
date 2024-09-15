"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OtpService", {
    enumerable: true,
    get: function() {
        return OtpService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _bcryptjs = /*#__PURE__*/ _interop_require_wildcard(require("bcryptjs"));
const _otputils = require("../../common/utils/otp.utils");
const _authutils = require("../../common/utils/auth.utils");
const _otpentity = require("./entity/otp.entity");
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
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const OTP_EXPIRATION_TIME_MS = 60 * 1000; // 60 seconds
let OtpService = class OtpService {
    sendOTP(phone) {
        var _this = this;
        return _async_to_generator(function*() {
            let otp;
            const existingOTP = yield _this.otpRepository.findOne({
                where: {
                    phone
                }
            });
            otp = (0, _otputils.generateNumericOTP)(5).toString();
            console.log(`Generated OTP: ${otp}`);
            yield (0, _authutils.sendOTPSMS)(phone, otp);
            if (existingOTP) {
                existingOTP.otp = yield _bcryptjs.hash(otp, 10);
                existingOTP.isVerified = false;
                existingOTP.createdAt = new Date();
                existingOTP.expirationTime = new Date(Date.now() + OTP_EXPIRATION_TIME_MS);
                yield _this.otpRepository.save(existingOTP);
            } else {
                const hashedOTP = yield _bcryptjs.hash(otp, 10);
                const expirationTime = new Date(Date.now() + OTP_EXPIRATION_TIME_MS);
                const newOTP = _this.otpRepository.create({
                    phone,
                    otp: hashedOTP,
                    expirationTime,
                    createdAt: new Date()
                });
                yield _this.otpRepository.save(newOTP);
            }
            return otp;
        })();
    }
    verifyOTP(phone, otp) {
        var _this = this;
        return _async_to_generator(function*() {
            const otpRecord = yield _this.otpRepository.findOne({
                where: {
                    phone
                }
            });
            if (!otpRecord) {
                console.log('No OTP record found for the phone.');
                return false;
            }
            const currentTime = Date.now();
            const otpTimestamp = otpRecord.createdAt.getTime();
            const otpExpirationTime = OTP_EXPIRATION_TIME_MS;
            if (currentTime - otpTimestamp > otpExpirationTime) {
                console.log('OTP has expired.');
                throw new _common.BadRequestException('زمان رمز یکبار مصرف منقضی شده است');
            }
            const isValidOTP = yield _bcryptjs.compare(otp, otpRecord.otp);
            console.log(`isValidOTP VERIFY: ${isValidOTP}`);
            if (isValidOTP) {
                yield _this.otpRepository.createQueryBuilder().update(_otpentity.OTP).set({
                    isVerified: true
                }).where('phone = :phone', {
                    phone
                }).execute();
            }
            return isValidOTP;
        })();
    }
    constructor(otpRepository){
        this.otpRepository = otpRepository;
    }
};
OtpService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_otpentity.OTP)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], OtpService);

//# sourceMappingURL=otp.service.js.map