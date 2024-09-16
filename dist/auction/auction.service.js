"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuctionsService", {
    enumerable: true,
    get: function() {
        return AuctionsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _auctionentity = require("./entity/auction.entity");
const _responseutil = require("../utils/response.util");
const _pagitnateservice = require("../common/paginate/pagitnate.service");
const _cron = require("cron");
const _userentity = require("../user/entity/user.entity");
const _auctionBidentity = require("./entity/auctionBid.entity");
const _typeorm1 = require("@nestjs/typeorm");
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
let AuctionsService = class AuctionsService {
    createAuction(createAuctionDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const { title, startTime, endTime, startingBid, currentBid, isSms } = createAuctionDto;
            if (endTime && startTime && endTime < startTime) {
                throw new _common.BadRequestException('تاریخ پایان مزایده نمی تواند زودتر از تاریخ شروع آن باشد');
            }
            const auction = {
                title,
                startTime,
                endTime,
                startingBid,
                currentBid,
                isSms: isSms,
                auctionStatus: _auctionentity.AuctionStatus.Active,
                createdAt: new Date()
            };
            const savedAuction = yield _this.auctionsRepository.save(auction);
            return (0, _responseutil.createResponse)(201, savedAuction);
        })();
    }
    updateAuction(auctionId, updateAuctionDto) {
        var _this = this;
        return _async_to_generator(function*() {
            const { title, startTime, endTime, startingBid, currentBid, isSms, auctionStatus } = updateAuctionDto;
            const existingAuction = yield _this.auctionsRepository.findOne({
                where: {
                    id: auctionId
                }
            });
            if (!existingAuction) {
                throw new _common.NotFoundException('مزایده مورد نظر پیدا نشد');
            }
            existingAuction.title = title !== null && title !== void 0 ? title : existingAuction.title;
            existingAuction.startTime = startTime !== null && startTime !== void 0 ? startTime : existingAuction.startTime;
            existingAuction.endTime = endTime !== null && endTime !== void 0 ? endTime : existingAuction.endTime;
            existingAuction.startingBid = startingBid !== null && startingBid !== void 0 ? startingBid : existingAuction.startingBid;
            existingAuction.currentBid = currentBid !== null && currentBid !== void 0 ? currentBid : existingAuction.currentBid;
            existingAuction.isSms = isSms !== null && isSms !== void 0 ? isSms : existingAuction.isSms;
            existingAuction.auctionStatus = auctionStatus !== null && auctionStatus !== void 0 ? auctionStatus : existingAuction.auctionStatus;
            const updatedAuction = yield _this.auctionsRepository.save(existingAuction);
            return (0, _responseutil.createResponse)(200, updatedAuction);
        })();
    }
    deleteAuction(auctionId) {
        var _this = this;
        return _async_to_generator(function*() {
            const auction = yield _this.auctionsRepository.findOne({
                where: {
                    id: auctionId
                }
            });
            if (!auction) {
                throw new _common.NotFoundException('مزایده یافت نشد');
            }
            if (auction.auctionStatus === _auctionentity.AuctionStatus.Active) {
                throw new _common.BadRequestException('مزایده فعال قابل حذف نیست');
            }
            yield _this.auctionsRepository.remove(auction);
            return {
                message: 'مزایده با موفقیت حذف گردید'
            };
        })();
    }
    getAllAuctions(query) {
        var _this = this;
        return _async_to_generator(function*() {
            const { page = 1, limit = 10, search, sort = 'id', sortOrder = 'DESC' } = query;
            const queryBuilder = _this.auctionsRepository.createQueryBuilder('auctions').select([
                'auctions.id',
                'auctions.title',
                'auctions.startTime',
                'auctions.endTime',
                'auctions.startingBid',
                'auctions.currentBid',
                'auctions.auctionStatus',
                'auctions.createdAt',
                'auctions.updatedAt'
            ]).orderBy(`auctions.${sort}`, sortOrder).skip((page - 1) * limit).take(limit);
            const paginationResult = yield _this.paginationService.paginate(queryBuilder, page, limit);
            if (search) {
                queryBuilder.andWhere('(auctions.title ILIKE :search)', {
                    search: `%${search}%`
                });
            }
            return (0, _responseutil.createResponse)(200, paginationResult);
        })();
    }
    getAuctionById(auctionId) {
        var _this = this;
        return _async_to_generator(function*() {
            const auction = yield _this.auctionsRepository.findOne({
                where: {
                    id: auctionId
                },
                relations: [
                    'nfts'
                ]
            });
            if (!auction) {
                throw new _common.NotFoundException('مزایده یافت نشد');
            }
            const existingAuction = yield _this.auctionsRepository.createQueryBuilder('auctions').leftJoinAndSelect('auctions.nfts', 'nft').leftJoinAndSelect('nfts.users', 'user').select([
                'auctions.id',
                'auctions.title',
                'auctions.startTime',
                'auctions.endTime',
                'auctions.startingBid',
                'auctions.currentBid',
                'auctions.auctionStatus',
                'auctions.createdAt',
                'auctions.updatedAt'
            ]).addSelect([
                'nft.id',
                'nft.name',
                'nft.description',
                'nft.imageURL',
                'nft.matadataUrl',
                'nft.ownerPhone',
                'nft.creatorPhone',
                'nft.price',
                'nft.createdAt',
                'nft.updatedAt'
            ]).addSelect([
                'user.firstName',
                'user.lastName'
            ]).where('auctions.id = :auctionId', {
                auctionId
            });
            return (0, _responseutil.createResponse)(200, existingAuction);
        })();
    }
    participateAuction(auctionId, participateAuctionDto, userPhone) {
        var _this = this;
        return _async_to_generator(function*() {
            const { bidAmount } = participateAuctionDto;
            const auction = yield _this.auctionsRepository.findOne({
                where: {
                    id: auctionId
                },
                relations: [
                    'bids'
                ]
            });
            if (!auction) {
                throw new _common.NotFoundException('مزایده یافت نشد');
            }
            if (auction.auctionStatus === _auctionentity.AuctionStatus.Deactive) {
                throw new _common.BadRequestException('مزایده به پایان رسیده است');
            }
            if (bidAmount <= (auction.currentBid || 0)) {
                throw new _common.BadRequestException('مقدار پیشنهاد باید بیشتر از پیشنهاد فعلی باشد');
            }
            const user = yield _this.userRepository.findOne({
                where: {
                    phone: userPhone
                }
            });
            if (!user) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            const newBid = _this.bidRepository.create({
                amount: bidAmount,
                auction,
                user,
                createdAt: new Date()
            });
            yield _this.bidRepository.save(newBid);
            auction.currentBid = bidAmount;
            auction.highestBidder = user;
            yield _this.auctionsRepository.save(auction);
            return {
                message: 'پیشنهاد با موفقیت ثبت شد'
            };
        })();
    }
    checkAuctionDate() {
        var _this = this;
        return _async_to_generator(function*() {
            const activeAuctions = yield _this.auctionsRepository.find({
                where: {
                    endTime: (0, _typeorm.LessThan)(new Date()),
                    auctionStatus: _auctionentity.AuctionStatus.Active
                }
            });
            if (activeAuctions.length > 0) {
                for (const activeAuction of activeAuctions){
                    activeAuction.auctionStatus = _auctionentity.AuctionStatus.Deactive;
                }
                yield _this.auctionsRepository.save(activeAuctions);
            }
            return {
                statusCode: 200,
                message: 'active auctions dueDate checked and deactive'
            };
        })();
    }
    onModuleInit() {
        var _this = this;
        this.job = new _cron.CronJob('* * * * *', /*#__PURE__*/ _async_to_generator(function*() {
            yield _this.checkAuctionDate();
            console.log('Cron job for deactivating auctions ran.');
        }));
        this.job.start();
    }
    onModuleDestroy() {
        if (this.job) {
            this.job.stop();
        }
    }
    constructor(auctionsRepository, bidRepository, userRepository, paginationService, smsService){
        this.auctionsRepository = auctionsRepository;
        this.bidRepository = bidRepository;
        this.userRepository = userRepository;
        this.paginationService = paginationService;
        this.smsService = smsService;
    }
};
AuctionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm1.InjectRepository)(_auctionentity.Auction)),
    _ts_param(1, (0, _typeorm1.InjectRepository)(_auctionBidentity.Bid)),
    _ts_param(2, (0, _typeorm1.InjectRepository)(_userentity.User)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.Repository === "undefined" ? Object : _typeorm.Repository,
        typeof _typeorm.Repository === "undefined" ? Object : _typeorm.Repository,
        typeof _typeorm.Repository === "undefined" ? Object : _typeorm.Repository,
        typeof _pagitnateservice.PaginationService === "undefined" ? Object : _pagitnateservice.PaginationService,
        typeof _smsservice.SmsService === "undefined" ? Object : _smsservice.SmsService
    ])
], AuctionsService);

//# sourceMappingURL=auction.service.js.map