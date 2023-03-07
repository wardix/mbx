import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { SmsModule } from '../sms/sms.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SmsModule, ConfigModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
