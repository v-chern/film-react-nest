import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    //переменнные среды
    database: {
      driver: process.env.DATABASE_DRIVER,
      url: process.env.DATABASE_URL,
      schema: process.env.DATABASE_SCHEMA,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    },
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  schema: string;
  user?: string;
  password?: string;
}
