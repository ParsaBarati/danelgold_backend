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
const _authmodule = require("./User/auth/auth.module");
const _otpmodule = require("./User/auth/otp/otp.module");
const _jwtguard = require("./User/auth/guards/jwt.guard");
const _rolesguard = require("./User/auth/guards/roles.guard");
const _jwtstrategy = require("./User/auth/strategy/jwt.strategy");
const _tokenmodule = require("./User/auth/token/token.module");
const _usermodule = require("./User/user/user.module");
const _sessionmodule = require("./session/session.module");
const _subscribemodule = require("./User/subscribe/subscribe.module");
const _userDetailmodule = require("./User/user-detail/userDetail.module");
const _uploadmodule = require("./upload/upload.module");
const _loggerinterseptor = require("./common/utils/logger.interseptor");
const _globalerror = require("./common/exeptionFilters/global.error");
const _useragentmiddleware = require("./common/middleware/user-agent.middleware");
const _auctionmodule = require("./Market/auction/auction.module");
const _collectionmodule = require("./Market/collection/collection.module");
const _nftmodule = require("./NFT/nft/nft.module");
const _forummodule = require("./Social/forum/forum.module");
const _supportticketmodule = require("./Social/Support-Ticket/ST/support-ticket.module");
const _userservice = require("./User/user/user.service");
const _userentity = require("./User/user/entity/user.entity");
const _tokenentity = require("./User/auth/token/entity/token.entity");
const _smsservice = require("./services/sms.service");
const _IPFSservice = require("./services/IPFS.service");
const _pintamodule = require("./NFT/pinta/pinta.module");
const _storiesmodule = require("./Social/Story/stories/stories.module");
const _postsmodule = require("./Social/Post/posts/posts.module");
const _storiesentity = require("./Social/Story/stories/entity/stories.entity");
const _commententity = require("./Social/Comment/comment/entity/comment.entity");
const _replyentity = require("./Social/Comment/replyComment/entity/reply.entity");
const _likecommententity = require("./Social/Comment/like-comment/entity/like-comment.entity");
const _postsentity = require("./Social/Post/posts/entity/posts.entity");
const _likepostentity = require("./Social/Post/like-post/entity/like-post.entity");
const _likestoryentity = require("./Social/Story/like-story/entity/like-story.entity");
const _RSTmodule = require("./Social/Support-Ticket/RST/RST.module");
const _clubentity = require("./Social/Club/entity/club.entity");
const _notificationmodule = require("./Social/Notification/notification.module");
const _walletmodule = require("./NFT/wallet/wallet.module");
const _cryptoentity = require("./NFT/Crypto/entity/crypto.entity");
const _followentity = require("./Social/Follow/entity/follow.entity");
const _likepostmodule = require("./Social/Post/like-post/like-post.module");
const _savepostmodule = require("./Social/Post/save-post/save-post.module");
const _savepostentity = require("./Social/Post/save-post/entity/save-post.entity");
const _likestorymodule = require("./Social/Story/like-story/like-story.module");
const _notificationentity = require("./Social/Notification/entity/notification.entity");
const _notificationservice = require("./Social/Notification/notification.service");
const _axios = require("@nestjs/axios");
const _messagemodule = require("./Social/Message/message/message.module");
const _likemessagemodule = require("./Social/Message/like-message/like-message.module");
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
                envFilePath: '.develop.env'
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
                _savepostentity.savePost,
                _notificationentity.Notification
            ]),
            _auctionmodule.AuctionModule,
            _collectionmodule.CollectionEntityModule,
            _nftmodule.NFTModule,
            _forummodule.ForumModule,
            _supportticketmodule.SupportTicketModule,
            _authmodule.AuthModule,
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
            _RSTmodule.RSTModule,
            _messagemodule.MessageModule,
            _likemessagemodule.LikeMessageModule,
            _notificationmodule.NotificationModule,
            _walletmodule.WalletModule,
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