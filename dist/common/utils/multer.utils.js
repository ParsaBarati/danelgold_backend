"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "multerConfigFactory", {
    enumerable: true,
    get: function() {
        return multerConfigFactory;
    }
});
const _multer = require("multer");
const _path = /*#__PURE__*/ _interop_require_wildcard(require("path"));
const _fsextra = /*#__PURE__*/ _interop_require_wildcard(require("fs-extra"));
const _createdirectoryutils = require("./create-directory.utils");
const _common = require("@nestjs/common");
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
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    'm4v'
];
const multerConfigFactory = (configService)=>({
        storage: (0, _multer.diskStorage)({
            destination: /*#__PURE__*/ function() {
                var _ref = _async_to_generator(function*(req, file, cb) {
                    try {
                        const subdirectory = (0, _createdirectoryutils.createSubdirectory)(new Date());
                        const directory = configService.get('MULTER_DEST');
                        if (!directory) {
                            throw new Error('MULTER_DEST configuration is missing.');
                        }
                        const uploadDir = _path.join(directory, subdirectory);
                        console.log(`uploadDir >>> ${uploadDir}`);
                        yield _fsextra.ensureDir(uploadDir);
                        cb(null, uploadDir);
                    } catch (error) {
                        cb(new _common.BadRequestException(String(error)), '');
                    }
                });
                return function(req, file, cb) {
                    return _ref.apply(this, arguments);
                };
            }(),
            filename: /*#__PURE__*/ function() {
                var _ref = _async_to_generator(function*(req, file, cb) {
                    try {
                        const extension = _path.extname(file.originalname);
                        const baseName = _path.basename(file.originalname, extension);
                        const directory = configService.get('MULTER_DEST');
                        const subdirectory = (0, _createdirectoryutils.createSubdirectory)(new Date());
                        const uploadDir = _path.resolve(directory, subdirectory);
                        let finalFilename = `${baseName}${extension}`;
                        let filePath = _path.resolve(uploadDir, finalFilename);
                        let counter = 1;
                        console.log('filename');
                        while(yield _fsextra.pathExists(filePath)){
                            finalFilename = `${baseName}-${counter}${extension}`;
                            filePath = _path.resolve(uploadDir, finalFilename);
                            counter++;
                        }
                        cb(null, finalFilename);
                        console.log('final file name');
                    } catch (error) {
                        cb(new _common.BadRequestException(String(error)), '');
                    }
                });
                return function(req, file, cb) {
                    return _ref.apply(this, arguments);
                };
            }()
        }),
        fileFilter: (req, file, cb)=>{
            console.log('filter');
            const ext = _path.extname(file.originalname).toLowerCase();
            if (allowedExtensions.includes(ext)) {
                cb(null, true);
            } else {
                cb(new _common.BadRequestException('فرمت فایل مجاز نیست. فقط فایل‌های jpg, jpeg, png, و webp قابل قبول هستند.'), false);
            }
        }
    });

//# sourceMappingURL=multer.utils.js.map