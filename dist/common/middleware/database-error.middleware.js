"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseErrorMiddleware", {
    enumerable: true,
    get: function() {
        return DatabaseErrorMiddleware;
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
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DatabaseErrorMiddleware = class DatabaseErrorMiddleware {
    use(req, res, next) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                yield _this.checkDatabaseConnection();
                yield _this.checkEntities();
                next();
            } catch (error) {
                _this.logger.error(`Database connection or entity error: ${error}`);
                res.status(500).json({
                    message: 'Internal server error'
                });
            }
        })();
    }
    checkDatabaseConnection() {
        var _this = this;
        return _async_to_generator(function*() {
            const isConnected = _this.connection.isConnected;
            if (!isConnected) {
                yield _this.connection.connect();
            }
        })();
    }
    checkEntities() {
        var _this = this;
        return _async_to_generator(function*() {
            const entityMetadatas = _this.connection.entityMetadatas;
            if (entityMetadatas.length === 0) {
                throw new Error('No entities found in the database connection');
            }
            // Optional: Log entity names
            entityMetadatas.forEach((metadata)=>{
                _this.logger.log(`Found entity: ${metadata.name}`);
            });
        })();
    }
    constructor(connection){
        this.connection = connection;
        this.logger = new _common.Logger('DatabaseErrorMiddleware');
    }
};
DatabaseErrorMiddleware = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm.Connection === "undefined" ? Object : _typeorm.Connection
    ])
], DatabaseErrorMiddleware);

//# sourceMappingURL=database-error.middleware.js.map