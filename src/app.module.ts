import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbackModule } from './feedback/feedback.module';
import { SmsInbox } from './sms/entities/sms-inbox.entity';
import { SmsSatisfaction } from './sms/entities/sms-satisfaction.entity';
import { SmsSentSatisfaction } from './sms/entities/sms-sent-satisfaction.entity';
import { SmsSent } from './sms/entities/sms-sent.entity';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql' | 'mariadb' | 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
      entities: [SmsInbox, SmsSent, SmsSentSatisfaction, SmsSatisfaction],
      synchronize: false,
    }),
    FeedbackModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
