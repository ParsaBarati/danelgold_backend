"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubscribeModule", {
    enumerable: true,
    get: function() {
        return SubscribeModule;
    }
});
const _common = require("@nestjs/common");
const _subscribecontroller = require("./subscribe.controller");
const _subscribeservice = require("./subscribe.service");
const _typeorm = require("@nestjs/typeorm");
const _subscribeentity = require("./entity/subscribe.entity");
const _userentity = require("../user/entity/user.entity");
const _smsservice = require("../services/sms.service");
const _auctionentity = require("../auction/entity/auction.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SubscribeModule = class SubscribeModule {
};
SubscribeModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _subscribeentity.Subscribe,
                _userentity.User,
                _auctionentity.Auction
            ])
        ],
        controllers: [
            _subscribecontroller.SubscribeController
        ],
        providers: [
            _subscribeservice.SubscribeService,
            _smsservice.SmsService
        ]
    })
], SubscribeModule);

//# sourceMappingURL=subscribe.module.js.map