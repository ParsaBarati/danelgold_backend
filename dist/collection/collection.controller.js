"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CollectionsController", {
    enumerable: true,
    get: function() {
        return CollectionsController;
    }
});
const _common = require("@nestjs/common");
const _collectionservice = require("./collection.service");
const _express = require("express");
const _CreateCollectiondto = require("./dto/CreateCollection.dto");
const _UpdateCollectiondto = require("./dto/UpdateCollection.dto");
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
let CollectionsController = class CollectionsController {
    createCollection(req, createCollectionDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const creatorPhone = req.user.result.phone;
            return yield _this.collectionsService.createCollection(createCollectionDto, creatorPhone);
        })();
    }
    updateCollection(collectionId, req, updateCollectionDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const currentOwnerPhone = req.user.result.phone;
            const currentUserRoles = req.user.result.role;
            return yield _this.collectionsService.updateCollection(collectionId, updateCollectionDto, currentOwnerPhone, currentUserRoles);
        })();
    }
    getAllCollections(page, limit, search, sort, sortOrder) {
        const query = {
            page,
            limit,
            search,
            sort,
            sortOrder
        };
        return this.collectionsService.getAllCollections(query);
    }
    constructor(collectionsService){
        this.collectionsService = collectionsService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _CreateCollectiondto.CreateCollectionDto === "undefined" ? Object : _CreateCollectiondto.CreateCollectionDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CollectionsController.prototype, "createCollection", null);
_ts_decorate([
    (0, _common.Put)('/:id'),
    _ts_param(0, (0, _common.Param)(':collectionId', _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _UpdateCollectiondto.UpdateCollectionDto === "undefined" ? Object : _UpdateCollectiondto.UpdateCollectionDto
    ]),
    _ts_metadata("design:returntype", Promise)
], CollectionsController.prototype, "updateCollection", null);
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
], CollectionsController.prototype, "getAllCollections", null);
CollectionsController = _ts_decorate([
    (0, _common.Controller)('collection'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _collectionservice.CollectionsService === "undefined" ? Object : _collectionservice.CollectionsService
    ])
], CollectionsController);

//# sourceMappingURL=collection.controller.js.map