"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtAuthGuard", {
    enumerable: true,
    get: function() {
        return JwtAuthGuard;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _passport = require("@nestjs/passport");
const _publicdecorator = require("../../common/decorators/public.decorator");
const _rxjs = require("rxjs");
const _tokenservice = require("../token/token.service");
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
let JwtAuthGuard = class JwtAuthGuard extends (0, _passport.AuthGuard)('jwt') {
    canActivate(context) {
        var _this = this, _superprop_get_canActivate = ()=>super.canActivate;
        return _async_to_generator(function*() {
            const isPublic = _this.reflector.getAllAndOverride(_publicdecorator.IS_PUBLIC_KEY, [
                context.getHandler(),
                context.getClass()
            ]);
            if (isPublic) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers.authorization;
            if (!authHeader) {
                throw new _common.UnauthorizedException('Authorization header is missing');
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new _common.UnauthorizedException('Token is missing');
            }
            const isValid = yield _this.tokenService.validateToken(token);
            if (!isValid) {
                throw new _common.ConflictException('Invalid token');
            }
            // Convert Observable to Promise and resolve it to boolean
            const superCanActivate = _superprop_get_canActivate().call(_this, context);
            if (superCanActivate instanceof _rxjs.Observable) {
                return superCanActivate.toPromise().then((result)=>!!result);
            }
            return superCanActivate;
        })();
    }
    constructor(reflector, tokenService){
        super(), this.reflector = reflector, this.tokenService = tokenService;
    }
};
JwtAuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector,
        typeof _tokenservice.TokenService === "undefined" ? Object : _tokenservice.TokenService
    ])
], JwtAuthGuard);

//# sourceMappingURL=jwt.guard.js.map