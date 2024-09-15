"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForumService", {
    enumerable: true,
    get: function() {
        return ForumService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _forumtopicentity = require("./entity/forum-topic.entity");
const _forumpostentity = require("./entity/forum-post.entity");
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
let ForumService = class ForumService {
    // Forum Topic Services
    createTopic(topicData) {
        const topic = this.topicsRepository.create(topicData);
        return this.topicsRepository.save(topic);
    }
    findAllTopics() {
        return this.topicsRepository.find({
            relations: [
                'user',
                'posts'
            ]
        });
    }
    findOneTopic(id) {
        return this.topicsRepository.findOne({
            where: {
                id
            },
            relations: [
                'user',
                'posts'
            ]
        });
    }
    updateTopic(id, updateData) {
        return this.topicsRepository.update(id, updateData);
    }
    removeTopic(id) {
        return this.topicsRepository.delete(id);
    }
    // Forum Post Services
    createPost(postData) {
        const post = this.postsRepository.create(postData);
        return this.postsRepository.save(post);
    }
    findAllPosts(topicId) {
        return this.postsRepository.find({
            where: {
                topic: {
                    id: topicId
                }
            },
            relations: [
                'user',
                'topic'
            ]
        });
    }
    findOnePost(id) {
        return this.postsRepository.findOne({
            where: {
                id
            },
            relations: [
                'user',
                'topic'
            ]
        });
    }
    updatePost(id, updateData) {
        return this.postsRepository.update(id, updateData);
    }
    removePost(id) {
        return this.postsRepository.delete(id);
    }
    constructor(topicsRepository, postsRepository){
        this.topicsRepository = topicsRepository;
        this.postsRepository = postsRepository;
    }
};
ForumService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_forumtopicentity.ForumTopic)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_forumpostentity.ForumPost)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ForumService);

//# sourceMappingURL=forum.service.js.map