import { Expose } from 'class-transformer';

export class SendFeedbackQuestionDto {
  destination: string;
  question: string;

  @Expose({ name: 'customer_id' })
  customerId: string;

  @Expose({ name: 'ticket_id' })
  ticketId: number;

  @Expose({ name: 'tts_update_id' })
  ttsUpdateId: number;

  @Expose({ name: 'assigned_no' })
  assignedNo: number;
}
