"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WalletService", {
    enumerable: true,
    get: function() {
        return WalletService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _walletentity = require("./entity/wallet.entity");
const _uuid = require("uuid");
const _walletTransactionentity = require("./entity/walletTransaction.entity");
const _userentity = require("../user/entity/user.entity");
const _transactionentity = require("../transaction/entity/transaction.entity");
const _zarinpalservice = require("../payment/zarinpal.service");
const _pagitnateservice = require("../common/paginate/pagitnate.service");
const _responseutil = require("../utils/response.util");
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
let WalletService = class WalletService {
    getBalance(userPhone) {
        var _this = this;
        return _async_to_generator(function*() {
            const wallet = yield _this.walletRepository.findOne({
                where: {
                    userPhone
                }
            });
            const walletResult = wallet ? wallet.balance : 0;
            return {
                result: walletResult,
                statusCode: _common.HttpStatus.OK
            };
        })();
    }
    increaseBalance(userPhone, amount) {
        var _this = this;
        return _async_to_generator(function*() {
            let wallet = yield _this.walletRepository.findOne({
                where: {
                    userPhone
                }
            });
            if (!wallet) {
                wallet = _this.walletRepository.create({
                    userPhone,
                    balance: 0
                });
            }
            wallet.balance += amount;
            yield _this.walletRepository.save(wallet);
            const walletTransactionInstance = new _walletTransactionentity.walletTransaction();
            walletTransactionInstance.transaction = (0, _uuid.v4)().replace(/-/g, '').slice(0, 16);
            walletTransactionInstance.amount = amount;
            walletTransactionInstance.wallet = wallet;
            yield _this.walletTransactionRepository.save(walletTransactionInstance);
            return {
                message: 'با موفقیت اضافه شد',
                statusCode: 201
            };
        })();
    }
    decreaseBalance(userPhone, amount, orderId) {
        var _this = this;
        return _async_to_generator(function*() {
            const wallet = yield _this.walletRepository.findOne({
                where: {
                    userPhone
                }
            });
            if (!wallet || wallet.balance < amount) {
                throw new _common.BadRequestException('محاسبات نباید منفی شود');
            }
            wallet.balance -= amount;
            yield _this.walletRepository.save(wallet);
            const walletTransactionInstance = new _walletTransactionentity.walletTransaction();
            walletTransactionInstance.transaction = (0, _uuid.v4)().replace(/-/g, '').slice(0, 16);
            walletTransactionInstance.amount = -amount;
            walletTransactionInstance.wallet = wallet;
            if (orderId) {
                walletTransactionInstance.orderId = orderId;
            }
            yield _this.walletTransactionRepository.save(walletTransactionInstance);
            return {
                message: 'با موفقیت کسر شد',
                statusCode: 201
            };
        })();
    }
    chargeWallet(userPhone, amount) {
        var _this = this;
        return _async_to_generator(function*() {
            const user = yield _this.userRepository.findOne({
                where: {
                    phone: userPhone
                }
            });
            if (!user) {
                throw new _common.NotFoundException('کاربر وجود ندارد');
            }
            let wallet = yield _this.walletRepository.findOne({
                where: {
                    userPhone
                }
            });
            if (!wallet) {
                wallet = _this.walletRepository.create({
                    userPhone,
                    balance: 0,
                    user
                });
                yield _this.walletRepository.save(wallet);
            }
            const transactionId = (0, _uuid.v4)().replace(/-/g, '').slice(0, 16);
            const { url, authority } = yield _this.zarinpalService.createPaymentRequest(amount, transactionId, 'wallet');
            const transaction = new _transactionentity.TransactionEntity();
            transaction.transaction = transactionId;
            transaction.isOpen = true;
            transaction.status = _transactionentity.TransactionStatus.Pending;
            transaction.authority = authority;
            transaction.amount = amount;
            transaction.wallet = wallet;
            yield _this.transactionRepository.save(transaction);
            return {
                url,
                authority,
                transactionId
            };
        })();
    }
    verifyPayment(transaction, status, res) {
        var _this = this;
        return _async_to_generator(function*() {
            const transactionEntity = yield _this.transactionRepository.findOne({
                where: {
                    transaction
                },
                relations: [
                    'wallet'
                ]
            });
            if (!transactionEntity) {
                throw new _common.NotFoundException('تراکنش یافت نشد');
            }
            const wallet = transactionEntity.wallet;
            if (!wallet) {
                throw new _common.NotFoundException('کیف پول یافت نشد');
            }
            const verificationResult = yield _this.zarinpalService.verifyPayment(transactionEntity.amount, transactionEntity.authority);
            console.log(`verificationResult >>> ${JSON.stringify(verificationResult)}`);
            transactionEntity.isOpen = false;
            if (verificationResult.code === 100 || status === 'OK') {
                transactionEntity.status = _transactionentity.TransactionStatus.Success;
                transactionEntity.refId = verificationResult.ref_id;
                yield _this.transactionRepository.save(transactionEntity);
                wallet.balance = +wallet.balance + +transactionEntity.amount;
                yield _this.walletRepository.save(wallet);
                return res.redirect(`${process.env.VERIFY_URL}${transaction}`);
            } else if (status === 'NOK') {
                transactionEntity.status = _transactionentity.TransactionStatus.Cancelled;
                yield _this.transactionRepository.save(transactionEntity);
                return res.redirect(`${process.env.VERIFY_URL}${transaction}`);
            }
        })();
    }
    getAllWallets(query) {
        var _this = this;
        return _async_to_generator(function*() {
            const { page = 1, limit = 10, search, sort = 'id', sortOrder = 'DESC' } = query;
            const queryBuilder = _this.walletRepository.createQueryBuilder('wallet').leftJoinAndSelect('wallet.user', 'user').select([
                'wallet.id',
                'wallet.balance',
                'wallet.createdAt',
                'wallet.updatedAt',
                'wallet.userPhone',
                'user.firstName',
                'user.lastName'
            ]).orderBy(`wallet.${sort}`, sortOrder).skip((page - 1) * limit).take(limit);
            const paginationResult = yield _this.paginationService.paginate(queryBuilder, page, limit);
            if (search) {
                queryBuilder.andWhere('(user.firstName ILIKE :search OR user.lastName ILIKE :search OR wallet.userPhone ILIKE :search)', {
                    search: `%${search}%`
                });
                return (0, _responseutil.createResponse)(200, paginationResult);
            }
            return (0, _responseutil.createResponse)(200, paginationResult);
        })();
    }
    getAllWalletOrders(query) {
        var _this = this;
        return _async_to_generator(function*() {
            const { page = 1, limit = 10, search, sort = 'id', sortOrder = 'DESC' } = query;
            const queryBuilder = yield _this.walletTransactionRepository.createQueryBuilder('wallet_transactions').leftJoinAndSelect('wallet_transactions.wallet', 'wallet').leftJoinAndSelect('wallet.user', 'user').orderBy(`wallet_transactions.${sort}`, sortOrder).skip((page - 1) * limit).take(limit);
            if (search) {
                queryBuilder.andWhere('(user.firstName ILIKE :search OR user.lastName ILIKE :search OR wallet.userPhone ILIKE :search)', {
                    search: `%${search}%`
                });
            }
            const paginationResult = yield _this.paginationService.paginate(queryBuilder, page, limit);
            return (0, _responseutil.createResponse)(200, paginationResult);
        })();
    }
    getWalletOrdersByUser(phone, query) {
        var _this = this;
        return _async_to_generator(function*() {
            const { page = 1, limit = 10, sort = 'id', sortOrder = 'DESC' } = query;
            const user = yield _this.userRepository.findOne({
                where: {
                    phone
                }
            });
            if (!user) {
                throw new _common.NotFoundException('User not found');
            }
            const wallet = yield _this.walletTransactionRepository.createQueryBuilder('wallet_transactions').leftJoinAndSelect('wallet_transactions.wallet', 'wallet').select([
                'wallet_transactions.id',
                'wallet_transactions.amount',
                'wallet_transactions.createdAt',
                'wallet_transactions.orderId'
            ]).where('wallet.userPhone = :phone', {
                phone
            }).orderBy(`wallet_transactions.${sort}`, sortOrder).skip((page - 1) * limit).take(limit);
            const paginationResult = yield _this.paginationService.paginate(wallet, page, limit);
            return (0, _responseutil.createResponse)(200, paginationResult);
        })();
    }
    constructor(walletRepository, userRepository, walletTransactionRepository, transactionRepository, zarinpalService, paginationService){
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.transactionRepository = transactionRepository;
        this.zarinpalService = zarinpalService;
        this.paginationService = paginationService;
    }
};
WalletService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_walletentity.Wallet)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_walletTransactionentity.walletTransaction)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_transactionentity.TransactionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _zarinpalservice.ZarinpalService === "undefined" ? Object : _zarinpalservice.ZarinpalService,
        typeof _pagitnateservice.PaginationService === "undefined" ? Object : _pagitnateservice.PaginationService
    ])
], WalletService);

//# sourceMappingURL=wallet.service.js.map