"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuctionsController", {
    enumerable: true,
    get: function() {
        return AuctionsController;
    }
});
const _common = require("@nestjs/common");
const _auctionservice = require("./auction.service");
const _UpdateAuctiondto = require("./dto/UpdateAuction.dto");
const _CreateAuctiondto = require("./dto/CreateAuction.dto");
const _swagger = require("@nestjs/swagger");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _userentity = require("../user/entity/user.entity");
const _ParticipateAuctiondto = require("./dto/ParticipateAuction.dto");
const _express = require("express");
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
let AuctionsController = class AuctionsController {
    create(createAuctionDto) {
        return this.auctionsService.createAuction(createAuctionDto);
    }
    participateAuction(auctionId, participateAuctionDto, req) {
        var _this = this;
        return _async_to_generator(function*() {
            const userPhone = req.user.result.phone;
            return _this.auctionsService.participateAuction(auctionId, participateAuctionDto, userPhone);
        })();
    }
    updateAuction(id, updateAuctionDto) {
        return this.auctionsService.updateAuction(id, updateAuctionDto);
    }
    remove(id) {
        return this.auctionsService.deleteAuction(id);
    }
    getAllAuctions(page, limit, search, sort, sortOrder) {
        const query = {
            page,
            limit,
            search,
            sort,
            sortOrder
        };
        return this.auctionsService.getAllAuctions(query);
    }
    getAuctionById(id) {
        return this.auctionsService.getAuctionById(id);
    }
    constructor(auctionsService){
        this.auctionsService = auctionsService;
    }
};
_ts_decorate([
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN),
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _CreateAuctiondto.CreateAuctionDto === "undefined" ? Object : _CreateAuctiondto.CreateAuctionDto
    ]),
    _ts_metadata("design:returntype", void 0)
], AuctionsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Post)('participate/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _ParticipateAuctiondto.ParticipateAuctionDto === "undefined" ? Object : _ParticipateAuctiondto.ParticipateAuctionDto,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], AuctionsController.prototype, "participateAuction", null);
_ts_decorate([
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN),
    (0, _common.Put)('/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _UpdateAuctiondto.UpdateAuctionDto === "undefined" ? Object : _UpdateAuctiondto.UpdateAuctionDto
    ]),
    _ts_metadata("design:returntype", void 0)
], AuctionsController.prototype, "updateAuction", null);
_ts_decorate([
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN),
    (0, _common.Delete)('/:id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], AuctionsController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Get)('all'),
    _ts_param(0, (0, _common.Query)('page', new _common.DefaultValuePipe(1), _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Query)('limit', new _common.DefaultValuePipe(10), _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Query)('search')),
    _ts_param(3, (0, _common.Query)('sortBy')),
    _ts_param(4, (0, _common.Query)('sortOrder')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AuctionsController.prototype, "getAllAuctions", null);
_ts_decorate([
    (0, _common.Get)('/:id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], AuctionsController.prototype, "getAuctionById", null);
AuctionsController = _ts_decorate([
    (0, _swagger.ApiTags)('Auction'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)('auctions'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _auctionservice.AuctionsService === "undefined" ? Object : _auctionservice.AuctionsService
    ])
], AuctionsController);

//# sourceMappingURL=auction.controller.js.map