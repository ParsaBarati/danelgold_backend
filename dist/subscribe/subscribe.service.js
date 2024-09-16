"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubscribeService", {
    enumerable: true,
    get: function() {
        return SubscribeService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _subscribeentity = require("./entity/subscribe.entity");
const _typeorm1 = require("typeorm");
const _userentity = require("../user/entity/user.entity");
const _responseutil = require("../utils/response.util");
const _smsservice = require("../services/sms.service");
const _webpush = /*#__PURE__*/ _interop_require_wildcard(require("web-push"));
const _cron = require("cron");
const _dotenv = require("dotenv");
const _auctionentity = require("../auction/entity/auction.entity");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
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
(0, _dotenv.configDotenv)();
let SubscribeService = class SubscribeService {
    subscribeUser(userPhone, subscribeDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const { subscription } = subscribeDto;
            const existingUser = yield _this.userRepository.findOne({
                where: {
                    phone: userPhone
                }
            });
            if (!existingUser) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            console.log(subscription);
            const existingSubscription = yield _this.subscribeRepository.findOne({
                where: {
                    endpoint: subscription.endpoint
                }
            });
            console.log(subscription.endpoint);
            if (existingSubscription) {
                throw new _common.BadRequestException('اشتراک این کاربر وجود دارد');
            }
            const newSubscription = _this.subscribeRepository.create({
                endpoint: subscription.endpoint,
                auth: subscription.keys.auth,
                p256dh: subscription.keys.p256dh,
                userPhone: existingUser.phone,
                isActive: true,
                user: existingUser
            });
            yield _this.subscribeRepository.save(newSubscription);
            return (0, _responseutil.createResponse)(201, newSubscription, 'اعلان فعال شد');
        })();
    }
    unsubscribeUser(userPhone) {
        var _this = this;
        return _async_to_generator(function*() {
            const existingUser = yield _this.userRepository.findOne({
                where: {
                    phone: userPhone
                }
            });
            if (!existingUser) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            const userSubscription = yield _this.subscribeRepository.findOne({
                where: {
                    userPhone: userPhone
                }
            });
            if (!userSubscription || userSubscription.endpoint === '') {
                throw new _common.BadRequestException('ساب اسکرایپ یافت نشد');
            }
            yield _this.subscribeRepository.remove(userSubscription);
            return {
                message: 'اشتراک با موفقیت حذف شد',
                statusCode: 200
            };
        })();
    }
    SendSMSCron() {
        var _this = this;
        return _async_to_generator(function*() {
            const currentTimestamp = new Date();
            const windowStart = new Date(currentTimestamp);
            windowStart.setSeconds(currentTimestamp.getSeconds() - 30);
            const windowEnd = new Date(currentTimestamp);
            windowEnd.setSeconds(currentTimestamp.getSeconds() + 30);
            const auctionPromise = yield _this.auctionRepository.createQueryBuilder('acutions').where('auctions.startTime >= :windowStart', {
                windowStart
            }).andWhere('auctions.startTime <= :windowEnd', {
                windowEnd
            }).andWhere('auctions.isSms = :isSms', {
                isSms: true
            }).getMany();
            const usersPromise = yield _this.userRepository.createQueryBuilder('user').select('user.phone').getMany();
            const [auctions, users] = yield Promise.all([
                auctionPromise,
                usersPromise
            ]);
            if (auctions.length > 0 && users.length > 0) {
                const userPhones = users.map((user)=>user.phone);
                for (const acution of auctions){
                    const message = `${acution.title}`;
                    console.log('Sending SMS to:', userPhones.join(', '));
                    console.log('Message:', message);
                    yield _this.smsService.sendClassTimeSMS(userPhones, message);
                }
                console.log('SMS sent successfully');
            }
        })();
    }
    sendNotif() {
        var _this = this;
        return _async_to_generator(function*() {
            const currentTimestamp = new Date();
            const windowStart = new Date(currentTimestamp);
            windowStart.setSeconds(currentTimestamp.getSeconds() - 30);
            const windowEnd = new Date(currentTimestamp);
            windowEnd.setSeconds(currentTimestamp.getSeconds() + 30);
            const currentAuction = yield _this.auctionRepository.createQueryBuilder('auctions').leftJoinAndSelect('auctions.nft', 'nft').addSelect([
                'nft.name',
                'nft.imageURL'
            ]).where('auctions.startTime >= :windowStart', {
                windowStart
            }).andWhere('auctions.startTime <= :windowEnd', {
                windowEnd
            }).getOne();
            if (!currentAuction) {
                console.log('No class found at the current timestamp');
                return;
            }
            const subscriptions = yield _this.subscribeRepository.find();
            if (!subscriptions || subscriptions.length === 0) {
                console.log('No subscriptions found');
                return;
            }
            const payload = {
                title: currentAuction.title,
                body: `${currentAuction.nft.name} در حال برگزاری است`,
                icon: currentAuction.nft.imageURL,
                badge: ``
            };
            for (const subscription of subscriptions){
                yield _webpush.sendNotification({
                    endpoint: subscription.endpoint,
                    keys: {
                        auth: subscription.auth,
                        p256dh: subscription.p256dh
                    }
                }, JSON.stringify(payload));
            }
            console.log('Notification sent successfully');
        })();
    }
    sendSMSCron() {
        var _this = this;
        return _async_to_generator(function*() {
            yield _this.sendNotif();
        })();
    }
    onModuleInit() {
        var _this = this;
        this.job = new _cron.CronJob('* * * * *', /*#__PURE__*/ _async_to_generator(function*() {
            yield _this.sendSMSCron();
            console.log('cron job ran.');
        }));
        this.job.start();
    }
    onModuleDestroy() {
        if (this.job) {
            this.job.stop();
        }
    }
    sendContent(title, content) {
        var _this = this;
        return _async_to_generator(function*() {
            const payload = {
                title: title,
                body: content,
                icon: '',
                badge: ''
            };
            console.log(`payload >>> ${JSON.stringify(payload)}\n\n`);
            const subscriptions = yield _this.subscribeRepository.find();
            if (!subscriptions || subscriptions.length === 0) {
                console.log('No subscriptions found');
                return {
                    statusCode: 404
                };
            }
            for (const subscription of subscriptions){
                try {
                    const notif = yield _webpush.sendNotification({
                        endpoint: subscription.endpoint,
                        keys: {
                            auth: subscription.auth,
                            p256dh: subscription.p256dh
                        }
                    }, JSON.stringify(payload));
                    console.log(`notiffffff sent to: ${JSON.stringify(notif)}\n\n`);
                    console.log(`Notification sent to: ${JSON.stringify(subscription)}\n\n`);
                } catch (error) {
                    console.error(`Failed to send notification to ${subscription.endpoint}:`, error);
                }
            }
            return {
                statusCode: 200
            };
        })();
    }
    constructor(subscribeRepository, userRepository, auctionRepository, smsService){
        this.subscribeRepository = subscribeRepository;
        this.userRepository = userRepository;
        this.auctionRepository = auctionRepository;
        this.smsService = smsService;
        var _process_env_EMAIL_NOTIFICATION, _process_env_PUBLIC_KEY_NOTIFICATION, _process_env_PRIMARY_KEY_NOTIFICATION;
        _webpush.setVapidDetails((_process_env_EMAIL_NOTIFICATION = process.env.EMAIL_NOTIFICATION) !== null && _process_env_EMAIL_NOTIFICATION !== void 0 ? _process_env_EMAIL_NOTIFICATION : '', (_process_env_PUBLIC_KEY_NOTIFICATION = process.env.PUBLIC_KEY_NOTIFICATION) !== null && _process_env_PUBLIC_KEY_NOTIFICATION !== void 0 ? _process_env_PUBLIC_KEY_NOTIFICATION : '', (_process_env_PRIMARY_KEY_NOTIFICATION = process.env.PRIMARY_KEY_NOTIFICATION) !== null && _process_env_PRIMARY_KEY_NOTIFICATION !== void 0 ? _process_env_PRIMARY_KEY_NOTIFICATION : '');
    }
};
SubscribeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_subscribeentity.Subscribe)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_auctionentity.Auction)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _smsservice.SmsService === "undefined" ? Object : _smsservice.SmsService
    ])
], SubscribeService);

//# sourceMappingURL=subscribe.service.js.map