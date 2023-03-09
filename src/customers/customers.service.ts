import { Injectable } from '@nestjs/common';
import { PhonebookRepository } from './repositories/phonebook.repository';

@Injectable()
export class CustomersService {
  constructor(private phonebookRepository: PhonebookRepository) {}

  async getValidSubscriptionByPhone(phone: string) {
    if (phone.length < 10) {
      return {};
    }
    const subscriptions = await this.phonebookRepository.getValidSubscription(
      phone,
    );
    const subscriptionMap = {};
    for (const sub of subscriptions) {
      const { CustServId, ...subProps } = sub;
      subscriptionMap[CustServId] = subProps;
    }
    return subscriptionMap;
  }
}
