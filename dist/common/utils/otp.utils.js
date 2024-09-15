// otpUtils.js
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateNumericOTP", {
    enumerable: true,
    get: function() {
        return generateNumericOTP;
    }
});
function generateNumericOTP(length) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//# sourceMappingURL=otp.utils.js.map