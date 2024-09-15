"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DateRangeUtil", {
    enumerable: true,
    get: function() {
        return DateRangeUtil;
    }
});
const _moment = /*#__PURE__*/ _interop_require_default(require("moment"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
_moment.default.locale('fa');
let DateRangeUtil = class DateRangeUtil {
    static getDateRangeFromQuery(query) {
        const { today, yesterday, last7Days, last30Days, lastYear, startDate: queryStartDate, endDate: queryEndDate, month } = query;
        if (today) {
            return {
                startDate: (0, _moment.default)().startOf('day').toISOString(),
                endDate: (0, _moment.default)().endOf('day').toISOString()
            };
        } else if (yesterday) {
            return {
                startDate: (0, _moment.default)().subtract(1, 'days').startOf('day').toISOString(),
                endDate: (0, _moment.default)().subtract(1, 'days').endOf('day').toISOString()
            };
        } else if (last7Days) {
            return {
                startDate: (0, _moment.default)().subtract(7, 'days').startOf('day').toISOString(),
                endDate: (0, _moment.default)().endOf('day').toISOString()
            };
        } else if (last30Days) {
            return {
                startDate: (0, _moment.default)().subtract(30, 'days').startOf('day').toISOString(),
                endDate: (0, _moment.default)().endOf('day').toISOString()
            };
        } else if (lastYear) {
            return {
                startDate: (0, _moment.default)().subtract(1, 'years').startOf('year').toISOString(),
                endDate: (0, _moment.default)().endOf('year').toISOString()
            };
        } else if (queryStartDate && queryEndDate) {
            return {
                startDate: (0, _moment.default)(queryStartDate).startOf('day').toISOString(),
                endDate: (0, _moment.default)(queryEndDate).endOf('day').toISOString()
            };
        } else if (month) {
            return {
                startDate: (0, _moment.default)().startOf('month').toISOString(),
                endDate: (0, _moment.default)().endOf('month').toISOString()
            };
        } else {
            return {
                startDate: (0, _moment.default)().startOf('day').toISOString(),
                endDate: (0, _moment.default)().endOf('day').toISOString()
            };
        }
    }
};

//# sourceMappingURL=dataRange.util.js.map