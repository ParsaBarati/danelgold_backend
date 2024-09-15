import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as useragent from 'express-useragent';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userAgentString = req.headers['user-agent'];

    if (!userAgentString) {
      console.error('No User-Agent header found');
      // Handle the case where User-Agent header is not present
      req['userAgent'] = {
        platform: 'Unknown',
        browser: 'Unknown',
        versionBrowser: 'Unknown',
        versionPlatform: 'Unknown',
        ip: req.ip,
      };
      return next(); // Proceed to the next middleware or request handler
    }

    try {
      const agent = useragent.parse(userAgentString);
      req['userAgent'] = {
        platform: agent.os,
        browser: agent.browser,
        versionBrowser: agent.version,
        versionPlatform: agent.os,
        ip: req.ip,
      };
    } catch (error) {
      console.error('Error parsing User-Agent:', error);
      req['userAgent'] = {
        platform: 'Unknown',
        browser: 'Unknown',
        versionBrowser: 'Unknown',
        versionPlatform: 'Unknown',
        ip: req.ip,
      };
    }

    next();
  }
}
