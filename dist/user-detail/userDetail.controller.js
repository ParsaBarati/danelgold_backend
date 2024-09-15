"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserDetailController", {
    enumerable: true,
    get: function() {
        return UserDetailController;
    }
});
const _userDetailservice = require("./userDetail.service");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
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
let UserDetailController = class UserDetailController {
    getUserDetail(phone, page, limit, sort, sortOrder) {
        var _this = this;
        return _async_to_generator(function*() {
            const query = {
                page,
                limit,
                sort,
                sortOrder
            };
            return yield _this.userDetailService.getUserDetail(phone, query);
        })();
    }
    constructor(userDetailService){
        this.userDetailService = userDetailService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get All Users'
    }),
    (0, _swagger.ApiQuery)({
        name: 'page',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sort',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sortOrder',
        required: false
    }),
    (0, _common.Get)(':phone'),
    _ts_param(0, (0, _common.Param)('phone')),
    _ts_param(1, (0, _common.Query)('page', new _common.DefaultValuePipe(1), _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Query)('limit', new _common.DefaultValuePipe(10), _common.ParseIntPipe)),
    _ts_param(3, (0, _common.Query)('sort')),
    _ts_param(4, (0, _common.Query)('sortOrder')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Number,
        Number,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserDetailController.prototype, "getUserDetail", null);
UserDetailController = _ts_decorate([
    (0, _swagger.ApiTags)('User Detail'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)('user-detail'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userDetailservice.UserDetailService === "undefined" ? Object : _userDetailservice.UserDetailService
    ])
], UserDetailController);

//# sourceMappingURL=userDetail.controller.js.map