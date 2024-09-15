"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserController", {
    enumerable: true,
    get: function() {
        return UserController;
    }
});
const _common = require("@nestjs/common");
const _userservice = require("./user.service");
const _createuserdto = require("./dto/create-user.dto");
const _userentity = require("./entity/user.entity");
const _updateuserdto = require("./dto/update-user.dto");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _swagger = require("@nestjs/swagger");
const _express = require("express");
const _edituserdatedto = require("./dto/edit-user-date.dto");
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
let UserController = class UserController {
    createUser(createUserDTO) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.userService.createUser(createUserDTO);
        })();
    }
    updateUser(phone, updateUserDTO) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.userService.updateUser(phone, updateUserDTO);
        })();
    }
    editUser(authHeader, editData) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.userService.editDataUser(authHeader, editData);
        })();
    }
    getUsers(page, limit, searchInput, roles, all, sort, sortOrder) {
        var _this = this;
        return _async_to_generator(function*() {
            const result = yield _this.userService.getUsers(page || 1, limit || 10, searchInput || '', roles, all || 'false', sort || 'id', sortOrder || 'DESC');
            return _object_spread_props(_object_spread({
                status: 200
            }, result), {
                adminCount: yield _this.userService.getAdminCount(),
                userCount: yield _this.userService.getUserCount()
            });
        })();
    }
    getUserDataWithToken(req) {
        var _this = this;
        return _async_to_generator(function*() {
            const userPhone = req.user.result.phone;
            return yield _this.userService.getUserDataWithToken(userPhone);
        })();
    }
    getUserByPhone(phone) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.userService.getUserByPhone(phone);
        })();
    }
    deleteUsers(phone) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.userService.deleteUsers(phone);
        })();
    }
    constructor(userService){
        this.userService = userService;
    }
};
_ts_decorate([
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN),
    (0, _common.Post)('user'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createuserdto.CreateUserByAdminDTO === "undefined" ? Object : _createuserdto.CreateUserByAdminDTO
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
_ts_decorate([
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN),
    (0, _common.Put)('user/:phone'),
    _ts_param(0, (0, _common.Param)('phone')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updateuserdto.UpdateUserDTO === "undefined" ? Object : _updateuserdto.UpdateUserDTO
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
_ts_decorate([
    (0, _common.Put)('profile'),
    _ts_param(0, (0, _common.Headers)('authorization')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _edituserdatedto.editDateUser === "undefined" ? Object : _edituserdatedto.editDateUser
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
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
        name: 'search',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'roles',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'all',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sortBy',
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'sortOrder',
        required: false
    }),
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN, _userentity.UserRole.USER),
    (0, _common.Get)('users'),
    _ts_param(0, (0, _common.Query)('page', new _common.DefaultValuePipe(1), _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Query)('limit', new _common.DefaultValuePipe(10), _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Query)('search')),
    _ts_param(3, (0, _common.Query)('roles')),
    _ts_param(4, (0, _common.Query)('all')),
    _ts_param(5, (0, _common.Query)('sortBy')),
    _ts_param(6, (0, _common.Query)('sortOrder')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number,
        String,
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
_ts_decorate([
    (0, _common.Get)('profile'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "getUserDataWithToken", null);
_ts_decorate([
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN),
    (0, _common.Get)('user/:phone'),
    _ts_param(0, (0, _common.Param)('phone')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "getUserByPhone", null);
_ts_decorate([
    (0, _rolesdecorator.Roles)(_userentity.UserRole.ADMIN),
    (0, _common.Delete)('delete/:phone'),
    _ts_param(0, (0, _common.Param)('phone')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UserController.prototype, "deleteUsers", null);
UserController = _ts_decorate([
    (0, _swagger.ApiTags)('User'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService
    ])
], UserController);

//# sourceMappingURL=user.controller.js.map