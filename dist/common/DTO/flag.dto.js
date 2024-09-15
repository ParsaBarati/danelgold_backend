"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FlagDto", {
    enumerable: true,
    get: function() {
        return FlagDto;
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
let FlagDto = class FlagDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: [
            Number
        ],
        description: 'Array of course IDs to be flagged'
    }),
    (0, _classvalidator.IsArray)({
        message: 'داده ها باید به صورت آرایه باشند'
    }),
    (0, _classvalidator.ArrayNotEmpty)({
        message: 'وارد کردن شناسه اجباری می باشد'
    }),
    (0, _classvalidator.ArrayMinSize)(1, {
        message: 'شناسه باید حداقل شامل یک عدد باشد'
    }),
    (0, _classvalidator.IsInt)({
        each: true,
        message: 'شناسه را به صورت عدد وارد نمایید'
    }),
    _ts_metadata("design:type", Array)
], FlagDto.prototype, "flagItemId", void 0);

//# sourceMappingURL=flag.dto.js.map