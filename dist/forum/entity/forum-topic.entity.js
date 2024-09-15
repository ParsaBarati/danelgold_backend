"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForumTopic", {
    enumerable: true,
    get: function() {
        return ForumTopic;
    }
});
const _typeorm = require("typeorm");
const _forumpostentity = require("./forum-post.entity");
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
let ForumTopic = class ForumTopic {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)(),
    _ts_metadata("design:type", Number)
], ForumTopic.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)(),
    _ts_metadata("design:type", String)
], ForumTopic.prototype, "title", void 0);
_ts_decorate([
    (0, _typeorm.Column)('text'),
    _ts_metadata("design:type", String)
], ForumTopic.prototype, "content", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ForumTopic.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ForumTopic.prototype, "updatedAt", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_userentity.User, (user)=>user.forumTopics),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], ForumTopic.prototype, "user", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_forumpostentity.ForumPost, (posts)=>posts.topic),
    _ts_metadata("design:type", typeof _typeorm.Relation === "undefined" ? Object : _typeorm.Relation)
], ForumTopic.prototype, "posts", void 0);
ForumTopic = _ts_decorate([
    (0, _typeorm.Entity)()
], ForumTopic);

//# sourceMappingURL=forum-topic.entity.js.map