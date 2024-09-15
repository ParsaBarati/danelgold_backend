"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Wallet", {
    enumerable: true,
    get: function() {
        return Wallet;
    }
});
const _typeorm = require("typeorm");
const _transactionentity = require("../../transaction/entity/transaction.entity");
const _swagger = require("@nestjs/swagger");
const _walletTransactionentity = require("./walletTransaction.entity");
const _userentity = require("../../user/entity/user.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Wallet = class Wallet {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Wallet.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int',
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Wallet.prototype, "balance", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Wallet.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Wallet.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 11
    }),
    _ts_metadata("design:type", String)
], Wallet.prototype, "userPhone", void 0);
_ts_decorate([
    (0, _typeorm.OneToOne)(()=>_userentity.User, (user)=>user.wallets),
    (0, _typeorm.JoinColumn)({
        name: 'userPhone',
        referencedColumnName: 'phone'
    }),
    (0, _swagger.ApiProperty)({
        type: ()=>_userentity.User
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], Wallet.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_transactionentity.TransactionEntity, (transaction)=>transaction.wallet),
    (0, _swagger.ApiProperty)({
        type: ()=>[
                _transactionentity.TransactionEntity
            ]
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], Wallet.prototype, "transactions", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_walletTransactionentity.walletTransaction, (walletTransactions)=>walletTransactions.wallet),
    (0, _swagger.ApiProperty)({
        type: ()=>[
                _walletTransactionentity.walletTransaction
            ]
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], Wallet.prototype, "walletTransactions", void 0);
Wallet = _ts_decorate([
    (0, _typeorm.Entity)('wallets')
], Wallet);

//# sourceMappingURL=wallet.entity.js.map