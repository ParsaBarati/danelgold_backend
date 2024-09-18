"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    MintNFTDataDto: function() {
        return MintNFTDataDto;
    },
    MintNFTDto: function() {
        return MintNFTDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _classvalidator = require("class-validator");
const _nestjsformdata = require("nestjs-form-data");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MintNFTDto = class MintNFTDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: 'string',
        format: 'binary',
        required: true
    }),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _nestjsformdata.IsFile)(),
    (0, _nestjsformdata.HasMimeType)([
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml'
    ]),
    _ts_metadata("design:type", typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File)
], MintNFTDto.prototype, "imageURL", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], MintNFTDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], MintNFTDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsInt)(),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], MintNFTDto.prototype, "price", void 0);
let MintNFTDataDto = class MintNFTDataDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], MintNFTDataDto.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], MintNFTDataDto.prototype, "description", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    (0, _classvalidator.IsInt)(),
    (0, _classtransformer.Type)(()=>Number),
    _ts_metadata("design:type", Number)
], MintNFTDataDto.prototype, "price", void 0);

//# sourceMappingURL=MintNFT.dto.js.map