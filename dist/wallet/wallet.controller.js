"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WalletController", {
    enumerable: true,
    get: function() {
        return WalletController;
    }
});
const _walletservice = require("./wallet.service");
const _express = require("express");
const _swagger = require("@nestjs/swagger");
const _common = require("@nestjs/common");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _userentity = require("../user/entity/user.entity");
const _publicdecorator = require("../common/decorators/public.decorator");
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
let WalletController = class WalletController {
    getBalance(req) {
        var _this = this;
        return _async_to_generator(function*() {
            const userPhone = req.user.result.phone;
            return _this.walletService.getBalance(userPhone);
        })();
    }
    increaseBalance(userPhone, amount) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.walletService.increaseBalance(userPhone, amount);
        })();
    }
    decreaseBalance(userPhone, amount) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.walletService.decreaseBalance(userPhone, amount);
        })();
    }
    chargeWallet(amount, req) {
        var _this = this;
        return _async_to_generator(function*() {
            const userPhone = req.user.result.phone;
            return _this.walletService.chargeWallet(userPhone, amount);
        })();
    }
    verifyWalletPayment(transactionId, status, res) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.walletService.verifyPayment(transactionId, status, res);
        })();
    }
    getAllCourses(page, limit, search, sort, sortOrder) {
        var _this = this;
        return _async_to_generator(function*() {
            const query = {
                page,
                limit,
                search,
                sort,
                sortOrder
            };
            return yield _this.walletService.getAllWallets(query);
        })();
    }
    getAllWalletTransactions(page, limit, search, sort, sortOrder) {
        var _this = this;
        return _async_to_generator(function*() {
            const query = {
                page,
                limit,
                search,
                sort,
                sortOrder
            };
            return _this.walletService.getAllWalletOrders(query);
        })();
    }
    getWalletTransactionsByUser(phone, page, limit, sort, sortOrder) {
        var _this = this;
        return _async_to_generator(function*() {
            const query = {
                page,
                limit,
                sort,
                sortOrder
            };
            return _this.walletService.getWalletOrdersByUser(phone, query);
        })();
    }
    constructor(walletService){
        this.walletService = walletService;
    }
};
_ts_decorate([
    (0, _common.Get)('/wallet/balance'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], WalletController.prototype, "getBalance", null);
_ts_decorate([
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN),
    (0, _common.Post)('/wallet/increase'),
    _ts_param(0, (0, _common.Body)('userPhone')),
    _ts_param(1, (0, _common.Body)('amount')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], WalletController.prototype, "increaseBalance", null);
_ts_decorate([
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN),
    (0, _common.Post)('/wallet/decrease'),
    _ts_param(0, (0, _common.Body)('userPhone')),
    _ts_param(1, (0, _common.Body)('amount')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], WalletController.prototype, "decreaseBalance", null);
_ts_decorate([
    (0, _common.Post)('/wallet/charge'),
    _ts_param(0, (0, _common.Body)('amount')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], WalletController.prototype, "chargeWallet", null);
_ts_decorate([
    (0, _publicdecorator.Public)(),
    (0, _common.Get)('verify/wallet'),
    _ts_param(0, (0, _common.Query)('transaction')),
    _ts_param(1, (0, _common.Query)('Status')),
    _ts_param(2, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], WalletController.prototype, "verifyWalletPayment", null);
_ts_decorate([
    (0, _swagger.ApiQuery)({
        name: 'page',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'search',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sort',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sortOrder',
        required: false
    }),
    (0, _common.Get)('/wallet/all'),
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
    _ts_metadata("design:returntype", Promise)
], WalletController.prototype, "getAllCourses", null);
_ts_decorate([
    (0, _swagger.ApiQuery)({
        name: 'page',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'search',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sort',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sortOrder',
        required: false
    }),
    (0, _common.Get)('/wallet/allOrder'),
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
    _ts_metadata("design:returntype", Promise)
], WalletController.prototype, "getAllWalletTransactions", null);
_ts_decorate([
    (0, _swagger.ApiQuery)({
        name: 'page',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sort',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sortOrder',
        required: false
    }),
    (0, _common.Get)('wallet/order/:phone'),
    _ts_param(0, (0, _common.Param)('phone')),
    _ts_param(1, (0, _common.Query)('page', new _common.DefaultValuePipe(1), _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Query)('limit', new _common.DefaultValuePipe(10), _common.ParseIntPipe)),
    _ts_param(3, (0, _common.Query)('sortBy')),
    _ts_param(4, (0, _common.Query)('sortOrder')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Number,
        Number,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], WalletController.prototype, "getWalletTransactionsByUser", null);
WalletController = _ts_decorate([
    (0, _swagger.ApiTags)('Wallet'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)(''),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _walletservice.WalletService === "undefined" ? Object : _walletservice.WalletService
    ])
], WalletController);

//# sourceMappingURL=wallet.controller.js.map