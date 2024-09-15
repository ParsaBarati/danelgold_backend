"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _signupdto = require("./dto/signup-dto");
const _common = require("@nestjs/common");
const _express = require("express");
const _authservice = require("./auth.service");
const _loginwithotpdto = require("./dto/login-with-otp.dto");
const _verifyotpdto = require("./dto/verify-otp.dto");
const _publicdecorator = require("../common/decorators/public.decorator");
const _loginwithpassworddto = require("./dto/login-with-password.dto");
const _resetpassworddto = require("./dto/reset-password.dto");
const _swagger = require("@nestjs/swagger");
const _tokenservice = require("./token/token.service");
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
let AuthController = class AuthController {
    loginWithOTP(phoneDTO) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.authService.loginWithOTP(phoneDTO);
        })();
    }
    verifyOtp(phoneDTO, req) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.authService.verifyWithOTP(phoneDTO, req);
        })();
    }
    loginUserWithPassword(phoneDTO, req) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.authService.loginUserWithPassword(phoneDTO, req);
        })();
    }
    forgetPasswordWithOTP(phoneDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const { phone } = phoneDto;
            return _this.authService.forgetPasswordWithOTP(phone);
        })();
    }
    resetPasswordWithOTP(resetPasswordDto) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.authService.resetPasswordWithOTP(resetPasswordDto);
        })();
    }
    signUp(req, signupDto) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.authService.signUpUsers(signupDto, req['userAgent'], req);
        })();
    }
    checkUser(phoneDto) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.authService.checkUser(phoneDto);
        })();
    }
    logout(req) {
        var _this = this;
        return _async_to_generator(function*() {
            const token = req.headers.authorization.split(' ')[1];
            yield _this.tokenService.deleteToken(token);
        })();
    }
    constructor(authService, tokenService){
        this.authService = authService;
        this.tokenService = tokenService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOkResponse)({
        description: 'با موفقیت ارسال شد',
        example: {
            result: 'number',
            statusCode: 200
        }
    }),
    (0, _publicdecorator.Public)(),
    (0, _common.Post)('otp'),
    (0, _common.HttpCode)(200),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _loginwithotpdto.PhoneDto === "undefined" ? Object : _loginwithotpdto.PhoneDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithOTP", null);
_ts_decorate([
    (0, _swagger.ApiCreatedResponse)({
        description: 'با موفقیت ساخته شد'
    }),
    (0, _swagger.ApiNotAcceptableResponse)({
        description: 'رمز یکبار مصرف اشتباه است'
    }),
    (0, _publicdecorator.Public)(),
    (0, _common.Post)('verify/otp'),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _verifyotpdto.VerifyOtpDto === "undefined" ? Object : _verifyotpdto.VerifyOtpDto,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
_ts_decorate([
    (0, _swagger.ApiOkResponse)({
        description: 'ok'
    }),
    (0, _swagger.ApiNotFoundResponse)({
        description: 'کاربر یافت نشد'
    }),
    (0, _swagger.ApiNotAcceptableResponse)({
        description: 'رمز عبور اشتباه است'
    }),
    (0, _publicdecorator.Public)(),
    (0, _common.Post)('login/password'),
    (0, _common.HttpCode)(200),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _loginwithpassworddto.LoginDto === "undefined" ? Object : _loginwithpassworddto.LoginDto,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "loginUserWithPassword", null);
_ts_decorate([
    (0, _publicdecorator.Public)(),
    (0, _common.Post)('forgot-password/otp'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _loginwithotpdto.PhoneDto === "undefined" ? Object : _loginwithotpdto.PhoneDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPasswordWithOTP", null);
_ts_decorate([
    (0, _publicdecorator.Public)(),
    (0, _common.Post)('reset-password/otp'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _resetpassworddto.ResetPasswordDto === "undefined" ? Object : _resetpassworddto.ResetPasswordDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "resetPasswordWithOTP", null);
_ts_decorate([
    (0, _swagger.ApiCreatedResponse)({
        description: 'ثبت نام با موفقیت انجام شد'
    }),
    (0, _swagger.ApiConflictResponse)({
        description: 'کاربر از قبل وجود دارد'
    }),
    (0, _publicdecorator.Public)(),
    (0, _common.Post)('signup'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _signupdto.SignupDto === "undefined" ? Object : _signupdto.SignupDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
_ts_decorate([
    (0, _publicdecorator.Public)(),
    (0, _common.Post)('check-phone'),
    (0, _common.HttpCode)(200),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _loginwithotpdto.PhoneDto === "undefined" ? Object : _loginwithotpdto.PhoneDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "checkUser", null);
_ts_decorate([
    (0, _common.Post)('logout'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('Auth'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService,
        typeof _tokenservice.TokenService === "undefined" ? Object : _tokenservice.TokenService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map