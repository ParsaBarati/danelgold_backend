"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getBrowserVersion: function() {
        return getBrowserVersion;
    },
    getDeviceVersion: function() {
        return getDeviceVersion;
    },
    getUserBrowser: function() {
        return getUserBrowser;
    },
    getUserIP: function() {
        return getUserIP;
    },
    getUserOS: function() {
        return getUserOS;
    },
    getUserSource: function() {
        return getUserSource;
    },
    getVersionPlatform: function() {
        return getVersionPlatform;
    }
});
const _expressuseragent = /*#__PURE__*/ _interop_require_wildcard(require("express-useragent"));
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
function getUserOS(req) {
    return _getUserOS.apply(this, arguments);
}
function _getUserOS() {
    _getUserOS = _async_to_generator(function*(req) {
        const userAgentString = req.headers['user-agent'];
        if (!userAgentString) {
            console.error('No User-Agent header found');
            return 'Unknown';
        }
        const userAgent = _expressuseragent.parse(userAgentString);
        let deviceType;
        switch(true){
            case userAgent.isMobile:
                deviceType = 'Mobile';
                break;
            case userAgent.isTablet:
                deviceType = 'Tablet';
                break;
            case userAgent.isChromeOS:
                deviceType = 'Chrome OS';
                break;
            case userAgent.isMac:
                deviceType = 'macOS';
                break;
            case userAgent.isDesktop:
                deviceType = 'Desktop';
                break;
            case userAgent.isiPad:
                deviceType = 'iPad';
                break;
            case userAgent.isLinux:
                deviceType = 'Linux';
                break;
            case userAgent.isSmartTV:
                deviceType = 'Smart TV';
                break;
            default:
                deviceType = 'Unknown';
                break;
        }
        return deviceType;
    });
    return _getUserOS.apply(this, arguments);
}
function getUserSource(req) {
    return _getUserSource.apply(this, arguments);
}
function _getUserSource() {
    _getUserSource = _async_to_generator(function*(req) {
        const userAgentString = req.headers['user-agent'];
        if (!userAgentString) {
            console.error('No User-Agent header found');
            return 'Unknown';
        }
        const userAgent = _expressuseragent.parse(userAgentString);
        return userAgent.source.toString();
    });
    return _getUserSource.apply(this, arguments);
}
function getDeviceVersion(req) {
    return _getDeviceVersion.apply(this, arguments);
}
function _getDeviceVersion() {
    _getDeviceVersion = _async_to_generator(function*(req) {
        const userAgentString = req.headers['user-agent'];
        if (!userAgentString) {
            console.error('No User-Agent header found');
            return 'Unknown';
        }
        const userAgent = _expressuseragent.parse(userAgentString);
        return userAgent.version.toString();
    });
    return _getDeviceVersion.apply(this, arguments);
}
function getBrowserVersion(req) {
    return _getBrowserVersion.apply(this, arguments);
}
function _getBrowserVersion() {
    _getBrowserVersion = _async_to_generator(function*(req) {
        const userAgentString = req.headers['user-agent'];
        if (!userAgentString) {
            console.error('No User-Agent header found');
            return 'Unknown';
        }
        const userAgent = _expressuseragent.parse(userAgentString);
        return `${userAgent.browser}/${userAgent.version}`;
    });
    return _getBrowserVersion.apply(this, arguments);
}
function getUserIP(req) {
    return _getUserIP.apply(this, arguments);
}
function _getUserIP() {
    _getUserIP = _async_to_generator(function*(req) {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
    });
    return _getUserIP.apply(this, arguments);
}
function getUserBrowser(req) {
    return _getUserBrowser.apply(this, arguments);
}
function _getUserBrowser() {
    _getUserBrowser = _async_to_generator(function*(req) {
        const userAgentString = req.headers['user-agent'];
        if (!userAgentString) {
            console.error('No User-Agent header found');
            return 'Unknown';
        }
        const userAgent = _expressuseragent.parse(userAgentString);
        return userAgent.browser.toString();
    });
    return _getUserBrowser.apply(this, arguments);
}
function getVersionPlatform(req) {
    return _getVersionPlatform.apply(this, arguments);
}
function _getVersionPlatform() {
    _getVersionPlatform = _async_to_generator(function*(req) {
        const platformVersion = req.headers['sec-ch-ua-platform-version'];
        const model = req.headers['sec-ch-ua-model'];
        if (platformVersion && model) {
            return `${model}; Android ${platformVersion}`;
        }
        const userAgentString = req.headers['user-agent'];
        if (!userAgentString) {
            console.error('No User-Agent header found');
            return 'Unknown Platform';
        }
        const match = userAgentString.match(/\(([^)]+)\)/);
        if (match) {
            const platformInfo = match[1];
            const platformParts = platformInfo.split(';');
            return platformParts.slice(0, 2).join(';');
        }
        return 'Unknown Platform';
    });
    return _getVersionPlatform.apply(this, arguments);
}

//# sourceMappingURL=user-agent.util.js.map