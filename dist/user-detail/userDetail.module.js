"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserDetailModule", {
    enumerable: true,
    get: function() {
        return UserDetailModule;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _common = require("@nestjs/common");
const _userDetailcontroller = require("./userDetail.controller");
const _userDetailservice = require("./userDetail.service");
const _userentity = require("../user/entity/user.entity");
const _userDetailentity = require("./entity/userDetail.entity");
const _pagitnateservice = require("../common/paginate/pagitnate.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UserDetailModule = class UserDetailModule {
};
UserDetailModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _userentity.User,
                _userDetailentity.UserDetail
            ])
        ],
        controllers: [
            _userDetailcontroller.UserDetailController
        ],
        providers: [
            _userDetailservice.UserDetailService,
            _pagitnateservice.PaginationService
        ]
    })
], UserDetailModule);

//# sourceMappingURL=userDetail.module.js.map