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
const _IPFSservice = require("../services/IPFS.service");
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
    mintNFT(creatorPhone, name, price, imageURL, description) {
        var _this = this;
        return _async_to_generator(function*() {
            const creator = yield _this.userRepository.findOne({
                where: {
                    phone: creatorPhone
                }
            });
            if (!creator) {
                throw new _common.NotFoundException('User not found');
            }
            const metadata = {
                name,
                description,
                image: imageURL,
                price
            };
            const metadataURL = yield _this.ipfsService.uploadMetadataToIPFS(metadata);
            const nft = _this.nftsRepository.create({
                name,
                description,
                imageURL,
                metadataURL,
                price,
                createdAt: new Date(),
                creator,
                owner: creator
            });
            const newNFT = yield _this.nftsRepository.save(nft);
            return (0, _responseutil.createResponse)(201, newNFT);
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
                throw new _common.NotFoundException('NFT not found');
            }
            const isOwner = nft.owner.phone === currentOwnerPhone;
            const isAdmin = currentUserRoles.includes(_userentity.UserRole.ADMIN);
            if (!isOwner && !isAdmin) {
                throw new _common.ForbiddenException('Only the owner can burn this NFT');
            }
            yield _this.nftsRepository.remove(nft);
            return {
                message: 'NFT successfully burned'
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
                    'creator',
                    'owner',
                    'collections'
                ]
            });
            if (!nft) {
                throw new _common.NotFoundException('NFT not found');
            }
            const existingNFT = yield _this.nftsRepository.createQueryBuilder('nfts').leftJoinAndSelect('nfts.creator', 'creator').leftJoinAndSelect('nfts.owner', 'owner').leftJoinAndSelect('nfts.collections', 'collection').select([
                'nft.id',
                'nft.name',
                'nft.description',
                'nft.imageURL',
                'nft.metadataURL',
                'nft.price',
                'nft.createdAt',
                'nft.updatedAt',
                'creator.firstName',
                'creator.lastName',
                'owner.firstName',
                'owner.lastName',
                'collection.id',
                'collection.name',
                'collection.description'
            ]).where('nfts.id = :nftId', {
                nftId
            }).getOne();
            return (0, _responseutil.createResponse)(200, existingNFT);
        })();
    }
    constructor(nftsRepository, userRepository, ipfsService){
        this.nftsRepository = nftsRepository;
        this.userRepository = userRepository;
        this.ipfsService = ipfsService;
    }
};
NFTsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_nftentity.NFT)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _IPFSservice.IPFSService === "undefined" ? Object : _IPFSservice.IPFSService
    ])
], NFTsService);

//# sourceMappingURL=nft.service.js.map