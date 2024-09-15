"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    SubscribeDto: function() {
        return SubscribeDto;
    },
    SubscriptionDto: function() {
        return SubscriptionDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let KeysDto = class KeysDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], KeysDto.prototype, "p256dh", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], KeysDto.prototype, "auth", void 0);
let SubscriptionDto = class SubscriptionDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SubscriptionDto.prototype, "endpoint", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", Object)
], SubscriptionDto.prototype, "expirationTime", void 0);
_ts_decorate([
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>KeysDto),
    _ts_metadata("design:type", typeof KeysDto === "undefined" ? Object : KeysDto)
], SubscriptionDto.prototype, "keys", void 0);
let SubscribeDto = class SubscribeDto {
};
_ts_decorate([
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>SubscriptionDto),
    _ts_metadata("design:type", typeof SubscriptionDto === "undefined" ? Object : SubscriptionDto)
], SubscribeDto.prototype, "subscription", void 0);

//# sourceMappingURL=Subscription.dto.js.map