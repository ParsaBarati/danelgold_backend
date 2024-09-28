import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';

configDotenv({ path: '.env' });

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_URL,
  port: 5432,
  database: process.env.DATABASE_PG_DB,
  username: process.env.USERNAME_PG_DB,
  password: process.env.PASSWORD_PG_DB,
  entities: [__dirname + '**/**/**/**.entity{.ts,.js}'],
  migrations: [__dirname + '/@migrations/*{.ts,.js}'],
  logging: false,
  synchronize: true,
  cache: false,
});

export default datasource;