"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UploadModule", {
    enumerable: true,
    get: function() {
        return UploadModule;
    }
});
const _common = require("@nestjs/common");
const _uploadcontroller = require("./upload.controller");
const _uploadservice = require("./upload.service");
const _typeorm = require("@nestjs/typeorm");
const _platformexpress = require("@nestjs/platform-express");
const _config = require("@nestjs/config");
const _uplaodentity = require("./entity/uplaod.entity");
const _multerutils = require("../common/utils/multer.utils");
const _pagitnateservice = require("../common/paginate/pagitnate.service");
const _userentity = require("../User/user/entity/user.entity");
const _postsentity = require("../Social/Post/posts/entity/posts.entity");
const _tokenservice = require("../User/auth/token/token.service");
const _tokenentity = require("../User/auth/token/entity/token.entity");
const _jwt = require("@nestjs/jwt");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UploadModule = class UploadModule {
};
UploadModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _uplaodentity.Upload,
                _postsentity.Post,
                _tokenentity.Token,
                _userentity.User
            ]),
            _platformexpress.MulterModule.registerAsync({
                imports: [
                    _config.ConfigModule
                ],
                useFactory: _multerutils.multerConfigFactory,
                inject: [
                    _config.ConfigService
                ]
            })
        ],
        controllers: [
            _uploadcontroller.UploadController
        ],
        providers: [
            _uploadservice.UploadService,
            _tokenservice.TokenService,
            _jwt.JwtService,
            _pagitnateservice.PaginationService
        ]
    })
], UploadModule);

//# sourceMappingURL=upload.module.js.map