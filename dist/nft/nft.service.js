"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NFTsService", {
    enumerable: true,
    get: function() {
        return NFTsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _nftentity = require("./entity/nft.entity");
const _responseutil = require("../utils/response.util");
const _userentity = require("../user/entity/user.entity");
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
let NFTsService = class NFTsService {
    mintNFT(mintNFTDto, creatorPhone) {
        var _this = this;
        return _async_to_generator(function*() {
            const { name, description, imageURL, metadataURL, price } = mintNFTDto;
            const creator = yield _this.userRepository.findOne({
                where: {
                    phone: creatorPhone
                }
            });
            if (!creator) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            const nft = {
                name,
                description,
                imageURL,
                metadataURL,
                price,
                createdAt: new Date(),
                creator,
                owner: creator
            };
            const newNFT = yield _this.nftsRepository.save(nft);
            return (0, _responseutil.createResponse)(201, newNFT);
        })();
    }
    updateNFT(nftId, updateNFTDto, currentOwnerPhone, currentUserRoles) {
        var _this = this;
        return _async_to_generator(function*() {
            const nft = yield _this.nftsRepository.findOne({
                where: {
                    id: nftId
                },
                relations: [
                    'owner'
                ]
            });
            if (!nft) {
                throw new _common.NotFoundException('NFT یافت نشد');
            }
            const isOwner = nft.ownerPhone === currentOwnerPhone;
            const isAdmin = currentUserRoles.includes(_userentity.UserRole.ADMIN);
            if (!isOwner && !isAdmin) {
                throw new _common.BadRequestException('شما مجاز به ویرایش نیستید');
            }
            if (updateNFTDto.name !== undefined) {
                nft.name = updateNFTDto.name;
            }
            if (updateNFTDto.description !== undefined) {
                nft.description = updateNFTDto.description;
            }
            if (updateNFTDto.price !== undefined) {
                nft.price = updateNFTDto.price;
            }
            nft.updatedAt = new Date();
            const updatedNFT = yield _this.nftsRepository.save(nft);
            return (0, _responseutil.createResponse)(200, updatedNFT);
        })();
    }
    burnNFT(nftId, currentOwnerPhone, currentUserRoles) {
        var _this = this;
        return _async_to_generator(function*() {
            const nft = yield _this.nftsRepository.findOne({
                where: {
                    id: nftId
                },
                relations: [
                    'owner'
                ]
            });
            if (!nft) {
                throw new _common.NotFoundException('NFT یافت نشد');
            }
            const isOwner = nft.ownerPhone === currentOwnerPhone;
            const isAdmin = currentUserRoles.includes(_userentity.UserRole.ADMIN);
            if (!isOwner && !isAdmin) {
                throw new _common.ForbiddenException('فقط مالک می‌تواند این NFT را بسوزاند');
            }
            yield _this.nftsRepository.remove(nft);
            return {
                message: 'NFT با موفقیت سوزانده شد'
            };
        })();
    }
    getNFTById(nftId) {
        var _this = this;
        return _async_to_generator(function*() {
            const nft = yield _this.nftsRepository.findOne({
                where: {
                    id: nftId
                },
                relations: [
                    'collections'
                ]
            });
            if (!nft) {
                throw new _common.NotFoundException('NFT یافت نشد');
            }
            const existingNFT = yield _this.nftsRepository.createQueryBuilder('nfts').leftJoinAndSelect('nfts.creator', 'creator').leftJoinAndSelect('nfts.owner', 'owner').leftJoinAndSelect('nfts.collections', 'collection').select([
                'nft.id',
                'nft.name',
                'nft.description',
                'nft.imageUrl',
                'nft.matadataUrl',
                'nft.price',
                'nft.createdAt',
                'nft.updatedAt'
            ]).addSelect([
                'creator.firstName',
                'creator.lastName'
            ]).addSelect([
                'owner.firstName',
                'owner.lastName'
            ]).addSelect([
                'collection.id',
                'collection.name',
                'collection.description'
            ]).where('nfts.id = :nftId', {
                nftId
            });
            return (0, _responseutil.createResponse)(200, existingNFT);
        })();
    }
    constructor(nftsRepository, userRepository){
        this.nftsRepository = nftsRepository;
        this.userRepository = userRepository;
    }
};
NFTsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_nftentity.NFT)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], NFTsService);

//# sourceMappingURL=nft.service.js.map