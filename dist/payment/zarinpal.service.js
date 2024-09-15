"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ZarinpalService", {
    enumerable: true,
    get: function() {
        return ZarinpalService;
    }
});
const _axios = require("@nestjs/axios");
const _common = require("@nestjs/common");
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
let ZarinpalService = class ZarinpalService {
    createPaymentRequest(amount, transaction, type) {
        var _this = this;
        return _async_to_generator(function*() {
            const callbackurl = `${_this.callbackUrl}/${type}?transaction=${transaction}`;
            const roundedAmount = Math.round(amount);
            const response = yield _this.httpService.post(_this.zarinpalRequestUrl, {
                merchant_id: _this.merchantId,
                amount: roundedAmount * 10,
                callback_url: callbackurl,
                description: 'توضیحات پرداخت'
            }).toPromise();
            const data = response.data.data;
            const errors = response.data.errors;
            if (errors.length > 0) {
                throw new _common.HttpException({
                    status: errors[0].code,
                    message: errors[0].message
                }, 400);
            }
            if (data.code !== 100) {
                throw new _common.HttpException({
                    status: data.code,
                    message: 'خطا در ایجاد درخواست پرداخت'
                }, 400);
            }
            return {
                url: `https://www.zarinpal.com/pg/StartPay/${data.authority}`,
                authority: data.authority
            };
        })();
    }
    verifyPayment(amount, authority) {
        var _this = this;
        return _async_to_generator(function*() {
            const response = yield _this.httpService.post(_this.zarinpalVerifyUrl, {
                merchant_id: _this.merchantId,
                amount: amount * 10,
                authority: authority
            }).toPromise();
            console.log(JSON.stringify(`response  >>> ${response}`));
            console.log(JSON.stringify(`response.data  >>> ${response.data}`));
            const data = response.data.data;
            const errors = response.data.errors;
            console.log(JSON.stringify(response.data.errors));
            if (errors.length > 0) {
                throw new _common.HttpException({
                    status: errors[0].code,
                    message: errors[0].message
                }, 400);
            }
            return data;
        })();
    }
    constructor(httpService){
        this.httpService = httpService;
        this.merchantId = process.env.ZARINPAL_MERCHANT_ID;
        this.zarinpalRequestUrl = process.env.ZARINPAL_LINK_REQUEST;
        this.zarinpalVerifyUrl = process.env.ZARINPAL_LINK_VERIFY;
        this.callbackUrl = process.env.CALLBACKURL_ZARIPAL;
    }
};
ZarinpalService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService
    ])
], ZarinpalService);

//# sourceMappingURL=zarinpal.service.js.map