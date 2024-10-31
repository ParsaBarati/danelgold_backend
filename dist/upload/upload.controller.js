"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UploadController", {
    enumerable: true,
    get: function() {
        return UploadController;
    }
});
const _uploadservice = require("./upload.service");
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _express = require("express");
const _publicdecorator = require("../common/decorators/public.decorator");
const _swagger = require("@nestjs/swagger");
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
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
let UploadController = class UploadController {
    createUploads(files) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.uploadService.createUploads(files);
        })();
    }
    createUpload(file) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.uploadService.createUpload(file);
        })();
    }
    uploadReel(file, caption, req) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.uploadService.uploadReel(file, caption, req.uesr);
        })();
    }
    createProfilePictureUpload(file, req) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.uploadService.createProfilePictureUpload(file, req.user);
        })();
    }
    getAllUploads(page, limit, search, sort, sortOrder) {
        var _this = this;
        return _async_to_generator(function*() {
            const query = {
                page,
                limit,
                search,
                sort,
                sortOrder
            };
            return _this.uploadService.getAllUploads(query);
        })();
    }
    deleteUpload(id) {
        var _this = this;
        return _async_to_generator(function*() {
            return _this.uploadService.deleteUpload(id);
        })();
    }
    deleteMultipleUploads(ids) {
        var _this = this;
        return _async_to_generator(function*() {
            const idArray = ids.split(',').map((id)=>parseInt(id, 10));
            return _this.uploadService.deleteMultipleUploads(idArray);
        })();
    }
    getByPath(filePath, res) {
        var _this = this;
        return _async_to_generator(function*() {
            const filePathClean = _path.default.normalize(filePath).replace(/\\/g, '/');
            const file = yield _this.uploadService.getUploadByPath(filePathClean);
            if (!file) {
                throw new _common.NotFoundException('File not found');
            }
            const absolutePath = _path.default.resolve(__dirname, '..', '..', file.result);
            res.sendFile(absolutePath);
        })();
    }
    getUploadById(uploadId) {
        var _this = this;
        return _async_to_generator(function*() {
            return yield _this.uploadService.getUploadById(uploadId);
        })();
    }
    constructor(uploadService){
        this.uploadService = uploadService;
    }
};
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Upload Multiple Files in Bulk'
    }),
    (0, _common.Post)('bulk'),
    (0, _common.UseInterceptors)((0, _platformexpress.FilesInterceptor)('files')),
    _ts_param(0, (0, _common.UploadedFiles)(new _common.ParseFilePipeBuilder().addMaxSizeValidator({
        maxSize: 500 * 1024 * 1024
    }).build({
        errorHttpStatusCode: _common.HttpStatus.UNPROCESSABLE_ENTITY
    }))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "createUploads", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Upload Single File'
    }),
    (0, _common.Post)(),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _common.UploadedFile)(new _common.ParseFilePipeBuilder().addMaxSizeValidator({
        maxSize: 5 * 1024 * 1024
    }).build({
        errorHttpStatusCode: _common.HttpStatus.UNPROCESSABLE_ENTITY
    }))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "createUpload", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Upload Reel'
    }),
    (0, _common.Post)('Reel'),
    (0, _swagger.ApiOperation)({
        summary: 'Upload a new reel'
    }),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _common.UploadedFile)(new _common.ParseFilePipeBuilder().addMaxSizeValidator({
        maxSize: 50 * 1024 * 1024
    }).build({
        errorHttpStatusCode: _common.HttpStatus.UNPROCESSABLE_ENTITY
    }))),
    _ts_param(1, (0, _common.Body)('caption')),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File,
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "uploadReel", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Upload Profile Picture'
    }),
    (0, _common.Post)('profile-pic'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _common.UploadedFile)(new _common.ParseFilePipeBuilder().addMaxSizeValidator({
        maxSize: 5 * 1024 * 1024
    }).build({
        errorHttpStatusCode: _common.HttpStatus.UNPROCESSABLE_ENTITY
    }))),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File,
        typeof _express.Request === "undefined" ? Object : _express.Request
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "createProfilePictureUpload", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get All Uploads with Filtering Options'
    }),
    (0, _swagger.ApiQuery)({
        name: 'page',
        required: false,
        example: 1,
        description: 'Page number for pagination'
    }),
    (0, _swagger.ApiQuery)({
        name: 'limit',
        required: false,
        example: 10,
        description: 'Number of items per page'
    }),
    (0, _swagger.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Search term to filter uploads'
    }),
    (0, _swagger.ApiQuery)({
        name: 'sort',
        required: false,
        description: 'Sort by a specific field',
        example: 'id'
    }),
    (0, _swagger.ApiQuery)({
        name: 'sortOrder',
        required: false,
        description: 'Order of sorting',
        example: 'DESC'
    }),
    (0, _common.Get)('all'),
    _ts_param(0, (0, _common.Query)('page', new _common.DefaultValuePipe(1), _common.ParseIntPipe)),
    _ts_param(1, (0, _common.Query)('limit', new _common.DefaultValuePipe(10), _common.ParseIntPipe)),
    _ts_param(2, (0, _common.Query)('search')),
    _ts_param(3, (0, _common.Query)('sort', new _common.DefaultValuePipe('id'))),
    _ts_param(4, (0, _common.Query)('sortOrder', new _common.DefaultValuePipe('DESC'))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "getAllUploads", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Delete an Upload by ID'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Upload deleted successfully'
    }),
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id', _common.ParseIntPipe)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "deleteUpload", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Delete Multiple Uploads'
    }),
    (0, _swagger.ApiQuery)({
        name: 'delete',
        description: 'Comma-separated list of IDs to delete'
    }),
    (0, _common.Delete)(),
    _ts_param(0, (0, _common.Query)('delete')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "deleteMultipleUploads", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get File by Path'
    }),
    (0, _publicdecorator.Public)(),
    (0, _common.Get)('/path/:filePath'),
    _ts_param(0, (0, _common.Param)('filePath')),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "getByPath", null);
_ts_decorate([
    (0, _swagger.ApiOperation)({
        summary: 'Get Upload by ID'
    }),
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id', new _common.ParseIntPipe({
        errorHttpStatusCode: _common.HttpStatus.BAD_REQUEST
    }))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "getUploadById", null);
UploadController = _ts_decorate([
    (0, _swagger.ApiTags)('Uploads'),
    (0, _common.Controller)('upload'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _uploadservice.UploadService === "undefined" ? Object : _uploadservice.UploadService
    ])
], UploadController);

//# sourceMappingURL=upload.controller.js.map