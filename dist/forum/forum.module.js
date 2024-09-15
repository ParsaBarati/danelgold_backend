"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForumModule", {
    enumerable: true,
    get: function() {
        return ForumModule;
    }
});
const _common = require("@nestjs/common");
const _forumtopicentity = require("./entity/forum-topic.entity");
const _forumpostentity = require("./entity/forum-post.entity");
const _forumcontroller = require("./forum.controller");
const _forumservice = require("./forum.service");
const _typeorm = require("@nestjs/typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ForumModule = class ForumModule {
};
ForumModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _forumtopicentity.ForumTopic,
                _forumpostentity.ForumPost
            ])
        ],
        controllers: [
            _forumcontroller.ForumController
        ],
        providers: [
            _forumservice.ForumService
        ]
    })
], ForumModule);

//# sourceMappingURL=forum.module.js.map