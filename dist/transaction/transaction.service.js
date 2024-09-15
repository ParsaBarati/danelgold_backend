"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransactionService", {
    enumerable: true,
    get: function() {
        return TransactionService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _transactionentity = require("./entity/transaction.entity");
const _typeorm1 = require("@nestjs/typeorm");
const _responseutil = require("../utils/response.util");
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
let TransactionService = class TransactionService {
    getByTransaction(transaction) {
        var _this = this;
        return _async_to_generator(function*() {
            const exitingTransaction = yield _this.transactionRepository.findOneBy({
                transaction: transaction
            });
            console.log(`exitingTransaction ${JSON.stringify(exitingTransaction)}`);
            if (!exitingTransaction) {
                throw new _common.NotFoundException('این تراکنش وجود ندارد');
            }
            return (0, _responseutil.createResponse)(200, exitingTransaction);
        })();
    }
    constructor(transactionRepository){
        this.transactionRepository = transactionRepository;
    }
};
TransactionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm1.InjectRepository)(_transactionentity.TransactionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.Repository === "undefined" ? Object : _typeorm.Repository
    ])
], TransactionService);

//# sourceMappingURL=transaction.service.js.map