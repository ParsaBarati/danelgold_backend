"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CollectionsService", {
    enumerable: true,
    get: function() {
        return CollectionsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _collectionentity = require("./entity/collection.entity");
const _responseutil = require("../utils/response.util");
const _userentity = require("../user/entity/user.entity");
const _pagitnateservice = require("../common/paginate/pagitnate.service");
const _nftentity = require("../nft/entity/nft.entity");
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
let CollectionsService = class CollectionsService {
    createCollection(createCollectionDto, creatorPhone) {
        var _this = this;
        return _async_to_generator(function*() {
            const { name, description } = createCollectionDto;
            const creator = yield _this.userRepository.findOne({
                where: {
                    phone: creatorPhone
                }
            });
            if (!creator) {
                throw new _common.NotFoundException('کاربر یافت نشد');
            }
            const collection = {
                name,
                description,
                creator,
                createdAt: new Date()
            };
            const newCollection = yield _this.collectionsRepository.save(collection);
            return (0, _responseutil.createResponse)(201, newCollection);
        })();
    }
    updateCollection(collectionId, updateCollectionDto, currentOwnerPhone, currentUserRoles) {
        var _this = this;
        return _async_to_generator(function*() {
            const collection = yield _this.collectionsRepository.findOne({
                where: {
                    id: collectionId
                },
                relations: [
                    'nfts'
                ]
            });
            if (!collection) {
                throw new _common.NotFoundException('مجموعه یافت نشد');
            }
            const isOwner = collection.creatorPhone === currentOwnerPhone;
            const isAdmin = currentUserRoles.includes(_userentity.UserRole.ADMIN);
            if (!isOwner && !isAdmin) {
                throw new _common.BadRequestException('شما مجاز به ویرایش نیستید');
            }
            if (updateCollectionDto.name !== undefined) {
                collection.name = updateCollectionDto.name;
            }
            if (updateCollectionDto.description !== undefined) {
                collection.description = updateCollectionDto.description;
            }
            collection.updatedAt = new Date();
            const updatedCollection = yield _this.collectionsRepository.save(collection);
            return (0, _responseutil.createResponse)(200, updatedCollection);
        })();
    }
    getAllCollections(query) {
        var _this = this;
        return _async_to_generator(function*() {
            const { page = 1, limit = 10, search, sort = 'id', sortOrder = 'DESC' } = query;
            const queryBuilder = _this.collectionsRepository.createQueryBuilder('collections').leftJoinAndSelect('collections.users', 'user').select([
                'collections.id',
                'collections.name',
                'collections.description',
                'collections.createdAt',
                'collections.updatedAt'
            ]).addSelect([
                'user.firstName',
                'user.lastName'
            ]).orderBy(`collections.${sort}`, sortOrder).skip((page - 1) * limit).take(limit);
            const paginationResult = yield _this.paginationService.paginate(queryBuilder, page, limit);
            if (search) {
                queryBuilder.andWhere('(collections.name ILIKE :search)', {
                    search: `%${search}%`
                });
            }
            return (0, _responseutil.createResponse)(200, paginationResult);
        })();
    }
    getAuctionById(collectionId) {
        var _this = this;
        return _async_to_generator(function*() {
            const collection = yield _this.collectionsRepository.findOne({
                where: {
                    id: collectionId
                },
                relations: [
                    'nfts'
                ]
            });
            if (!collection) {
                throw new _common.NotFoundException('مزایده یافت نشد');
            }
            const existingCollection = yield _this.collectionsRepository.createQueryBuilder('collections').leftJoinAndSelect('collections.nfts', 'nft').leftJoinAndSelect('collections.user', 'collectionUser').leftJoinAndSelect('nfts.users', 'nftUser').select([
                'collections.id',
                'collections.name',
                'collections.description',
                'collections.creatorPhone',
                'collections.createdAt',
                'collections.updatedAt'
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
                'collectionUser.firstName',
                'collectionUser.lastName'
            ]).addSelect([
                'nftUser.firstName',
                'nftUser.lastName'
            ]).where('collections.id = :collectionId', {
                collectionId
            });
            return (0, _responseutil.createResponse)(200, existingCollection);
        })();
    }
    addNftToCollection(nftId, collectionId, currentOwnerPhone) {
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
            const collection = yield _this.collectionsRepository.findOne({
                where: {
                    id: collectionId
                }
            });
            if (!nft) {
                throw new _common.NotFoundException('NFT پیدا نشد');
            }
            if (!collection) {
                throw new _common.NotFoundException('مجموعه پیدا نشد');
            }
            const isOwner = nft.ownerPhone === currentOwnerPhone;
            if (!isOwner) {
                throw new _common.ForbiddenException('فقط مالک می‌تواند این NFT را به مجموعه اضافه کند');
            }
            nft.collectionEntity = collection;
            yield _this.nftsRepository.save(nft);
            return {
                message: 'NFT با موفقیت به مجموعه اضافه شد'
            };
        })();
    }
    removeNftFromCollection(nftId, currentOwnerPhone) {
        var _this = this;
        return _async_to_generator(function*() {
            const nft = yield _this.nftsRepository.findOne({
                where: {
                    id: nftId
                },
                relations: [
                    'owner',
                    'collection'
                ]
            });
            if (!nft) {
                throw new _common.NotFoundException('NFT پیدا نشد');
            }
            const isOwner = nft.ownerPhone === currentOwnerPhone;
            if (!isOwner) {
                throw new _common.ForbiddenException('فقط مالک می‌تواند این NFT را از مجموعه حذف کند');
            }
            if (!nft.collectionEntity) {
                throw new _common.BadRequestException('NFT در هیچ مجموعه‌ای نیست');
            }
            nft.collectionEntity = null;
            yield _this.nftsRepository.save(nft);
            return {
                message: 'NFT با موفقیت از مجموعه حذف شد'
            };
        })();
    }
    constructor(collectionsRepository, userRepository, nftsRepository, paginationService){
        this.collectionsRepository = collectionsRepository;
        this.userRepository = userRepository;
        this.nftsRepository = nftsRepository;
        this.paginationService = paginationService;
    }
};
CollectionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_collectionentity.CollectionEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_nftentity.NFT)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _pagitnateservice.PaginationService === "undefined" ? Object : _pagitnateservice.PaginationService
    ])
], CollectionsService);

//# sourceMappingURL=collection.service.js.map