import { Injectable } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { NocIssueRepository } from './repositories/noc-issue.repository';
import { NocPopRepository } from './repositories/noc-pop.repository';

@Injectable()
export class NocService {
  constructor(
    private nocIssueRepository: NocIssueRepository,
    private nocPopRepository: NocPopRepository,
    private customersService: CustomersService,
  ) {}

  async getAllImpactedNocIssue() {
    return this.nocIssueRepository.getAllImpactedNocIssue();
  }

  async getImpactedSubscriber(issueIds: number[]) {
    return this.nocIssueRepository.getImpactedSubscriber(issueIds);
  }

  getValidDeviceIds(idSet: string) {
    if (!idSet) {
      return [];
    }
    const returnData = [];
    const devices = idSet.split(',');
    for (const id of devices) {
      if (+id) {
        returnData.push(+id);
      }
    }
    return returnData;
  }

  async getImpactedNocIssueByPhone(phone: string) {
    const issues = await this.getAllImpactedNocIssue();
    const issueMap = {};
    const fttxIssues = [];

    for (const issue of issues) {
      const {
        id,
        pop_id: popId,
        ap_id: apSet,
        switch_id: switchSet,
        ...issueProp
      } = issue;
      issueMap[id] = { ...issueProp, subscriber: [] };
      if (issue.type === 'fttx') {
        fttxIssues.push(id);
        continue;
      }
      if (issue.type === 'pop') {
        const impactedSubscribers = await this.getImpactedPopSubscriber(
          popId,
          apSet,
          switchSet,
        );
        for (const subId of impactedSubscribers) {
          issueMap[id].subscriber.push(subId);
        }
      }
    }

    const impactedSubscribers = await this.getImpactedSubscriber(fttxIssues);
    for (const { noc_id: issueId, cs_id: subId } of impactedSubscribers) {
      issueMap[issueId].subscriber.push(subId);
    }

    const subscriptions =
      await this.customersService.getInternetSubscriptionByPhone(phone);

    return {
      impactedIssues: this.collectImpactedNocIssue(issueMap, subscriptions),
      subscriptions,
    };
  }

  async getImpactedPopSubscriber(
    popId: number,
    apSet: string,
    switchSet: string,
  ) {
    const returnData = [];
    let impactedAps = this.getValidDeviceIds(apSet);
    let impactedSwitches = this.getValidDeviceIds(switchSet);
    if (impactedAps.length === 0 && impactedSwitches.length === 0) {
      impactedAps = await this.nocPopRepository.getAllAp(popId);
      impactedSwitches = await this.nocPopRepository.getAllSwitch(popId);
    }
    if (impactedAps.length > 0) {
      const subscribers = await this.nocPopRepository.getApLinkedSubscription(
        impactedAps.map(ap => ap.id),
      );
      for (const { CustServId: subId } of subscribers) {
        returnData.push(subId);
      }
    }
    if (impactedSwitches.length > 0) {
      const subscribers =
        await this.nocPopRepository.getSwitchLinkedSubscription(
          impactedSwitches.map(sw => sw.id),
        );
      for (const { CustServId: subId } of subscribers) {
        returnData.push(subId);
      }
    }
    return returnData;
  }

  collectImpactedNocIssue(issueMap: any, subscriptions: any) {
    const returnData = [];

    for (const issueId in issueMap) {
      for (const subId in subscriptions) {
        if (!subscriptions[subId].installation_address) {
          continue;
        }
        const issueData = {
          issue: issueMap[issueId].subject,
          start: issueMap[issueId].start_time,
          effect: issueMap[issueId].effect,
          service: subscriptions[subId].description,
          address: subscriptions[subId].installation_address.replace(
            /\n/g,
            ' ',
          ),
        };

        if (issueMap[issueId].subscriber.includes(+subId)) {
          returnData.push(issueData);
          continue;
        }

        if (
          issueMap[issueId].type === 'upstream' &&
          issueMap[issueId].branchId === subscriptions[subId].branchId
        ) {
          returnData.push(issueData);
        }
      }
    }

    return returnData;
  }

  async getImpactedNocIssueMessage(phone: string) {
    const { impactedIssues, subscriptions } =
      await this.getImpactedNocIssueByPhone(phone);
    let issueMessage = '';
    const timeFormatOptions = {
      timeZone: 'Asia/Jakarta',
      year: 'numeric' as 'numeric',
      month: '2-digit' as '2-digit',
      day: '2-digit' as '2-digit',
      hour: '2-digit' as '2-digit',
      minute: '2-digit' as '2-digit',
      hour12: false,
    };

    for (const issue of impactedIssues) {
      timeFormatOptions.timeZone =
        issue.branchId === '062' ? 'Asia/Makassar' : 'Asia/Jakarta';
      const formatter = new Intl.DateTimeFormat('en-US', timeFormatOptions);
      const [date, time] = formatter.format(issue.start).split(', ');
      const [mm, dd, yyyy] = date.split('/');
      const start = `${yyyy}-${mm}-${dd} ${time}`;
      issueMessage +=
        '"' +
        issue.issue +
        '" sejak ' +
        start +
        ' mengakibatkan "' +
        issue.effect +
        '" pada layanan internet anda (' +
        issue.service +
        ') di "' +
        issue.address +
        '".\n';
    }
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
      issueMessage,
      subscriptionMessage: subscriptionMessages.join('\n'),
    };
  }
}
