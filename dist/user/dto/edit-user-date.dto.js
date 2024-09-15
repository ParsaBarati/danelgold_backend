"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "editDateUser", {
    enumerable: true,
    get: function() {
        return editDateUser;
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
let editDateUser = class editDateUser {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^[آ-ی ]*$/, {
        message: 'نام خود را فارسی وارد کنید'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], editDateUser.prototype, "firstName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^[آ-ی ]*$/, {
        message: 'نام خانوادگی خود را فارسی وارد کنید'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], editDateUser.prototype, "lastName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.Matches)(/^09\d{9}$/, {
        message: 'فرمت شماره همراه صحیح نیست'
    }),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], editDateUser.prototype, "phone", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)({
        message: 'عکس را درست انتخاب کنید'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], editDateUser.prototype, "imageUrl", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], editDateUser.prototype, "email", void 0);

//# sourceMappingURL=edit-user-date.dto.js.map