// src/wallet/wallet.module.ts
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WalletModule", {
    enumerable: true,
    get: function() {
        return WalletModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _walletentity = require("./entity/wallet.entity");
const _walletservice = require("./wallet.service");
const _walletcontroller = require("./wallet.controller");
const _axios = require("@nestjs/axios");
const _walletTransactionentity = require("./entity/walletTransaction.entity");
const _userentity = require("../user/entity/user.entity");
const _transactionentity = require("../transaction/entity/transaction.entity");
const _zarinpalservice = require("../payment/zarinpal.service");
const _pagitnateservice = require("../common/paginate/pagitnate.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WalletModule = class WalletModule {
};
WalletModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _walletentity.Wallet,
                _userentity.User,
                _transactionentity.TransactionEntity,
                _walletTransactionentity.walletTransaction
            ]),
            _axios.HttpModule
        ],
        providers: [
            _walletservice.WalletService,
            _zarinpalservice.ZarinpalService,
            _pagitnateservice.PaginationService
        ],
        controllers: [
            _walletcontroller.WalletController
        ]
    })
], WalletModule);

//# sourceMappingURL=wallet.module.js.map