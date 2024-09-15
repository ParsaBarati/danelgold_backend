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
    User: function() {
        return User;
    },
    UserRole: function() {
        return UserRole;
    }
});
const _typeorm = require("typeorm");
const _collectionentity = require("../../collection/entity/collection.entity");
const _nftentity = require("../../nft/entity/nft.entity");
const _auctionentity = require("../../auction/entity/auction.entity");
const _supportticketentity = require("../../support-ticket/entity/support-ticket.entity");
const _forumtopicentity = require("../../forum/entity/forum-topic.entity");
const _forumpostentity = require("../../forum/entity/forum-post.entity");
const _auctionBidentity = require("../../auction/entity/auctionBid.entity");
const _swagger = require("@nestjs/swagger");
const _walletentity = require("../../wallet/entity/wallet.entity");
const _tokenentity = require("../../auth/token/entity/token.entity");
const _subscribeentity = require("../../subscribe/entity/subscribe.entity");
const _userDetailentity = require("../../user-detail/entity/userDetail.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var UserRole;
(function(UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (UserRole = {}));
let User = class User {
};
_ts_decorate([
    (0, _typeorm.Column)(),
    (0, _typeorm.Generated)('increment'),
    _ts_metadata("design:type", Number)
], User.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        type: 'varchar',
        unique: true,
        length: 11
    }),
    _ts_metadata("design:type", String)
], User.prototype, "phone", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", String)
], User.prototype, "firstName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", String)
], User.prototype, "lastName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text'
    }),
    _ts_metadata("design:type", String)
], User.prototype, "password", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text'
    }),
    _ts_metadata("design:type", String)
], User.prototype, "email", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "imageUrl", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], User.prototype, "walletAddress", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'enum',
        enum: UserRole,
        default: "user"
    }),
    _ts_metadata("design:type", String)
], User.prototype, "role", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], User.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], User.prototype, "lastLogin", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_tokenentity.Token, (token)=>token.user),
    (0, _swagger.ApiProperty)({
        type: ()=>[
                _tokenentity.Token
            ]
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "tokens", void 0);
_ts_decorate([
    (0, _typeorm.OneToOne)(()=>_walletentity.Wallet, (wallets)=>wallets.user),
    (0, _swagger.ApiProperty)({
        type: ()=>_walletentity.Wallet
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "wallets", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_userDetailentity.UserDetail, (userDetail)=>userDetail.user),
    (0, _swagger.ApiProperty)({
        type: ()=>[
                _userDetailentity.UserDetail
            ]
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "userDetail", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_subscribeentity.Subscribe, (subscribes)=>subscribes.user),
    (0, _swagger.ApiProperty)({
        type: ()=>[
                _subscribeentity.Subscribe
            ]
    }),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "subscribes", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_collectionentity.CollectionEntity, (collectionEntities)=>collectionEntities.creator),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "collectionEntities", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_nftentity.NFT, (nfts)=>nfts.creator),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "createdNfts", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_nftentity.NFT, (nfts)=>nfts.owner),
    _ts_metadata("design:type", Array)
], User.prototype, "ownedNfts", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_auctionentity.Auction, (auctions)=>auctions.creator),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "auctions", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_auctionBidentity.Bid, (bid)=>bid.user),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "bids", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_supportticketentity.SupportTicket, (tickets)=>tickets.user),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "supportTickets", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_forumtopicentity.ForumTopic, (topics)=>topics.user),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "forumTopics", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_forumpostentity.ForumPost, (posts)=>posts.user),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], User.prototype, "forumPosts", void 0);
User = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'users'
    })
], User);

//# sourceMappingURL=user.entity.js.map