import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsService } from '../sms/sms.service';
import { ReceiveFeedbackResponseDto } from './dto/receive-feedback-response.dto';
import { SendFeedbackQuestionDto } from './dto/send-feedback-question.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private configService: ConfigService,
    private smsService: SmsService,
  ) {}

  async sendQuestion(sendFeedbackQuestionDto: SendFeedbackQuestionDto) {
    const employeeId = this.configService.get('DEFAULT_USER');

    const now = Math.floor(Date.now() / 1000);
    const {
      destination,
      question,
      customerId,
      ticketId,
      ttsUpdateId,
      assignedNo,
    } = sendFeedbackQuestionDto;

    const smsSent = {
      id: 0,
      destination,
      sentTimestamp: now,
      message: question,
      employeeId,
      outboxId: 0,
    };
    const createdSmsSent = await this.smsService.createSent(smsSent);

    const smsSentSatisfaction = {
      sentId: createdSmsSent.id,
      customerId,
      ticketId,
      ttsUpdateId,
      assignedNo,
    };
    return this.smsService.createSentSatisfaction(smsSentSatisfaction);
  }

  async receiveResponse(
    receiveFeedbackResponseDto: ReceiveFeedbackResponseDto,
  ) {
    const { sender, response } = receiveFeedbackResponseDto;
    const currentTime = new Date();
    const receivedTimestamp = Math.floor(currentTime.valueOf() / 1000);
    const smsInbox = {
      id: 0,
      sender,
      receivedTimestamp,
      message: response,
      isNew: 0,
    };
    const createdSmsInbox = await this.smsService.createInbox(smsInbox);
    const smsSentSatisfaction =
      await this.smsService.getSentSatisfactionBySender(sender);

    if (smsSentSatisfaction.length < 1) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    const [{ sentId, ticketId, customerId, ttsUpdateId, assignedNo }] =
      smsSentSatisfaction;

    const smsSent = await this.smsService.getSentById(+sentId);

    const [{ sent }] = smsSent;

    // Don't mark score if sent-response has passed 1 day
    if (receivedTimestamp - sent > 86400) return;

    const minValue = +this.configService.get('SATISFACTION_MIN_VALUE');
    const maxValue = +this.configService.get('SATISFACTION_MAX_VALUE');
    const employeeId = this.configService.get('DEFAULT_USER');

    this.smsService.updateSentSatisfaction(sentId, {
      isResponded: 1,
      respondedInboxId: createdSmsInbox.id,
    });

    const smsSatisfaction = {
      inboxId: createdSmsInbox.id,
      ticketId,
      customerId,
      score: +response,
      employeeId,
      insertTime: currentTime,
      minValue,
      maxValue,
      ttsUpdateId,
      assignedNo,
    };
    return this.smsService.createSatisfaction(smsSatisfaction);
  }
}
