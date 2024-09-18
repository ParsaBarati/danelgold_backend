"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NFTsController", {
    enumerable: true,
    get: function() {
        return NFTsController;
    }
});
const _common = require("@nestjs/common");
const _nftservice = require("./nft.service");
const _MintNFTdto = require("./dto/MintNFT.dto");
const _express = require("express");
const _swagger = require("@nestjs/swagger");
const _platformexpress = require("@nestjs/platform-express");
const _IPFSservice = require("../services/IPFS.service");
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
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let NFTsController = class NFTsController {
    mintNFT(imageURL, mintNFTDataDto, req) {
        var _this = this;
        return _async_to_generator(function*() {
            const creatorPhone = req.user.result.phone;
            const NFTImageURL = yield _this.ipfsService.uploadFileToIPFS(imageURL);
            return yield _this.nftsService.mintNFT(creatorPhone, mintNFTDataDto.name, mintNFTDataDto.price, NFTImageURL, mintNFTDataDto.description);
        })();
    }
    burnNFT(nftId, req) {
        var _this = this;
        return _async_to_generator(function*() {
            const currentOwnerPhone = req.user.result.phone;
            const currentUserRoles = req.user.result.role;
            return yield _this.nftsService.burnNFT(nftId, currentOwnerPhone, currentUserRoles);
        })();
    }
    getNFTById(nftId) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.nftsService.getNFTById(nftId);
        })();
    }
    constructor(nftsService, ipfsService){
        this.nftsService = nftsService;
        this.ipfsService = ipfsService;
    }
};
_ts_decorate([
    (0, _common.Post)('mint'),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _swagger.ApiBody)({
        type: _MintNFTdto.MintNFTDto
    }),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('imageURL')),
    (0, _common.UsePipes)(new _common.ValidationPipe({
        transform: true
    })),
    _ts_param(0, (0, _common.UploadedFile)(new _common.ParseFilePipeBuilder().build({
        errorHttpStatusCode: _common.HttpStatus.UNPROCESSABLE_ENTITY
    }))),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File,
        typeof _MintNFTdto.MintNFTDataDto === "undefined" ? Object : _MintNFTdto.MintNFTDataDto,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], NFTsController.prototype, "mintNFT", null);
_ts_decorate([
    (0, _common.Delete)('/:nftId'),
    _ts_param(0, (0, _common.Param)('nftId')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], NFTsController.prototype, "burnNFT", null);
_ts_decorate([
    (0, _common.Get)('/:nftId'),
    _ts_param(0, (0, _common.Param)('nftId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], NFTsController.prototype, "getNFTById", null);
NFTsController = _ts_decorate([
    (0, _swagger.ApiTags)('NFT'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)('nft'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nftservice.NFTsService === "undefined" ? Object : _nftservice.NFTsService,
        typeof _IPFSservice.IPFSService === "undefined" ? Object : _IPFSservice.IPFSService
    ])
], NFTsController);

//# sourceMappingURL=nft.controller.js.map