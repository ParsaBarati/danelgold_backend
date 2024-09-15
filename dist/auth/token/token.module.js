// src/auth/token/token.module.ts
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TokenModule", {
    enumerable: true,
    get: function() {
        return TokenModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _tokenentity = require("./entity/token.entity");
const _config = require("@nestjs/config");
const _jwt = require("@nestjs/jwt");
const _tokenservice = require("./token.service");
const _jwtstrategy = require("../strategy/jwt.strategy");
const _usermodule = require("../../user/user.module");
const _controllertoken = require("./controller.token");
const _userentity = require("../../user/entity/user.entity");
const _userservice = require("../../user/user.service");
const _smsservice = require("../../services/sms.service");
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
let TokenModule = class TokenModule {
};
TokenModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _usermodule.UserModule,
            _typeorm.TypeOrmModule.forFeature([
                _tokenentity.Token,
                _userentity.User
            ]),
            _config.ConfigModule,
            _jwt.JwtModule.registerAsync({
                imports: [
                    _config.ConfigModule
                ],
                inject: [
                    _config.ConfigService
                ],
                useFactory: /*#__PURE__*/ function() {
                    var _ref = _async_to_generator(function*(configService) {
                        return {
                            secret: configService.get('JWT_SECRET'),
                            signOptions: {
                                expiresIn: '7d'
                            }
                        };
                    });
                    return function(configService) {
                        return _ref.apply(this, arguments);
                    };
                }()
            })
        ],
        controllers: [
            _controllertoken.TokenController
        ],
        providers: [
            _tokenservice.TokenService,
            _userservice.UserService,
            _smsservice.SmsService,
            _jwtstrategy.JwtStrategy
        ],
        exports: [
            _tokenservice.TokenService
        ]
    })
], TokenModule);

//# sourceMappingURL=token.module.js.map