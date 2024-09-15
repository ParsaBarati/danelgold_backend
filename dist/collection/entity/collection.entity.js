"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CollectionEntity", {
    enumerable: true,
    get: function() {
        return CollectionEntity;
    }
});
const _nftentity = require("../../nft/entity/nft.entity");
const _userentity = require("../../user/entity/user.entity");
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CollectionEntity = class CollectionEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], CollectionEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], CollectionEntity.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], CollectionEntity.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], CollectionEntity.prototype, "creatorPhone", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CollectionEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamp',
        nullable: true
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CollectionEntity.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_nftentity.NFT, (nfts)=>nfts.collectionEntity),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], CollectionEntity.prototype, "nfts", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (creator)=>creator.collectionEntities),
    (0, _typeorm.JoinColumn)({
        name: 'creatorPhone',
        referencedColumnName: 'phone'
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], CollectionEntity.prototype, "creator", void 0);
CollectionEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'collections'
    })
], CollectionEntity);

//# sourceMappingURL=collection.entity.js.map