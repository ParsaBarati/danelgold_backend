"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Bid", {
    enumerable: true,
    get: function() {
        return Bid;
    }
});
const _swagger = require("@nestjs/swagger");
const _typeorm = require("typeorm");
const _auctionentity = require("./auction.entity");
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
let Bid = class Bid {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Bid.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)('decimal', {
        precision: 18,
        scale: 8
    }),
    _ts_metadata("design:type", Number)
], Bid.prototype, "amount", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Bid.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_auctionentity.Auction, (auction)=>auction.bids),
    (0, _typeorm.JoinColumn)({
        name: 'auctionId',
        referencedColumnName: 'id'
    }),
    (0, _swagger.ApiProperty)({
        type: ()=>_auctionentity.Auction
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], Bid.prototype, "auction", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (user)=>user.bids),
    (0, _typeorm.JoinColumn)({
        name: 'userPhone',
        referencedColumnName: 'phone'
    }),
    (0, _swagger.ApiProperty)({
        type: ()=>_userentity.User
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], Bid.prototype, "user", void 0);
Bid = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'bids'
    })
], Bid);

//# sourceMappingURL=auctionBid.entity.js.map