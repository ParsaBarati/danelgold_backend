"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForumPost", {
    enumerable: true,
    get: function() {
        return ForumPost;
    }
});
const _typeorm = require("typeorm");
const _forumtopicentity = require("./forum-topic.entity");
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
let ForumPost = class ForumPost {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], ForumPost.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)('text'),
    _ts_metadata("design:type", String)
], ForumPost.prototype, "content", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ForumPost.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ForumPost.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_forumtopicentity.ForumTopic, (topic)=>topic.posts),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], ForumPost.prototype, "topic", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (user)=>user.forumPosts),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], ForumPost.prototype, "user", void 0);
ForumPost = _ts_decorate([
    (0, _typeorm.Entity)()
], ForumPost);

//# sourceMappingURL=forum-post.entity.js.map