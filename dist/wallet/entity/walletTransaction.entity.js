"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "walletTransaction", {
    enumerable: true,
    get: function() {
        return walletTransaction;
    }
});
const _typeorm = require("typeorm");
const _walletentity = require("./wallet.entity");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let walletTransaction = class walletTransaction {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], walletTransaction.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], walletTransaction.prototype, "transaction", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", Number)
], walletTransaction.prototype, "amount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], walletTransaction.prototype, "orderId", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], walletTransaction.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_walletentity.Wallet, (wallet)=>wallet.walletTransactions),
    (0, _swagger.ApiProperty)({
        type: ()=>_walletentity.Wallet
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], walletTransaction.prototype, "wallet", void 0);
walletTransaction = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'wallet_transactions'
    })
], walletTransaction);

//# sourceMappingURL=walletTransaction.entity.js.map