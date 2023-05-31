import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { Phonebook } from './customers/entities/phonebook.entity';
import { FeedbackModule } from './feedback/feedback.module';
import { NocIssue } from './noc/entities/noc-issue.entity';
import { NocModule } from './noc/noc.module';
import { ProspectModule } from './prospect/prospect.module';
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
      entities: [
        SmsInbox,
        SmsSent,
        SmsSentSatisfaction,
        SmsSatisfaction,
        NocIssue,
        Phonebook,
      ],
      synchronize: false,
    }),
    FeedbackModule,
    SmsModule,
    NocModule,
    CustomersModule,
    ProspectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
