"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _authcontroller = require("./auth.controller");
const _common = require("@nestjs/common");
const _authservice = require("./auth.service");
const _passport = require("@nestjs/passport");
const _userservice = require("../user/user.service");
const _jwtstrategy = require("./strategy/jwt.strategy");
const _otpservice = require("./otp/otp.service");
const _usermodule = require("../user/user.module");
const _otpmodule = require("./otp/otp.module");
const _userDetailservice = require("../user-detail/userDetail.service");
const _tokenmodule = require("./token/token.module");
const _typeorm = require("@nestjs/typeorm");
const _userentity = require("../user/entity/user.entity");
const _userDetailentity = require("../user-detail/entity/userDetail.entity");
const _tokenentity = require("./token/entity/token.entity");
const _smsservice = require("../services/sms.service");
const _pagitnateservice = require("../common/paginate/pagitnate.service");
const _config = require("@nestjs/config");
const _jwtguard = require("./guards/jwt.guard");
const _rolesguard = require("./guards/roles.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _userentity.User,
                _userDetailentity.UserDetail,
                _tokenentity.Token
            ]),
            _passport.PassportModule,
            _usermodule.UserModule,
            _otpmodule.OtpModule,
            _tokenmodule.TokenModule,
            _config.ConfigModule
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _jwtstrategy.JwtStrategy,
            _jwtguard.JwtAuthGuard,
            _authservice.AuthService,
            _userservice.UserService,
            _otpservice.OtpService,
            _rolesguard.RolesGuard,
            _userDetailservice.UserDetailService,
            _smsservice.SmsService,
            _pagitnateservice.PaginationService
        ],
        exports: [
            _jwtstrategy.JwtStrategy,
            _passport.PassportModule
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map