import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PhonebookRepository } from './repositories/phonebook.repository';
import Hashids from 'hashids';

@Injectable()
export class CustomersService {
  constructor(
    private phonebookRepository: PhonebookRepository,
    private configService: ConfigService,
  ) {}

  async getInternetSubscriptionByPhone(phone: string) {
    if (phone.length < 10) {
      return {};
    }
    const subscriptions =
      await this.phonebookRepository.getInternetSubscription(phone);
    const subscriptionMap = {};
    for (const sub of subscriptions) {
      const { CustServId, ...subProps } = sub;
      subscriptionMap[CustServId] = subProps;
    }
    return subscriptionMap;
  }
  async getDigitalBusinessSubscriptionByPhone(phone: string) {
    if (phone.length < 10) {
      return {};
    }
    const subscriptions =
      await this.phonebookRepository.getDigitalBusinessSubscription(phone);
    const subscriptionMap = {};
    for (const sub of subscriptions) {
      const { CustServId, ...subProps } = sub;
      subscriptionMap[CustServId] = subProps;
    }
    return subscriptionMap;
  }

  async getBlockedSubscriptionByPhone(phone: string) {
    if (phone.length < 10) {
      return {};
    }
    const subscriptions = await this.phonebookRepository.getBlockedSubscription(
      phone,
    );
    return subscriptions.reduce((map, sub) => {
      const { CustServId, ...subProps } = sub;
      map[CustServId] = subProps;
      return map;
    }, {});
  }

  async getUnpaidInvoiceByPhone(phone: string) {
    if (phone.length < 10) {
      return {};
    }
    return this.phonebookRepository.getUnpaidInvoice(phone);
  }

  async getBlockedSubscriptionMessage(phone: string) {
    const subscriptions = await this.getBlockedSubscriptionByPhone(phone);
    const subscriptionMessages = [];
    for (const subId in subscriptions) {
      if (!subscriptions[subId].installation_address) {
        continue;
      }
      subscriptionMessages.push(
        `${subscriptions[subId].description} ` +
          `(${subscriptions[subId].installation_address.replace(/\n/g, ' ')})`,
      );
    }
    return {
      blockedMessage: subscriptionMessages.join('\n'),
    };
  }

  async getUnpaidInvoiceMessage(phone: string) {
    const [internetSubscriptions, digitalBusinessSubscriptions] =
      await Promise.all([
        this.getInternetSubscriptionByPhone(phone),
        this.getDigitalBusinessSubscriptionByPhone(phone),
      ]);
    const invoices = await this.getUnpaidInvoiceByPhone(phone);
    const subscriptionList = [];
    const invoiceList = [];
    const bcaVaPrefix = this.configService.get('BCA_VA_PREFIX');
    const mandiriVaPrefix = this.configService.get('MANDIRI_VA_PREFIX');
    const IdrFormat = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });

    const subscriptions = {
      ...internetSubscriptions,
      ...digitalBusinessSubscriptions,
    };

    for (const subId in subscriptions) {
      if (subscriptions[subId].installation_address) {
        subscriptionList.push(
          `${subscriptions[subId].description} ` +
            `(${subscriptions[subId].installation_address.replace(
              /\n/g,
              ' ',
            )})`,
        );
      } else if (subscriptions[subId].cust_domain) {
        subscriptionList.push(
          `${subscriptions[subId].description} ` +
            `(${subscriptions[subId].cust_domain.replace(/\n/g, ' ')})`,
        );
      } else subscriptionList.push(subscriptions[subId].description);
    }

    for (const {
      CustId: id,
      Description: description,
      TotalAmount: amount,
    } of invoices) {
      const vaId = id.startsWith('020') ? id.slice(-6) : id;
      const invoice =
        `*${IdrFormat.format(amount)}* ${description}` +
        '\n' +
        `BCA VA: *${bcaVaPrefix}-${vaId}*` +
        '\n' +
        `Mandiri VA: *${mandiriVaPrefix}-${vaId}`;
      invoiceList.push(invoice);
    }

    return {
      subscriptionMessage: subscriptionList.join('\n'),
      invoiceMessage: invoiceList.join('-- \n'),
    };
  }

  async getCustomerTickets(phone: string) {
    const [openTickets, recentlyClosedTickets] = await Promise.all([
      this.phonebookRepository.getCustomerTicketsOpen(phone),
      this.phonebookRepository.getCustomerTicketsClosed(phone),
    ]).then(([openTickets, recentlyClosedTickets]) => {
      const hashIdsConfig = this.configService.get('hashIds');
      const hashIds = new Hashids(
        hashIdsConfig.salt,
        hashIdsConfig.length,
        hashIdsConfig.charPool,
      );
      return [
        openTickets.map((ticket) => {
          return {
            ...ticket,
            url: `${this.configService.get(
              'IS_HOST',
            )}/ticket?id=${hashIds.encode(ticket.ticketId)}`,
          };
        }),
        recentlyClosedTickets.map((ticket) => {
          return {
            ...ticket,
            url: `${this.configService.get(
              'IS_HOST',
            )}/ticket?id=${hashIds.encode(ticket.ticketId)}`,
          };
        }),
      ];
    });

    return {
      openTickets,
      recentlyClosedTickets,
    };
  }

  async getRecentReceipts(phone: string) {
    const recentReceipt = await this.phonebookRepository.getRecentReceipts(
      phone,
    );
    return { recentReceipt };
  }
}
