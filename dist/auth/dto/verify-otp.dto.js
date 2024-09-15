"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "VerifyOtpDto", {
    enumerable: true,
    get: function() {
        return VerifyOtpDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let VerifyOtpDto = class VerifyOtpDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^09\d{9}$/, {
        message: 'Invalid phone format'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsDefined)({
        message: 'Phone is required'
    }),
    _ts_metadata("design:type", String)
], VerifyOtpDto.prototype, "phone", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsDefined)({
        message: 'OTP is required'
    }),
    _ts_metadata("design:type", String)
], VerifyOtpDto.prototype, "otp", void 0);

//# sourceMappingURL=verify-otp.dto.js.map