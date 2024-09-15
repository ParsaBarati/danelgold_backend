"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NFT", {
    enumerable: true,
    get: function() {
        return NFT;
    }
});
const _typeorm = require("typeorm");
const _collectionentity = require("../../collection/entity/collection.entity");
const _auctionentity = require("../../auction/entity/auction.entity");
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
let NFT = class NFT {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], NFT.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], NFT.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], NFT.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], NFT.prototype, "imageURL", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], NFT.prototype, "metadataURL", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], NFT.prototype, "ownerPhone", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], NFT.prototype, "creatorPhone", void 0);
_ts_decorate([
    (0, _typeorm.Column)('decimal', {
        precision: 18,
        scale: 8
    }),
    _ts_metadata("design:type", Number)
], NFT.prototype, "price", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], NFT.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], NFT.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_auctionentity.Auction, (auctions)=>auctions.nft),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], NFT.prototype, "auctions", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_collectionentity.CollectionEntity, (collectionEntity)=>collectionEntity.nfts),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], NFT.prototype, "collectionEntity", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (creator)=>creator.createdNfts),
    (0, _typeorm.JoinColumn)({
        name: 'creatorPhone',
        referencedColumnName: 'phone'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], NFT.prototype, "creator", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (owner)=>owner.ownedNfts),
    (0, _typeorm.JoinColumn)({
        name: 'ownerPhone',
        referencedColumnName: 'phone'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], NFT.prototype, "owner", void 0);
NFT = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'nfts'
    })
], NFT);

//# sourceMappingURL=nft.entity.js.map