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
const _UpdateNFTdto = require("./dto/UpdateNFT.dto");
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
    MintNFT(req, mintNFTDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const creatorPhone = req.user.result.phone;
            return yield _this.nftsService.mintNFT(mintNFTDto, creatorPhone);
        })();
    }
    updateMint(nftId, req, updateNFTDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const currentOwnerPhone = req.user.result.phone;
            const currentUserRoles = req.user.result.role;
            return yield _this.nftsService.updateNFT(nftId, updateNFTDto, currentOwnerPhone, currentUserRoles);
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
    constructor(nftsService){
        this.nftsService = nftsService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _MintNFTdto.MintNFTDto === "undefined" ? Object : _MintNFTdto.MintNFTDto
    ]),
    _ts_metadata("design:returntype", Promise)
], NFTsController.prototype, "MintNFT", null);
_ts_decorate([
    (0, _common.Put)('/:id'),
    _ts_param(0, (0, _common.Param)('nftId', _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _UpdateNFTdto.UpdateNFTDto === "undefined" ? Object : _UpdateNFTdto.UpdateNFTDto
    ]),
    _ts_metadata("design:returntype", Promise)
], NFTsController.prototype, "updateMint", null);
_ts_decorate([
    (0, _common.Delete)('/:id'),
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
    (0, _common.Get)('/:id'),
    _ts_param(0, (0, _common.Param)('nftId', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], NFTsController.prototype, "getNFTById", null);
NFTsController = _ts_decorate([
    (0, _common.Controller)('nft'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nftservice.NFTsService === "undefined" ? Object : _nftservice.NFTsService
    ])
], NFTsController);

//# sourceMappingURL=nft.controller.js.map