"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OtpModule", {
    enumerable: true,
    get: function() {
        return OtpModule;
    }
});
const _common = require("@nestjs/common");
const _otpcontroller = require("./otp.controller");
const _otpservice = require("./otp.service");
const _typeorm = require("@nestjs/typeorm");
const _otpentity = require("./entity/otp.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OtpModule = class OtpModule {
};
OtpModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _otpentity.OTP
            ])
        ],
        controllers: [
            _otpcontroller.OtpController
        ],
        providers: [
            _otpservice.OtpService
        ],
        exports: [
            _otpservice.OtpService,
            _typeorm.TypeOrmModule
        ]
    })
], OtpModule);

//# sourceMappingURL=otp.module.js.map