import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseErrorMiddleware implements NestMiddleware {
  private logger = new Logger('DatabaseErrorMiddleware');

  constructor(private readonly connection: Connection) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.checkDatabaseConnection();
      await this.checkEntities();
      next();
    } catch (error) {
      this.logger.error(`Database connection or entity error: ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  private async checkDatabaseConnection() {
    const isConnected = this.connection.isConnected;
    if (!isConnected) {
      await this.connection.connect();
    }
  }

  private async checkEntities() {
    const entityMetadatas = this.connection.entityMetadatas;
    if (entityMetadatas.length === 0) {
      throw new Error('No entities found in the database connection');
    }
    // Optional: Log entity names
    entityMetadatas.forEach((metadata) => {
      this.logger.log(`Found entity: ${metadata.name}`);
    });
  }
}
