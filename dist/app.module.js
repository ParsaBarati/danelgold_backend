"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _config = require("@nestjs/config");
const _typeorm = require("@nestjs/typeorm");
const _throttler = require("@nestjs/throttler");
const _servestatic = require("@nestjs/serve-static");
const _datasource = /*#__PURE__*/ _interop_require_default(require("./config/data-source"));
const _path = require("path");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const _authmodule = require("./user/auth/auth.module");
const _usermodule = require("./user/user/user.module");
const _sessionmodule = require("./session/session.module");
const _subscribemodule = require("./user/subscribe/subscribe.module");
const _userDetailmodule = require("./user/user-detail/userDetail.module");
const _uploadmodule = require("./upload/upload.module");
const _loggerinterseptor = require("./common/utils/logger.interseptor");
const _globalerror = require("./common/exeptionFilters/global.error");
const _useragentmiddleware = require("./common/middleware/user-agent.middleware");
const _auctionmodule = require("./market/auction/auction.module");
const _collectionmodule = require("./market/collection/collection.module");
const _nftmodule = require("./nft/nft/nft.module");
const _forummodule = require("./social/forum/forum.module");
const _supportticketmodule = require("./social/support-ticket/st/support-ticket.module");
const _userservice = require("./user/user/user.service");
const _userentity = require("./user/user/entity/user.entity");
const _smsservice = require("./services/sms.service");
const _IPFSservice = require("./services/IPFS.service");
const _pintamodule = require("./nft/pinta/pinta.module");
const _storiesmodule = require("./social/story/stories/stories.module");
const _postsmodule = require("./social/post/posts/posts.module");
const _storiesentity = require("./social/story/stories/entity/stories.entity");
const _commententity = require("./social/comment/comment/entity/comment.entity");
const _replyentity = require("./social/comment/replyComment/entity/reply.entity");
const _likecommententity = require("./social/comment/like-comment/entity/like-comment.entity");
const _postsentity = require("./social/post/posts/entity/posts.entity");
const _likepostentity = require("./social/post/like-post/entity/like-post.entity");
const _likestoryentity = require("./social/story/like-story/entity/like-story.entity");
const _clubentity = require("./social/club/entity/club.entity");
const _notificationmodule = require("./social/notification/notification.module");
const _walletmodule = require("./nft/wallet/wallet.module");
const _cryptoentity = require("./nft/crypto/entity/crypto.entity");
const _followentity = require("./social/follow/entity/follow.entity");
const _likepostmodule = require("./social/post/like-post/like-post.module");
const _savepostmodule = require("./social/post/save-post/save-post.module");
const _savepostentity = require("./social/post/save-post/entity/save-post.entity");
const _likestorymodule = require("./social/story/like-story/like-story.module");
const _notificationentity = require("./social/notification/entity/notification.entity");
const _notificationservice = require("./social/notification/notification.service");
const _axios = require("@nestjs/axios");
const _messagemodule = require("./social/message/message/message.module");
const _likemessagemodule = require("./social/message/like-message/like-message.module");
const _blockentity = require("./social/block/entity/block.entity");
const _adminentity = require("./user/admin/entity/admin.entity");
const _adminmodule = require("./user/admin/admin.module");
const _dashboardmodule = require("./user/dashboard/dashboard.module");
const _otpmodule = require("./user/auth/otp/otp.module");
const _tokenmodule = require("./user/auth/token/token.module");
const _rstmodule = require("./social/support-ticket/rst/rst.module");
const _jwtstrategy = require("./user/auth/strategy/jwt.strategy");
const _jwtguard = require("./user/auth/guards/jwt.guard");
const _rolesguard = require("./user/auth/guards/roles.guard");
const _tokenentity = require("./user/auth/token/entity/token.entity");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(_useragentmiddleware.UserAgentMiddleware).forRoutes('*');
    }
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _throttler.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 50
                }
            ]),
            _servestatic.ServeStaticModule.forRoot({
                rootPath: (0, _path.join)(__dirname, '..', 'public'),
                serveRoot: '/public'
            }),
            _config.ConfigModule.forRoot({
                envFilePath: '.env'
            }),
            _typeorm.TypeOrmModule.forRootAsync({
                imports: [
                    _config.ConfigModule
                ],
                inject: [
                    _config.ConfigService
                ],
                useFactory: (configService)=>{
                    const synchronize = configService.get('NODE_ENV') === 'development';
                    console.log('synchronize ' + synchronize);
                    console.log(_datasource.default.options);
                    return _object_spread_props(_object_spread({}, _datasource.default.options), {
                        autoLoadEntities: true,
                        connectTimeoutMS: 30000
                    });
                }
            }),
            _typeorm.TypeOrmModule.forFeature([
                _userentity.User,
                _adminentity.Admin,
                _tokenentity.Token,
                _clubentity.Club,
                _storiesentity.Story,
                _commententity.Comment,
                _likecommententity.likeComment,
                _replyentity.Reply,
                _postsentity.Post,
                _likepostentity.likePost,
                _likestoryentity.likeStory,
                _cryptoentity.CryptoEntity,
                _followentity.FollowUser,
                _blockentity.BlockUser,
                _savepostentity.savePost,
                _notificationentity.Notification
            ]),
            _auctionmodule.AuctionModule,
            _collectionmodule.CollectionEntityModule,
            _nftmodule.NFTModule,
            _forummodule.ForumModule,
            _supportticketmodule.SupportTicketModule,
            _authmodule.AuthModule,
            _adminmodule.AdminModule,
            _usermodule.UserModule,
            _userDetailmodule.UserDetailModule,
            _otpmodule.OtpModule,
            _sessionmodule.SessionModule,
            _uploadmodule.UploadModule,
            _subscribemodule.SubscribeModule,
            _tokenmodule.TokenModule,
            _pintamodule.PinataModule,
            _storiesmodule.StoriesModule,
            _postsmodule.PostsModule,
            _likepostmodule.LikePostModule,
            _likestorymodule.LikeStoryModule,
            _savepostmodule.SavePostModule,
            _rstmodule.RSTModule,
            _messagemodule.MessageModule,
            _likemessagemodule.LikeMessageModule,
            _notificationmodule.NotificationModule,
            _walletmodule.WalletModule,
            _dashboardmodule.DashboardModule,
            _object_spread({
                global: true
            }, _axios.HttpModule.register({
                maxRedirects: 5
            }))
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService,
            _userservice.UserService,
            _IPFSservice.IPFSService,
            _smsservice.SmsService,
            _jwtstrategy.JwtStrategy,
            _notificationservice.NotificationService,
            {
                provide: _core.APP_GUARD,
                useClass: _jwtguard.JwtAuthGuard
            },
            {
                provide: _core.APP_GUARD,
                useClass: _rolesguard.RolesGuard
            },
            {
                provide: _core.APP_INTERCEPTOR,
                useClass: _loggerinterseptor.LoggingInterceptor
            },
            {
                provide: _core.APP_FILTER,
                useClass: _globalerror.AllExceptionsFilter
            }
        ],
        exports: [
            _IPFSservice.IPFSService,
            _axios.HttpModule
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map