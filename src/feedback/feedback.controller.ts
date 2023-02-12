import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ReceiveFeedbackResponseDto } from './dto/receive-feedback-response.dto';
import { SendFeedbackQuestionDto } from './dto/send-feedback-question.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('response')
  receiveResponse(
    @Body() receiveFeedbackResponseDto: ReceiveFeedbackResponseDto,
  ) {
    return this.feedbackService.receiveResponse(receiveFeedbackResponseDto);
  }

  @Post('question')
  sendQuestion(@Body() sendFeedbackQuestionDto: SendFeedbackQuestionDto) {
    return this.feedbackService.sendQuestion(sendFeedbackQuestionDto);
  }
}
