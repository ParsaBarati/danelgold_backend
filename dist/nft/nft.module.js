"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NFTModule", {
    enumerable: true,
    get: function() {
        return NFTModule;
    }
});
const _common = require("@nestjs/common");
const _nftentity = require("./entity/nft.entity");
const _nftcontroller = require("./nft.controller");
const _nftservice = require("./nft.service");
const _userentity = require("../user/entity/user.entity");
const _typeorm = require("@nestjs/typeorm");
const _IPFSservice = require("../services/IPFS.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let NFTModule = class NFTModule {
};
NFTModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _nftentity.NFT,
                _userentity.User
            ])
        ],
        controllers: [
            _nftcontroller.NFTsController
        ],
        providers: [
            _nftservice.NFTsService,
            _IPFSservice.IPFSService
        ]
    })
], NFTModule);

//# sourceMappingURL=nft.module.js.map