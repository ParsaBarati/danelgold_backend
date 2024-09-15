// utils/authUtils.js
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sendOTPSMS", {
    enumerable: true,
    get: function() {
        return sendOTPSMS;
    }
});
const _kavenegar = /*#__PURE__*/ _interop_require_default(require("kavenegar"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function sendOTPSMS(phone, otp) {
    const OtpApi = _kavenegar.default.KavenegarApi({
        apikey: process.env.KAVENEGAR_API_KEY
    });
    OtpApi.VerifyLookup({
        receptor: phone,
        token: otp,
        template: 'nestotp'
    }, function(_response, status) {
        console.log(`message send with status : ${status}`);
    });
}

//# sourceMappingURL=auth.utils.js.map