"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SignupDto", {
    enumerable: true,
    get: function() {
        return SignupDto;
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
let SignupDto = class SignupDto {
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
], SignupDto.prototype, "phone", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsDefined)({
        message: 'First name is required'
    }),
    _ts_metadata("design:type", String)
], SignupDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsDefined)({
        message: 'Last name is required'
    }),
    _ts_metadata("design:type", String)
], SignupDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^(?=.*[A-Za-z])(?=.*\d).*$/, {
        message: 'Password must contain both letters and numbers'
    }),
    (0, _classvalidator.MinLength)(4, {
        message: 'Password must be at least 4 characters long'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsDefined)({
        message: 'Password is required'
    }),
    _ts_metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsDefined)({
        message: 'Last name is required'
    }),
    _ts_metadata("design:type", String)
], SignupDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], SignupDto.prototype, "createdAt", void 0);

//# sourceMappingURL=signup-dto.js.map