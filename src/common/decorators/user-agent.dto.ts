import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      platform: request.headers['sec-ch-ua-platform'],
      browser: request.headers['user-agent'],
      versionBrowser: request.headers['sec-ch-ua'],
      versionPlatform: request.headers['sec-ch-ua-platform-version'],
      ip: request.ip,
    };
  },
);
