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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
    mintNFT(file, mintNFTDto, req) {
        var _this = this;
        return _async_to_generator(function*() {
            const creatorPhone = req.user.result.phone;
            const imageURL = yield _this.ipfsService.uploadToIPFS(file.buffer);
            // Create an updated MintNFTDto with the URL
            const updatedMintNFTDto = _object_spread_props(_object_spread({}, mintNFTDto), {
                imageURL
            });
            return yield _this.nftsService.mintNFT(updatedMintNFTDto, creatorPhone);
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
    (0, _swagger.ApiOperation)({
        summary: 'Mint a new NFT'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'The NFT has been successfully minted.'
    }),
    _ts_param(0, (0, _common.UploadedFile)(new _common.ParseFilePipeBuilder().addMaxSizeValidator({
        maxSize: 5 * 1024 * 1024
    }).addFileTypeValidator({
        fileType: 'image/jpeg,image/png,image/webp,image/svg+xml'
    }).build({
        errorHttpStatusCode: _common.HttpStatus.UNPROCESSABLE_ENTITY
    }))),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File,
        typeof _MintNFTdto.MintNFTDto === "undefined" ? Object : _MintNFTdto.MintNFTDto,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], NFTsController.prototype, "mintNFT", null);
_ts_decorate([
    (0, _common.Delete)('/:nftId'),
    _ts_param(0, (0, _common.Param)('nftId', _common.ParseIntPipe)),
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
    _ts_param(0, (0, _common.Param)('nftId', _common.ParseIntPipe)),
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