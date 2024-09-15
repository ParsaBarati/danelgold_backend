"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserService", {
    enumerable: true,
    get: function() {
        return UserService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _index = require("typeorm/index");
const _bcryptjs = /*#__PURE__*/ _interop_require_wildcard(require("bcryptjs"));
const _userentity = require("./entity/user.entity");
const _responseutil = require("../utils/response.util");
const _subscribeentity = require("../subscribe/entity/subscribe.entity");
const _tokenentity = require("../auth/token/entity/token.entity");
const _smsservice = require("../services/sms.service");
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
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
let UserService = class UserService {
    singupUser(createUserDTO) {
        var _this = this;
        return _async_to_generator(function*() {
            const existingUser = yield _this.userRepository.findOne({
                where: {
                    phone: createUserDTO.phone
                }
            });
            if (existingUser) {
                throw new _common.BadRequestException('کاربری با این شماره همراه قبلاً حساب کاربری ساخته است');
            }
            const NewUser = _this.userRepository.create(_object_spread({}, createUserDTO));
            const result = yield _this.userRepository.save(NewUser);
            return result;
        })();
    }
    createUser(createUserDTO) {
        var _this = this;
        return _async_to_generator(function*() {
            const existingUser = yield _this.userRepository.findOne({
                where: {
                    phone: createUserDTO.phone
                }
            });
            if (existingUser) {
                throw new _common.BadRequestException('کاربری با این شماره همراه قبلاً حساب کاربری ساخته است');
            }
            const hashedPassword = yield _bcryptjs.hash(createUserDTO.password, 10);
            const NewUser = _this.userRepository.create(_object_spread_props(_object_spread({}, createUserDTO), {
                password: hashedPassword,
                createdAt: new Date()
            }));
            const result = yield _this.userRepository.save(NewUser);
            if (createUserDTO.isSms) {
                yield _this.smsService.sendSignUpSMS(createUserDTO.phone, createUserDTO.phone, createUserDTO.password);
            }
            return (0, _responseutil.createResponse)(201, result, 'کاربر با موفقیت ایجاد گردید');
        })();
    }
    updateUser(phone, updateUserDTO) {
        var _this = this;
        return _async_to_generator(function*() {
            const existingUser = yield _this.userRepository.findOne({
                where: {
                    phone: phone
                }
            });
            if (!existingUser) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            const hashedPassword = updateUserDTO.password ? yield _bcryptjs.hash(updateUserDTO.password, 10) : existingUser.password;
            Object.assign(existingUser, _object_spread_props(_object_spread({}, updateUserDTO), {
                password: hashedPassword,
                updatedAt: new Date()
            }));
            const updateUser = yield _this.userRepository.save(existingUser);
            return (0, _responseutil.createResponse)(200, updateUser, 'آپدیت شد');
        })();
    }
    deleteUsers(phone) {
        var _this = this;
        return _async_to_generator(function*() {
            const user = yield _this.userRepository.findOne({
                where: {
                    phone
                }
            });
            if (!user) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            yield _this.userRepository.manager.transaction(/*#__PURE__*/ function() {
                var _ref = _async_to_generator(function*(transactionalEntityManager) {
                    yield transactionalEntityManager.delete(_subscribeentity.Subscribe, {
                        userPhone: phone
                    });
                    yield transactionalEntityManager.delete(_userentity.User, {
                        phone
                    });
                });
                return function(transactionalEntityManager) {
                    return _ref.apply(this, arguments);
                };
            }());
            return 'کاربر با موفقیت پاک شد';
        })();
    }
    getUserByPhone(phone) {
        var _this = this;
        return _async_to_generator(function*() {
            const user = yield _this.userRepository.findOneBy({
                phone
            });
            if (!user) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            const userInformation = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                roles: user.role,
                imageUrl: user.imageUrl,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            const result = userInformation;
            return (0, _responseutil.createResponse)(200, result, null);
        })();
    }
    getUsers(page = 1, limit = 10, searchInput, role, all, sort = 'id', sortOrder = 'DESC') {
        var _this = this;
        return _async_to_generator(function*() {
            const allowedSortFields = [
                'id',
                'firstName',
                'lastName',
                'phone',
                'roles',
                'grade',
                'lastLogin',
                'skuTest'
            ];
            const validatedSortBy = allowedSortFields.includes(sort) ? sort : 'id';
            let queryBuilder = _this.userRepository.createQueryBuilder('user').leftJoinAndSelect('user.userDetail', 'userDetail').select([
                'user.id as id',
                'user.firstName as firstName',
                'user.lastName as lastName',
                'user.phone as phone',
                'user.role as role',
                'user.grade as grade',
                'user.lastLogin as lastLogin',
                'user.skuTest as skuTest',
                'MAX(userDetail.ip) as ip',
                'MAX(userDetail.platform) as platform',
                'MAX(userDetail.browser) as browser',
                'MAX(userDetail.versionBrowser) as versionBrowser',
                'MAX(userDetail.versionPlatform) as versionPlatform',
                'MAX(userDetail.loginDate) as lastLoginDate'
            ]).groupBy('user.id, user.firstName, user.lastName, user.phone, user.roles, user.grade, user.lastLogin, user.skuTest').orderBy(`user.${validatedSortBy}`, sortOrder);
            if (searchInput) {
                queryBuilder = queryBuilder.andWhere(`(CONCAT(user.firstName, ' ', user.lastName) ILIKE :searchInput OR user.phone ILIKE :searchInput OR CAST(user.skuTest AS TEXT) ILIKE :searchInput)`, {
                    searchInput: `%${searchInput}%`
                });
            }
            if (role !== undefined && role !== '') {
                queryBuilder = queryBuilder.andWhere('user.roles = :roles', {
                    role
                });
            }
            if (all === 'true') {
                const users = yield queryBuilder.getRawMany();
                const adminCount = yield _this.userRepository.count({
                    where: {
                        role: _userentity.UserRole.ADMIN
                    }
                });
                const userCount = yield _this.userRepository.count({
                    where: {
                        role: _userentity.UserRole.USER
                    }
                });
                const response = {
                    data: users,
                    total: users.length,
                    adminCount,
                    userCount,
                    totalPages: 1,
                    page: 1,
                    limit: users.length
                };
                return (0, _responseutil.createResponse)(200, response);
            }
            const offset = (page - 1) * limit;
            queryBuilder = queryBuilder.skip(offset).take(limit);
            const users = yield queryBuilder.getRawMany();
            const total = yield _this.userRepository.count();
            const totalPages = Math.ceil(total / limit);
            const response = {
                data: users,
                total,
                totalPages,
                page,
                limit
            };
            return (0, _responseutil.createResponse)(200, response);
        })();
    }
    getAdminCount() {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.userRepository.count({
                where: {
                    role: _userentity.UserRole.ADMIN
                }
            });
        })();
    }
    getUserCount() {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.userRepository.count({
                where: {
                    role: _userentity.UserRole.ADMIN
                }
            });
        })();
    }
    getUserDataWithToken(userPhone) {
        var _this = this;
        return _async_to_generator(function*() {
            const existingUser = yield _this.userRepository.createQueryBuilder('user').leftJoin('user.subscribes', 'subscribe').leftJoin('user.userDetail', 'userDetail').where('user.phone = :phone', {
                phone: userPhone
            }).orderBy('userDetail.loginDate', 'DESC').select([
                'user.id',
                'user.firstName',
                'user.lastName',
                'user.phone',
                'user.imageUrl',
                'user.createdAt',
                'user.updatedAt',
                'user.lastLogin',
                'userDetail.ip',
                'userDetail.platform',
                'userDetail.browser',
                'userDetail.versionBrowser',
                'userDetail.versionPlatform',
                'userDetail.loginDate',
                'subscribe.isActive'
            ]).limit(1).getOne();
            if (existingUser) {
                return existingUser;
            } else {
                return {
                    error: 'کاربری با این شماره پیدا نشد',
                    status: 404
                };
            }
        })();
    }
    editDataUser(authHeader, editData) {
        var _this = this;
        return _async_to_generator(function*() {
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new _common.UnauthorizedException('توکن وجود ندارد');
            }
            const token = authHeader.split(' ')[1];
            const tokenData = yield _this.tokenRepository.createQueryBuilder('token').leftJoin('token.user', 'user').where('token.token = :token', {
                token
            }).select([
                'token.token',
                'user.phone'
            ]).getOne();
            if (!tokenData) {
                throw new _common.UnauthorizedException('توکن اشتباه است');
            }
            const updateData = {
                updatedAt: new Date()
            };
            if (editData.firstName !== undefined) {
                updateData.firstName = editData.firstName;
            }
            if (editData.lastName !== undefined) {
                updateData.lastName = editData.lastName;
            }
            if (editData.imageUrl !== undefined) {
                updateData.imageUrl = editData.imageUrl;
            }
            if (Object.keys(updateData).length > 1) {
                const updatedUser = yield _this.userRepository.createQueryBuilder().update(_userentity.User).set(updateData).where('phone = :phone', {
                    phone: tokenData.user.phone
                }).returning([
                    'phone',
                    'firstName',
                    'lastName',
                    'imageUrl',
                    'updatedAt'
                ]).execute();
                const updatedUserData = updatedUser.raw[0];
                delete updatedUserData.password;
                return {
                    message: 'با موفقیت بروز شد',
                    user: updatedUserData,
                    status: 200
                };
            } else {
                const currentUser = yield _this.userRepository.findOne({
                    where: {
                        phone: tokenData.user.phone
                    }
                });
                if (!currentUser) {
                    throw new _common.NotFoundException('کاربری با این شناسه یافت نشد');
                }
                delete currentUser.password;
                return {
                    message: 'بدون تغییرات',
                    user: currentUser,
                    status: 200
                };
            }
        })();
    }
    constructor(userRepository, tokenRepository, smsService){
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.smsService = smsService;
    }
};
UserService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_tokenentity.Token)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _index.Repository === "undefined" ? Object : _index.Repository,
        typeof _index.Repository === "undefined" ? Object : _index.Repository,
        typeof _smsservice.SmsService === "undefined" ? Object : _smsservice.SmsService
    ])
], UserService);

//# sourceMappingURL=user.service.js.map