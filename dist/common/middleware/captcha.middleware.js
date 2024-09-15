"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CaptchaMiddleware", {
    enumerable: true,
    get: function() {
        return CaptchaMiddleware;
    }
});
const _common = require("@nestjs/common");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CaptchaMiddleware = class CaptchaMiddleware {
    use(req, res, next) {
        var _this = this;
        return _async_to_generator(function*() {
            console.log('Request...');
            const token = req.body['arcaptcha-token'];
            console.log(`Received CAPTCHA token: ${token}`);
            if (!token) {
                throw new _common.BadRequestException('خطای کپچا');
            }
            const verificationResult = yield _this.verifyCaptcha(token);
            if (!verificationResult.success) {
                throw new _common.BadRequestException('خطای حل کپچا');
            }
            next();
        })();
    }
    verifyCaptcha(token) {
        return _async_to_generator(function*() {
            const secretKey = process.env.CAPTCHA_SECRET_KEY;
            const siteKey = process.env.CAPTCHA_SITE_KEY;
            const verifyUrl = 'https://api.arcaptcha.co/arcaptcha/api/verify';
            const data = {
                secret_key: secretKey,
                challenge_id: token,
                site_key: siteKey
            };
            const response = yield _axios.default.post(verifyUrl, data);
            const responseData = response.data;
            console.log(`responseData >>>>>>> ${JSON.stringify(responseData)}`);
            if (responseData.success) {
                return {
                    success: true,
                    score: responseData.score
                };
            } else {
                return {
                    success: false,
                    score: responseData.score
                };
            }
        })();
    }
};
CaptchaMiddleware = _ts_decorate([
    (0, _common.Injectable)()
], CaptchaMiddleware);

//# sourceMappingURL=captcha.middleware.js.map