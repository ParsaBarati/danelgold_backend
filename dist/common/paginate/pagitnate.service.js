"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PaginationService", {
    enumerable: true,
    get: function() {
        return PaginationService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
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
let PaginationService = class PaginationService {
    paginate(source, page = 1, limit = 10, where = {}, order = {}) {
        return _async_to_generator(function*() {
            let data;
            let total;
            if (source instanceof _typeorm.Repository) {
                [data, total] = yield source.findAndCount({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    order
                });
            } else {
                [data, total] = yield source.skip((page - 1) * limit).take(limit).getManyAndCount();
            }
            return {
                data,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
        })();
    }
};
PaginationService = _ts_decorate([
    (0, _common.Injectable)()
], PaginationService);

//# sourceMappingURL=pagitnate.service.js.map