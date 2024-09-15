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
    Auction: function() {
        return Auction;
    },
    AuctionStatus: function() {
        return AuctionStatus;
    }
});
const _swagger = require("@nestjs/swagger");
const _nftentity = require("../../nft/entity/nft.entity");
const _userentity = require("../../user/entity/user.entity");
const _typeorm = require("typeorm");
const _auctionBidentity = require("./auctionBid.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var AuctionStatus;
(function(AuctionStatus) {
    AuctionStatus["Active"] = "active";
    AuctionStatus["Deactive"] = "deactive";
})(AuctionStatus || (AuctionStatus = {}));
let Auction = class Auction {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], Auction.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", String)
], Auction.prototype, "title", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Auction.prototype, "startTime", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Auction.prototype, "endTime", void 0);
_ts_decorate([
    (0, _typeorm.Column)('decimal', {
        precision: 18,
        scale: 8
    }),
    _ts_metadata("design:type", Number)
], Auction.prototype, "startingBid", void 0);
_ts_decorate([
    (0, _typeorm.Column)('decimal', {
        precision: 18,
        scale: 8
    }),
    _ts_metadata("design:type", Number)
], Auction.prototype, "currentBid", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: AuctionStatus
    }),
    (0, _typeorm.Column)('enum', {
        enum: AuctionStatus,
        default: "active"
    }),
    _ts_metadata("design:type", String)
], Auction.prototype, "auctionStatus", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'boolean',
        default: false,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Auction.prototype, "isSms", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    (0, _swagger.ApiProperty)({
        description: 'The creation timestamp of the auction'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Auction.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz',
        nullable: true
    }),
    (0, _swagger.ApiProperty)({
        description: 'The last update timestamp of the auction'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Auction.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_nftentity.NFT, (nft)=>nft.auctions),
    (0, _swagger.ApiProperty)({
        type: ()=>_nftentity.NFT
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], Auction.prototype, "nft", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (creator)=>creator.auctions),
    (0, _swagger.ApiProperty)({
        type: ()=>_userentity.User
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], Auction.prototype, "creator", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, {
        nullable: true
    }),
    (0, _typeorm.JoinColumn)({
        name: 'highestBidderPhone',
        referencedColumnName: 'phone'
    }),
    (0, _swagger.ApiProperty)({
        type: ()=>_userentity.User,
        description: 'The user who placed the highest bid'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], Auction.prototype, "highestBidder", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_auctionBidentity.Bid, (bid)=>bid.auction),
    (0, _swagger.ApiProperty)({
        type: ()=>[
                _auctionBidentity.Bid
            ]
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], Auction.prototype, "bids", void 0);
Auction = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'auctions'
    })
], Auction);

//# sourceMappingURL=auction.entity.js.map