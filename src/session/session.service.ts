import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entity/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  // async getActiveSessions(phone: string): Promise<Session[]> {
  //   return this.sessionRepository.find({ where: { phone } });
  // }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessionRepository.delete({ sid: sessionId });
  }
}
