"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubscribeController", {
    enumerable: true,
    get: function() {
        return SubscribeController;
    }
});
const _common = require("@nestjs/common");
const _subscribeservice = require("./subscribe.service");
const _Subscriptiondto = require("./dto/Subscription.dto");
const _express = require("express");
const _swagger = require("@nestjs/swagger");
const _createnoticationdto = require("./dto/create-notication.dto");
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
let SubscribeController = class SubscribeController {
    subscribeUser(req, subscribeDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const userPhone = req.user.result.phone;
            return yield _this.subscribeService.subscribeUser(userPhone, subscribeDto);
        })();
    }
    unsubscribeUser(req) {
        var _this = this;
        return _async_to_generator(function*() {
            const userPhone = req.user.result.phone;
            return _this.subscribeService.unsubscribeUser(userPhone);
        })();
    }
    sendNotif() {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.subscribeService.sendNotif();
        })();
    }
    sendContent(notDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const { title, content } = notDto;
            return _this.subscribeService.sendContent(title, content);
        })();
    }
    constructor(subscribeService){
        this.subscribeService = subscribeService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _Subscriptiondto.SubscribeDto === "undefined" ? Object : _Subscriptiondto.SubscribeDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SubscribeController.prototype, "subscribeUser", null);
_ts_decorate([
    (0, _common.Delete)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], SubscribeController.prototype, "unsubscribeUser", null);
_ts_decorate([
    (0, _common.Get)('send-notif'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], SubscribeController.prototype, "sendNotif", null);
_ts_decorate([
    (0, _common.Post)('send-data-notif'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createnoticationdto.CreateNotificationDto === "undefined" ? Object : _createnoticationdto.CreateNotificationDto
    ]),
    _ts_metadata("design:returntype", Promise)
], SubscribeController.prototype, "sendContent", null);
SubscribeController = _ts_decorate([
    (0, _swagger.ApiTags)('Subscribe'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)('subscribe'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _subscribeservice.SubscribeService === "undefined" ? Object : _subscribeservice.SubscribeService
    ])
], SubscribeController);

//# sourceMappingURL=subscribe.controller.js.map