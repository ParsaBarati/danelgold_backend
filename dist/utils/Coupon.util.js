"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "calculateDiscountedTotalPrice", {
    enumerable: true,
    get: function() {
        return calculateDiscountedTotalPrice;
    }
});
function calculateDiscountedTotalPrice(sumPrice, discountValue) {
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
        console.error(`Invalid discount percentage: ${discountValue}`);
        return sumPrice;
    }
    const discountAmount = discountValue / 100 * sumPrice;
    return sumPrice - discountAmount;
}

//# sourceMappingURL=Coupon.util.js.map