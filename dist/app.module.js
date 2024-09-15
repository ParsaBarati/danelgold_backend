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
const _authmodule = require("./auth/auth.module");
const _otpmodule = require("./auth/otp/otp.module");
const _jwtguard = require("./auth/guards/jwt.guard");
const _rolesguard = require("./auth/guards/roles.guard");
const _jwtstrategy = require("./auth/strategy/jwt.strategy");
const _tokenmodule = require("./auth/token/token.module");
const _usermodule = require("./user/user.module");
const _sessionmodule = require("./session/session.module");
const _subscribemodule = require("./subscribe/subscribe.module");
const _userDetailmodule = require("./user-detail/userDetail.module");
const _paymentmodule = require("./payment/payment.module");
const _uploadmodule = require("./upload/upload.module");
const _walletmodule = require("./wallet/wallet.module");
const _walletTransactionentity = require("./wallet/entity/walletTransaction.entity");
const _loggerinterseptor = require("./common/utils/logger.interseptor");
const _globalerror = require("./common/exeptionFilters/global.error");
const _useragentmiddleware = require("./common/middleware/user-agent.middleware");
const _auctionmodule = require("./auction/auction.module");
const _collectionmodule = require("./collection/collection.module");
const _nftmodule = require("./nft/nft.module");
const _forummodule = require("./forum/forum.module");
const _supportticketmodule = require("./support-ticket/support-ticket.module");
const _transactionmodule = require("./transaction/transaction.module");
const _userservice = require("./user/user.service");
const _userentity = require("./user/entity/user.entity");
const _tokenentity = require("./auth/token/entity/token.entity");
const _smsservice = require("./services/sms.service");
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
                    return _object_spread_props(_object_spread({}, _datasource.default.options), {
                        autoLoadEntities: true
                    });
                }
            }),
            _typeorm.TypeOrmModule.forFeature([
                _userentity.User,
                _tokenentity.Token
            ]),
            _auctionmodule.AuctionModule,
            _collectionmodule.CollectionEntityModule,
            _nftmodule.NFTModule,
            _forummodule.ForumModule,
            _supportticketmodule.SupportTicketModule,
            _walletmodule.WalletModule,
            _walletTransactionentity.walletTransaction,
            _transactionmodule.TransactionModule,
            _authmodule.AuthModule,
            _usermodule.UserModule,
            _userDetailmodule.UserDetailModule,
            _otpmodule.OtpModule,
            _sessionmodule.SessionModule,
            _uploadmodule.UploadModule,
            _subscribemodule.SubscribeModule,
            _paymentmodule.PaymentModule,
            _tokenmodule.TokenModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService,
            _userservice.UserService,
            _smsservice.SmsService,
            _jwtstrategy.JwtStrategy,
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
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map