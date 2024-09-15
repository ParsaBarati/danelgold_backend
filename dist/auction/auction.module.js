"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuctionModule", {
    enumerable: true,
    get: function() {
        return AuctionModule;
    }
});
const _common = require("@nestjs/common");
const _auctionentity = require("./entity/auction.entity");
const _auctioncontroller = require("./auction.controller");
const _auctionservice = require("./auction.service");
const _auctionBidentity = require("./entity/auctionBid.entity");
const _userentity = require("../user/entity/user.entity");
const _pagitnateservice = require("../common/paginate/pagitnate.service");
const _smsservice = require("../services/sms.service");
const _typeorm = require("@nestjs/typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuctionModule = class AuctionModule {
};
AuctionModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _auctionentity.Auction,
                _auctionBidentity.Bid,
                _userentity.User
            ])
        ],
        controllers: [
            _auctioncontroller.AuctionsController
        ],
        providers: [
            _auctionservice.AuctionsService,
            _pagitnateservice.PaginationService,
            _smsservice.SmsService
        ]
    })
], AuctionModule);

//# sourceMappingURL=auction.module.js.map