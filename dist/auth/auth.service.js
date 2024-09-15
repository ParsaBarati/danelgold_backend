"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _userDetailservice = require("../user-detail/userDetail.service");
const _common = require("@nestjs/common");
const _bcryptjs = /*#__PURE__*/ _interop_require_wildcard(require("bcryptjs"));
const _responseutil = require("../utils/response.util");
const _otpservice = require("./otp/otp.service");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _tokenservice = require("./token/token.service");
const _userentity = require("../user/entity/user.entity");
const _userservice = require("../user/user.service");
const _userDetailentity = require("../user-detail/entity/userDetail.entity");
const _useragentutil = require("../common/utils/user-agent.util");
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
let AuthService = class AuthService {
    checkUser(phoneDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const { phone } = phoneDto;
            const user = yield _this.userRepository.findOneBy({
                phone
            });
            if (!user) {
                const data = {
                    registered: false,
                    login: false
                };
                return (0, _responseutil.createResponse)(_common.HttpStatus.OK, data);
            } else {
                return (0, _responseutil.createResponse)(_common.HttpStatus.OK, {
                    registered: true,
                    login: false
                });
            }
        })();
    }
    signUpUsers(signupDto, userAgent, req) {
        var _this = this;
        return _async_to_generator(function*() {
            const { phone, firstName, lastName, password, email } = signupDto;
            const existingUser = yield _this.userRepository.findOneBy({
                phone
            });
            if (existingUser) {
                throw new _common.BadRequestException('کاربر از قبل وجود دارد');
            }
            const hashedPassword = yield _bcryptjs.hash(password, 10);
            const data = {
                name: firstName,
                family: lastName,
                userName: phone,
                password,
                email
            };
            const newUser = yield _this.userService.singupUser({
                firstName,
                lastName,
                phone,
                password: hashedPassword,
                email,
                createdAt: new Date()
            });
            const userDetail = _this.userDetailRepository.create(_object_spread({
                user: newUser
            }, userAgent));
            yield _this.userDetailRepository.save(userDetail);
            const token = yield _this.tokenService.createToken(newUser);
            return (0, _responseutil.createResponse)(201, {
                message: 'ثبت نام با موفقیت انجام شد',
                token,
                username: newUser.phone,
                register: true
            });
        })();
    }
    loginWithOTP(phoneDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const { phone } = phoneDto;
            const otp = yield _this.otpService.sendOTP(phone);
            return (0, _responseutil.createResponse)(200);
        })();
    }
    verifyWithOTP(verifyOtpDto, req) {
        var _this = this;
        return _async_to_generator(function*() {
            const { phone, otp } = verifyOtpDto;
            const isValidOTP = yield _this.otpService.verifyOTP(phone, otp);
            if (!isValidOTP) {
                throw new _common.NotAcceptableException('رمز یکبار مصرف اشتباه است');
            }
            const user = yield _this.userRepository.findOneBy({
                phone
            });
            if (!user) {
                return (0, _responseutil.createResponse)(201, {
                    register: false,
                    otp: true
                }, 'کاربر یافت نشد، اما رمز یکبار مصرف صحیح است');
            }
            user.lastLogin = new Date();
            const updateUserDTO = {
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                roles: user.role,
                imageUrl: user.imageUrl,
                lastLogin: user.lastLogin
            };
            yield _this.userService.updateUser(user.phone, updateUserDTO);
            const userAgentHeader = req.headers['user-agent'];
            const userAgent = {
                platform: yield (0, _useragentutil.getUserOS)(req),
                browser: yield (0, _useragentutil.getUserBrowser)(req),
                versionBrowser: yield (0, _useragentutil.getBrowserVersion)(req),
                versionPlatform: yield (0, _useragentutil.getVersionPlatform)(req),
                ip: yield (0, _useragentutil.getUserIP)(req)
            };
            yield _this.userDetailService.createUserDetail(user.phone, userAgent);
            const token = yield _this.tokenService.createToken(user);
            return (0, _responseutil.createResponse)(200, {
                token,
                username: user.phone,
                rolse: user.role
            });
        })();
    }
    loginUserWithPassword(loginDto, req) {
        var _this = this;
        return _async_to_generator(function*() {
            const { phone, password } = loginDto;
            const user = yield _this.userRepository.findOneBy({
                phone
            });
            if (!user) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            const passwordMatch = yield _bcryptjs.compare(password, user.password);
            if (!passwordMatch) {
                throw new _common.NotAcceptableException('رمز عبور اشتباه است');
            }
            user.lastLogin = new Date();
            const updateUserDTO = {
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                roles: user.role,
                imageUrl: user.imageUrl,
                lastLogin: user.lastLogin
            };
            yield _this.userService.updateUser(user.phone, updateUserDTO);
            const userAgent = {
                platform: yield (0, _useragentutil.getUserOS)(req),
                browser: yield (0, _useragentutil.getUserBrowser)(req),
                versionBrowser: yield (0, _useragentutil.getBrowserVersion)(req),
                versionPlatform: yield (0, _useragentutil.getVersionPlatform)(req),
                ip: yield (0, _useragentutil.getUserIP)(req)
            };
            yield _this.userDetailService.createUserDetail(user.phone, userAgent);
            const token = yield _this.tokenService.createToken(user);
            return (0, _responseutil.createResponse)(200, {
                token,
                username: user.phone,
                rolse: user.role
            });
        })();
    }
    forgetPasswordWithOTP(phone) {
        var _this = this;
        return _async_to_generator(function*() {
            const existingUser = yield _this.userRepository.findOneBy({
                phone
            });
            if (!existingUser) {
                throw new _common.NotFoundException('کاربری یافت نشد');
            }
            yield _this.otpService.sendOTP(phone);
            return (0, _responseutil.createResponse)(200, {
                registred: true,
                login: false
            }, 'رمز یکبار مصرف ارسال شد');
        })();
    }
    resetPasswordWithOTP(resetPasswordDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const { phone, password, otp } = resetPasswordDto;
            const isValidOTP = yield _this.otpService.verifyOTP(phone, otp);
            if (!isValidOTP) {
                throw new _common.NotAcceptableException('رمز یکبار مصرف اشتباه است');
            }
            const existingUser = yield _this.userRepository.findOneBy({
                phone
            });
            if (!existingUser) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            const hashedPassword = yield _bcryptjs.hash(password, 10);
            existingUser.password = hashedPassword;
            yield _this.userRepository.save(existingUser);
            return (0, _responseutil.createResponse)(200, {
                login: false
            }, 'رمز عبور با موفقیت تغییر یافت');
        })();
    }
    constructor(userRepository, userService, otpService, userDetailRepository, userDetailService, tokenService){
        this.userRepository = userRepository;
        this.userService = userService;
        this.otpService = otpService;
        this.userDetailRepository = userDetailRepository;
        this.userDetailService = userDetailService;
        this.tokenService = tokenService;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_userDetailentity.UserDetail)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _userservice.UserService === "undefined" ? Object : _userservice.UserService,
        typeof _otpservice.OtpService === "undefined" ? Object : _otpservice.OtpService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _userDetailservice.UserDetailService === "undefined" ? Object : _userDetailservice.UserDetailService,
        typeof _tokenservice.TokenService === "undefined" ? Object : _tokenservice.TokenService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map