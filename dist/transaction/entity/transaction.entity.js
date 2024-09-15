"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    TransactionEntity: function() {
        return TransactionEntity;
    },
    TransactionStatus: function() {
        return TransactionStatus;
    }
});
const _typeorm = require("typeorm");
const _walletentity = require("../../wallet/entity/wallet.entity");
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
var TransactionStatus;
(function(TransactionStatus) {
    TransactionStatus["Success"] = "success";
    TransactionStatus["Cancelled"] = "cancelled";
    TransactionStatus["Pending"] = "pending";
})(TransactionStatus || (TransactionStatus = {}));
let TransactionEntity = class TransactionEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], TransactionEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        length: 16,
        unique: true
    }),
    _ts_metadata("design:type", String)
], TransactionEntity.prototype, "transaction", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], TransactionEntity.prototype, "isOpen", void 0);
_ts_decorate([
    (0, _typeorm.Column)('enum', {
        enum: TransactionStatus,
        nullable: true
    }),
    _ts_metadata("design:type", String)
], TransactionEntity.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], TransactionEntity.prototype, "refId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], TransactionEntity.prototype, "authority", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], TransactionEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], TransactionEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'decimal'
    }),
    _ts_metadata("design:type", Number)
], TransactionEntity.prototype, "amount", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int',
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], TransactionEntity.prototype, "orderId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int',
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], TransactionEntity.prototype, "walletId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'int',
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], TransactionEntity.prototype, "debtDueDateId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_walletentity.Wallet, (wallet)=>wallet.transactions),
    (0, _typeorm.JoinColumn)({
        name: 'walletId',
        referencedColumnName: 'id'
    }),
    (0, _swagger.ApiProperty)({
        type: ()=>_walletentity.Wallet
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], TransactionEntity.prototype, "wallet", void 0);
TransactionEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'transactions'
    })
], TransactionEntity);

//# sourceMappingURL=transaction.entity.js.map