"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UploadService", {
    enumerable: true,
    get: function() {
        return UploadService;
    }
});
const _pagitnateservice = require("../common/paginate/pagitnate.service");
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _uplaodentity = require("./entity/uplaod.entity");
const _typeorm1 = require("typeorm");
const _path = require("path");
const _fsextra = /*#__PURE__*/ _interop_require_default(require("fs-extra"));
const _responseutil = require("../utils/response.util");
const _userentity = require("../user/user/entity/user.entity");
const _postsentity = require("../social/post/posts/entity/posts.entity");
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
let UploadService = class UploadService {
    createUploads(files) {
        var _this = this;
        return _async_to_generator(function*() {
            if (!files || !files || files.length === 0) {
                throw new _common.NotFoundException('No files to upload');
            }
            const uploads = [];
            const links = [];
            const baseUrl = process.env.BASE_URL_UPLOAD;
            const timestamp = Date.now();
            for (const file of files){
                const sizeFile = file.size;
                const uploadFileName = file.filename;
                const uploadDestination = file.destination;
                const uploadMemType = file.mimetype;
                const newUpload = _this.uploadRepository.create({
                    name: uploadFileName,
                    size: sizeFile,
                    memType: file.mimetype,
                    destination: file.destination
                });
                const savedUpload = yield _this.uploadRepository.save(newUpload);
                const encodedFileName = `${savedUpload.destination.replace(/\\/g, '/')}/${encodeURIComponent(savedUpload.name)}`;
                const link = baseUrl + encodedFileName;
                uploads.push(savedUpload);
                links.push(link);
            }
            return {
                uploads,
                links
            };
        })();
    }
    getMemTypeByExtension(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        switch(extension){
            case 'jpg':
            case 'jpeg':
            case 'heic':
            case 'png':
            case 'gif':
                return 'image';
            case 'mp4':
            case 'mkv':
            case 'avi':
            case 'mov':
                return 'video';
            case 'mp3':
            case 'wav':
            case 'aac':
                return 'audio';
            case 'pdf':
            case 'doc':
            case 'docx':
            case 'txt':
                return 'document';
            default:
                return 'unknown';
        }
    }
    createUpload(file) {
        var _this = this;
        return _async_to_generator(function*() {
            if (!file) {
                throw new _common.NotFoundException('No file to upload');
            }
            const sizeFile = file.size;
            const uploadFileName = file.filename;
            const uploadDestination = file.destination;
            const uploadMemType = _this.getMemTypeByExtension(uploadFileName);
            const newUpload = _this.uploadRepository.create({
                name: uploadFileName,
                size: sizeFile,
                memType: uploadMemType,
                destination: uploadDestination
            });
            const savedUpload = yield _this.uploadRepository.save(newUpload);
            savedUpload.memType = uploadMemType;
            // Generate the file link
            const baseUrl = process.env.BASE_URL_UPLOAD;
            const encodedFileName = `${savedUpload.destination.replace(/\\/g, '/')}/${encodeURIComponent(savedUpload.name)}`;
            const link = baseUrl + encodedFileName;
            console.log(savedUpload);
            // Return an object with the Upload entity and the generated link
            return {
                upload: savedUpload,
                link
            };
        })();
    }
    uploadReel(file, caption, user) {
        var _this = this;
        return _async_to_generator(function*() {
            const { link } = yield _this.createUpload(file);
            const reel = _this.postRepository.create({
                mediaUrl: link,
                media: link,
                caption,
                isReel: true,
                user
            });
            return _this.postRepository.save(reel);
        })();
    }
    getAllUploads(query) {
        var _this = this;
        return _async_to_generator(function*() {
            const { page, limit, search, sort, sortOrder } = query;
            const queryBuilder = _this.uploadRepository.createQueryBuilder('upload');
            if (search) {
                queryBuilder.andWhere('upload.name ILIKE :search', {
                    search: `%${search}%`
                });
            }
            if (sort) {
                queryBuilder.orderBy(`upload.${sort}`, sortOrder);
            } else {
                queryBuilder.orderBy('upload.id', 'DESC');
            }
            const paginationResult = yield _this.paginationService.paginate(queryBuilder, page, limit);
            const baseUrl = process.env.BASE_URL_UPLOAD;
            const uploadsWithLinks = paginationResult.data.map((upload)=>_object_spread_props(_object_spread({}, upload), {
                    link: baseUrl + `${upload.destination.replace(/\\/g, '/')}` + `/${encodeURIComponent(upload.name).replace(/%5C/g, '/')}`
                }));
            const resultWithLinks = _object_spread_props(_object_spread({}, paginationResult), {
                data: uploadsWithLinks
            });
            return (0, _responseutil.createResponse)(200, resultWithLinks);
        })();
    }
    deleteUpload(id) {
        var _this = this;
        return _async_to_generator(function*() {
            const upload = yield _this.uploadRepository.findOne({
                where: {
                    id
                }
            });
            if (!upload) {
                throw new _common.NotFoundException('فایل یافت نشد');
            }
            const filePath = (0, _path.join)(upload.destination, upload.name);
            yield _this.uploadRepository.remove(upload);
            _fsextra.default.unlink(filePath, (err)=>{
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully:', filePath);
                }
            });
            return (0, _responseutil.createResponse)(200, {
                message: 'فایل با موفقیت حذف شد'
            });
        })();
    }
    deleteMultipleUploads(ids) {
        var _this = this;
        return _async_to_generator(function*() {
            const uploads = yield _this.uploadRepository.findByIds(ids);
            if (uploads.length === 0) {
                throw new _common.NotFoundException('هیچ فایلی یافت نشد');
            }
            for (const upload of uploads){
                const filePath = (0, _path.join)(upload.destination, upload.name);
                yield _this.uploadRepository.remove(upload);
                _fsextra.default.unlink(filePath, (err)=>{
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully:', filePath);
                    }
                });
            }
            return (0, _responseutil.createResponse)(200, {
                message: 'فایل‌ها با موفقیت حذف شدند'
            });
        })();
    }
    getUploadById(id) {
        var _this = this;
        return _async_to_generator(function*() {
            const upload = yield _this.uploadRepository.findOne({
                where: {
                    id
                }
            });
            if (!upload) {
                throw new _common.NotFoundException('فایلی پیدا نشد');
            }
            const name = upload.name;
            const destination = upload.destination;
            console.log(`destination ${destination}`);
            const filePath = (0, _path.join)(destination, name).replace(/\\/g, '/');
            console.log(`filePath ${filePath}`);
            const baseUrl = process.env.BASE_URL_UPLOAD;
            const encodedFileName = `${destination.replace(/\\/g, '/')}` + `/${encodeURIComponent(name)}`;
            const uploadWithLink = _object_spread_props(_object_spread({}, upload), {
                link: `${baseUrl}${encodedFileName}`
            });
            return (0, _responseutil.createResponse)(200, uploadWithLink);
        })();
    }
    getUploadByPath(name) {
        var _this = this;
        return _async_to_generator(function*() {
            const upload = yield _this.uploadRepository.findOne({
                where: {
                    name
                }
            });
            if (!upload) {
                throw new _common.NotFoundException('فایلی پیدا نشد');
            }
            const uploadName = upload.name;
            const destination = upload.destination;
            console.log(`destination ${destination}`);
            const filePath = (0, _path.join)(destination, uploadName).replace(/\\/g, '/');
            console.log(`filePath ${filePath}`);
            return (0, _responseutil.createResponse)(200, filePath);
        })();
    }
    createProfilePictureUpload(file, user) {
        var _this = this;
        return _async_to_generator(function*() {
            if (!file) {
                throw new _common.NotFoundException('File not found');
            }
            if (!user) {
                throw new _common.NotFoundException('User not found');
            }
            const newUpload = _this.uploadRepository.create({
                name: file.filename,
                size: file.size,
                memType: file.mimetype,
                destination: file.destination
            });
            const savedUpload = yield _this.uploadRepository.save(newUpload);
            user.profilePic = `${process.env.BASE_URL_UPLOAD}` + `${savedUpload.destination.replace(/\\/g, '/')}` + `/${encodeURIComponent(savedUpload.name)}`;
            yield _this.userRepository.save(user);
            const uploadWithLink = _object_spread_props(_object_spread({}, savedUpload), {
                link: user.profilePic,
                profilePic: user.profilePic
            });
            return (0, _responseutil.createResponse)(200, uploadWithLink, 'Profile picture uploaded successfully!');
        })();
    }
    constructor(uploadRepository, postRepository, userRepository, paginationService){
        this.uploadRepository = uploadRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.paginationService = paginationService;
    }
};
UploadService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_uplaodentity.Upload)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_postsentity.Post)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _pagitnateservice.PaginationService === "undefined" ? Object : _pagitnateservice.PaginationService
    ])
], UploadService);

//# sourceMappingURL=upload.service.js.map