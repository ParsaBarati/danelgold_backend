"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateUserByAdminDTO", {
    enumerable: true,
    get: function() {
        return CreateUserByAdminDTO;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
const _userentity = require("../entity/user.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateUserByAdminDTO = class CreateUserByAdminDTO {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^[آ-ی ]*$/, {
        message: 'نام خود را فارسی وارد کنید'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'نام اجباری است'
    }),
    _ts_metadata("design:type", String)
], CreateUserByAdminDTO.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^[آ-ی ]*$/, {
        message: 'نام خانوادگی خود را فارسی وارد کنید'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'نام خانوادگی اجباری است'
    }),
    _ts_metadata("design:type", String)
], CreateUserByAdminDTO.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^09\d{9}$/, {
        message: 'فرمت شماره همراه صحیح نیست'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'فرمت شماره همراه صحیح نیست'
    }),
    _ts_metadata("design:type", String)
], CreateUserByAdminDTO.prototype, "phone", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^(?=.*[A-Za-z])(?=.*\d).*$/, {
        message: 'لطفا ترکیبی از حروف و اعداد وارد کنید'
    }),
    (0, _classvalidator.MinLength)(4, {
        message: 'لطفا ترکیبی از حروف و اعداد وارد کنید'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'لطفا ترکیبی از حروف و اعداد وارد کنید'
    }),
    _ts_metadata("design:type", String)
], CreateUserByAdminDTO.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _userentity.UserRole
    }),
    (0, _classvalidator.IsEnum)(_userentity.UserRole, {
        message: ''
    }),
    _ts_metadata("design:type", typeof _userentity.UserRole === "undefined" ? Object : _userentity.UserRole)
], CreateUserByAdminDTO.prototype, "roles", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateUserByAdminDTO.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsNumber)({}, {
        message: 'لطفا شناسه آزمون را وارد کنید'
    }),
    _ts_metadata("design:type", Number)
], CreateUserByAdminDTO.prototype, "skuTest", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsBoolean)({
        message: 'پارامتر پیامک را مشخص کنید'
    }),
    _ts_metadata("design:type", Boolean)
], CreateUserByAdminDTO.prototype, "isSms", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)({
        message: 'لطفا رشته تحصیلی را وارد کنید'
    }),
    _ts_metadata("design:type", String)
], CreateUserByAdminDTO.prototype, "field", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CreateUserByAdminDTO.prototype, "createdAt", void 0);

//# sourceMappingURL=create-user.dto.js.map