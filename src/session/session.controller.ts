import {
  Controller,
  //   Delete,
  //   Get,
  //   Query,
  //   Req,
  //   UnauthorizedException,
} from '@nestjs/common';
// import { SessionService } from './session.service';
// import { Request } from 'express';

@Controller('sessions')
export class SessionController {
  //   constructor(private readonly sessionService: SessionService) {}
  //   @Get()
  //   async getActiveSessions(@Req() req: Request) {
  //     const phone = req.session.phone;
  //     if (!phone) {
  //       throw new UnauthorizedException('User not logged in');
  //     }
  //     return this.sessionService.getActiveSessions(phone);
  //   }
  //   @Delete()
  //   async deleteSession(@Req() req: Request, @Query('id') sessionId: string) {
  //     const phone = req.session.phone;
  //     if (!phone) {
  //       throw new UnauthorizedException('User not logged in');
  //     }
  //     const sessions = await this.sessionService.getActiveSessions(phone);
  //     const session = sessions.find((s) => s.id === sessionId);
  //     if (!session) {
  //       throw new UnauthorizedException('Invalid session ID');
  //     }
  //     await this.sessionService.deleteSession(sessionId);
  //   }
}
