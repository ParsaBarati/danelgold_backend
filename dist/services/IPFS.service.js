"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IPFSService", {
    enumerable: true,
    get: function() {
        return IPFSService;
    }
});
const _common = require("@nestjs/common");
const _axios = /*#__PURE__*/ _interop_require_default(require("axios"));
const _formdata = /*#__PURE__*/ _interop_require_default(require("form-data"));
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let IPFSService = class IPFSService {
    getHeaders(form) {
        return {
            headers: _object_spread({
                Authorization: `Bearer ${this.pinataJWT}`
            }, form.getHeaders())
        };
    }
    // Upload file to IPFS
    uploadFileToIPFS(file) {
        var _this = this;
        return _async_to_generator(function*() {
            const form = new _formdata.default();
            form.append('file', file.buffer, file.originalname);
            try {
                const response = yield _axios.default.post(_this.pinataEndpoint, form, _this.getHeaders(form));
                return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            } catch (error) {
                console.error('Error uploading file to IPFS:', error);
                throw new Error('IPFS file upload failed');
            }
        })();
    }
    // Upload metadata to IPFS
    uploadMetadataToIPFS(metadata) {
        var _this = this;
        return _async_to_generator(function*() {
            const form = new _formdata.default();
            form.append('metadata', JSON.stringify(metadata));
            try {
                const response = yield _axios.default.post(_this.pinataMetadataEndpoint, form, _this.getHeaders(form));
                return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            } catch (error) {
                console.error('Error uploading metadata to IPFS:', error);
                throw new Error('IPFS metadata upload failed');
            }
        })();
    }
    constructor(){
        this.pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
        this.pinataMetadataEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
        // Using JWT for authentication
        this.pinataJWT = process.env.PINATA_JWT;
    }
};
IPFSService = _ts_decorate([
    (0, _common.Injectable)()
], IPFSService);

//# sourceMappingURL=IPFS.service.js.map