"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TokenService", {
    enumerable: true,
    get: function() {
        return TokenService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _tokenentity = require("./entity/token.entity");
const _jwt = require("@nestjs/jwt");
const _userentity = require("../../user/entity/user.entity");
const _responseutil = require("../../utils/response.util");
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
let TokenService = class TokenService {
    createToken(user) {
        var _this = this;
        return _async_to_generator(function*() {
            const isUser = user.role.includes('user');
            const isAdmin = user.role.includes('admin');
            if (isUser) {
                const activeTokenCount = yield _this.tokenRepository.createQueryBuilder('token').where('token.userPhone = :userPhone', {
                    userPhone: user.phone
                }).getCount();
                if (activeTokenCount >= _this.maxSessionsPerUser) {
                    yield _this.tokenRepository.createQueryBuilder('token').delete().where('userPhone = :userPhone', {
                        userPhone: user.phone
                    }).execute();
                }
            }
            const payload = {
                sub: user.phone,
                phone: user.phone,
                roles: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            };
            const token = _this.jwtService.sign(payload);
            const tokenEntity = new _tokenentity.Token();
            tokenEntity.token = token;
            tokenEntity.createdAt = new Date();
            tokenEntity.user = user;
            yield _this.tokenRepository.save(tokenEntity);
            return token;
        })();
    }
    deleteToken(token) {
        var _this = this;
        return _async_to_generator(function*() {
            yield _this.tokenRepository.delete({
                token
            });
        })();
    }
    validateToken(token) {
        var _this = this;
        return _async_to_generator(function*() {
            const tokenEntity = yield _this.tokenRepository.findOne({
                where: {
                    token
                }
            });
            return !!tokenEntity;
        })();
    }
    getMaxSessionsPerUser() {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.maxSessionsPerUser;
        })();
    }
    getTokensByPhone(phone) {
        var _this = this;
        return _async_to_generator(function*() {
            const user = yield _this.userRepository.findOneBy({
                phone: phone
            });
            if (!user) {
                throw new _common.NotFoundException('کاربر پیدا نشد!');
            }
            const tokens = yield _this.tokenRepository.find();
            return (0, _responseutil.createResponse)(200, tokens);
        })();
    }
    constructor(userRepository, tokenRepository, jwtService){
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.jwtService = jwtService;
        this.maxSessionsPerUser = 1;
    }
};
TokenService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_tokenentity.Token)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], TokenService);

//# sourceMappingURL=token.service.js.map