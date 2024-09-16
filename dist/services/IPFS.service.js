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
const _ipfshttpclient = require("ipfs-http-client");
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
let IPFSService = class IPFSService {
    uploadToIPFS(content) {
        var _this = this;
        return _async_to_generator(function*() {
            try {
                const result = yield _this.ipfs.add(content);
                return `https://ipfs.infura.io/ipfs/${result.path}`;
            } catch (error) {
                throw new Error(`Error uploading to IPFS: ${error}`);
            }
        })();
    }
    uploadMetadataToIPFS(metadata) {
        var _this = this;
        return _async_to_generator(function*() {
            const metadataBuffer = Buffer.from(JSON.stringify(metadata));
            return _this.uploadToIPFS(metadataBuffer);
        })();
    }
    constructor(){
        this.ipfs = (0, _ipfshttpclient.create)({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: 'Basic ' + Buffer.from('<projectId>:<projectSecret>').toString('base64')
            }
        });
    }
};
IPFSService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], IPFSService);

//# sourceMappingURL=IPFS.service.js.map