"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BlockchainService", {
    enumerable: true,
    get: function() {
        return BlockchainService;
    }
});
const _common = require("@nestjs/common");
const _web3 = /*#__PURE__*/ _interop_require_default(require("web3"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
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
let BlockchainService = class BlockchainService {
    getBalance(address) {
        var _this = this;
        return _async_to_generator(function*() {
            const balance = yield _this.web3.eth.getBalance(address);
            return _this.web3.utils.fromWei(balance, 'ether');
        })();
    }
    sendTransaction(from, to, value, privateKey) {
        var _this = this;
        return _async_to_generator(function*() {
            const tx = {
                from,
                to,
                value: _this.web3.utils.toWei(value, 'ether'),
                gas: 21000
            };
            const signedTx = yield _this.web3.eth.accounts.signTransaction(tx, privateKey);
            const receipt = yield _this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            return receipt.transactionHash;
        })();
    }
    constructor(){
        this.web3 = new _web3.default(new _web3.default.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));
    }
};
BlockchainService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], BlockchainService);

//# sourceMappingURL=blockchain.service.js.map