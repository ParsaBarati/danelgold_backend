"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdateUserDTO", {
    enumerable: true,
    get: function() {
        return UpdateUserDTO;
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
let UpdateUserDTO = class UpdateUserDTO {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^[آ-ی ]*$/, {
        message: 'نام خود را فارسی وارد کنید'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDTO.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^[آ-ی ]*$/, {
        message: 'نام خانوادگی خود را فارسی وارد کنید'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDTO.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^09\d{9}$/, {
        message: 'فرمت شماره همراه صحیح نیست'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'شماره همراه اجباری است'
    }),
    _ts_metadata("design:type", String)
], UpdateUserDTO.prototype, "phone", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^(?=.*[A-Za-z])(?=.*\d).*$/, {
        message: 'لطفا ترکیبی از حروف و اعداد وارد کنید'
    }),
    (0, _classvalidator.MinLength)(4, {
        message: 'لطفا ترکیبی از حروف و اعداد وارد کنید'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDTO.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _userentity.UserRole
    }),
    (0, _classvalidator.IsEnum)(_userentity.UserRole, {
        message: ''
    }),
    _ts_metadata("design:type", typeof _userentity.UserRole === "undefined" ? Object : _userentity.UserRole)
], UpdateUserDTO.prototype, "roles", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)({
        message: 'عکس را درست انتخاب کنید'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDTO.prototype, "imageUrl", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDTO.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsNumber)({}, {
        message: 'لطفا شناسه آزمون را به عدد وارد کنید'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'ساخت شناسه آزمون اجباری است'
    }),
    _ts_metadata("design:type", Number)
], UpdateUserDTO.prototype, "skuTest", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)({
        message: 'پارامتر ارسالی صحیح نیست'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDTO.prototype, "field", void 0);

//# sourceMappingURL=update-user.dto.js.map