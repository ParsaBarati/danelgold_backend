"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransactionConroller", {
    enumerable: true,
    get: function() {
        return TransactionConroller;
    }
});
const _common = require("@nestjs/common");
const _transactionservice = require("./transaction.service");
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
let TransactionConroller = class TransactionConroller {
    getByTransaction(transaction) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.transactionService.getByTransaction(transaction);
        })();
    }
    constructor(transactionService){
        this.transactionService = transactionService;
    }
};
_ts_decorate([
    (0, _common.Get)(':transaction'),
    _ts_param(0, (0, _common.Param)('transaction')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TransactionConroller.prototype, "getByTransaction", null);
TransactionConroller = _ts_decorate([
    (0, _common.Controller)('transaction'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _transactionservice.TransactionService === "undefined" ? Object : _transactionservice.TransactionService
    ])
], TransactionConroller);

//# sourceMappingURL=transaction.controller.js.map