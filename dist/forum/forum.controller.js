"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForumController", {
    enumerable: true,
    get: function() {
        return ForumController;
    }
});
const _common = require("@nestjs/common");
const _forumservice = require("./forum.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ForumController = class ForumController {
    createTopic(createTopicDto) {
        return this.forumService.createTopic(createTopicDto);
    }
    findAllTopics() {
        return this.forumService.findAllTopics();
    }
    findOneTopic(id) {
        return this.forumService.findOneTopic(id);
    }
    updateTopic(id, updateTopicDto) {
        return this.forumService.updateTopic(id, updateTopicDto);
    }
    removeTopic(id) {
        return this.forumService.removeTopic(id);
    }
    createPost(createPostDto) {
        return this.forumService.createPost(createPostDto);
    }
    findAllPosts(topicId) {
        return this.forumService.findAllPosts(topicId);
    }
    findOnePost(id) {
        return this.forumService.findOnePost(id);
    }
    updatePost(id, updatePostDto) {
        return this.forumService.updatePost(id, updatePostDto);
    }
    removePost(id) {
        return this.forumService.removePost(id);
    }
    constructor(forumService){
        this.forumService = forumService;
    }
};
_ts_decorate([
    (0, _common.Post)('topics'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "createTopic", null);
_ts_decorate([
    (0, _common.Get)('topics'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "findAllTopics", null);
_ts_decorate([
    (0, _common.Get)('topics/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "findOneTopic", null);
_ts_decorate([
    (0, _common.Put)('topics/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "updateTopic", null);
_ts_decorate([
    (0, _common.Delete)('topics/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "removeTopic", null);
_ts_decorate([
    (0, _common.Post)('posts'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "createPost", null);
_ts_decorate([
    (0, _common.Get)('posts/:topicId'),
    _ts_param(0, (0, _common.Param)('topicId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "findAllPosts", null);
_ts_decorate([
    (0, _common.Get)('posts/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "findOnePost", null);
_ts_decorate([
    (0, _common.Put)('posts/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        typeof Partial === "undefined" ? Object : Partial
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "updatePost", null);
_ts_decorate([
    (0, _common.Delete)('posts/:id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", void 0)
], ForumController.prototype, "removePost", null);
ForumController = _ts_decorate([
    (0, _common.Controller)('forum'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _forumservice.ForumService === "undefined" ? Object : _forumservice.ForumService
    ])
], ForumController);

//# sourceMappingURL=forum.controller.js.map