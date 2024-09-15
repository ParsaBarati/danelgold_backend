"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthMiddleware", {
    enumerable: true,
    get: function() {
        return AuthMiddleware;
    }
});
const _common = require("@nestjs/common");
const _tokenservice = require("../../auth/token/token.service");
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
let AuthMiddleware = class AuthMiddleware {
    use(req, res, next) {
        var _this = this;
        return _async_to_generator(function*() {
            var _req_headers_authorization;
            const token = (_req_headers_authorization = req.headers.authorization) === null || _req_headers_authorization === void 0 ? void 0 : _req_headers_authorization.split('Bearer ')[1];
            if (!token) {
                throw new _common.NotAcceptableException('Token is required');
            }
            const isValid = yield _this.tokenService.validateToken(token);
            if (!isValid) {
                throw new _common.NotAcceptableException('Invalid or expired token');
            }
            yield _this.tokenService.createToken(req.user);
            next();
        })();
    }
    constructor(tokenService){
        this.tokenService = tokenService;
    }
};
AuthMiddleware = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tokenservice.TokenService === "undefined" ? Object : _tokenservice.TokenService
    ])
], AuthMiddleware);

//# sourceMappingURL=token-limit.middleware.js.map