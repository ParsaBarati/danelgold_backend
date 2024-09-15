"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserAgent", {
    enumerable: true,
    get: function() {
        return UserAgent;
    }
});
const _common = require("@nestjs/common");
const UserAgent = (0, _common.createParamDecorator)((data, ctx)=>{
    const request = ctx.switchToHttp().getRequest();
    return {
        platform: request.headers['sec-ch-ua-platform'],
        browser: request.headers['user-agent'],
        versionBrowser: request.headers['sec-ch-ua'],
        versionPlatform: request.headers['sec-ch-ua-platform-version'],
        ip: request.ip
    };
});

//# sourceMappingURL=user-agent.dto.js.map