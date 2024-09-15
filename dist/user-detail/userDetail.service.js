"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserDetailService", {
    enumerable: true,
    get: function() {
        return UserDetailService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _userDetailentity = require("./entity/userDetail.entity");
const _userentity = require("../user/entity/user.entity");
const _pagitnateservice = require("../common/paginate/pagitnate.service");
const _responseutil = require("../utils/response.util");
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
let UserDetailService = class UserDetailService {
    createUserDetail(userPhone, userAgent) {
        var _this = this;
        return _async_to_generator(function*() {
            const user = yield _this.userRepository.findOne({
                where: {
                    phone: userPhone
                }
            });
            if (!user) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            const newUserDetail = _this.userDetailRepository.create(_object_spread_props(_object_spread({
                user
            }, userAgent), {
                loginDate: new Date()
            }));
            return yield _this.userDetailRepository.save(newUserDetail);
        })();
    }
    getUserDetail(userPhone, query) {
        var _this = this;
        return _async_to_generator(function*() {
            const { page, limit, sort, sortOrder } = query;
            const queryBuilder = _this.userDetailRepository.createQueryBuilder('userDetail').leftJoin('userDetail.user', 'user').where('user.phone = :userPhone', {
                userPhone
            });
            if (sort && sortOrder) {
                queryBuilder.orderBy(`userDetail.${sort}`, sortOrder);
            } else {
                queryBuilder.orderBy('userDetail.loginDate', 'DESC');
            }
            const paginationResult = yield _this.paginationService.paginate(queryBuilder, page, limit);
            if (paginationResult.total === 0) {
                throw new _common.NotFoundException('اطلاعات کاربر یافت نشد');
            }
            return (0, _responseutil.createResponse)(200, paginationResult);
        })();
    }
    updateUserDetail(userPhone, updateUserDetailDTO) {
        var _this = this;
        return _async_to_generator(function*() {
            const user = yield _this.userRepository.findOne({
                where: {
                    phone: userPhone
                }
            });
            if (!user) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            let userDetail = yield _this.userDetailRepository.findOne({
                where: {
                    user: {
                        phone: userPhone
                    }
                }
            });
            if (!userDetail) {
                userDetail = _this.userDetailRepository.create(_object_spread_props(_object_spread({}, updateUserDetailDTO), {
                    user
                }));
            } else {
                Object.assign(userDetail, updateUserDetailDTO);
            }
            return yield _this.userDetailRepository.save(userDetail);
        })();
    }
    deleteUserDetail(userPhone) {
        var _this = this;
        return _async_to_generator(function*() {
            const user = yield _this.userRepository.findOne({
                where: {
                    phone: userPhone
                }
            });
            if (!user) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            let userDetail = yield _this.userDetailRepository.findOne({
                where: {
                    user: {
                        phone: userPhone
                    }
                }
            });
            yield _this.userDetailRepository.remove(userDetail);
        })();
    }
    constructor(userDetailRepository, userRepository, paginationService){
        this.userDetailRepository = userDetailRepository;
        this.userRepository = userRepository;
        this.paginationService = paginationService;
    }
};
UserDetailService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userDetailentity.UserDetail)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _pagitnateservice.PaginationService === "undefined" ? Object : _pagitnateservice.PaginationService
    ])
], UserDetailService);

//# sourceMappingURL=userDetail.service.js.map