import { Injectable } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { NocIssueRepository } from './repositories/noc-issue.repository';

@Injectable()
export class NocService {
  constructor(
    private nocIssueRepository: NocIssueRepository,
    private customersService: CustomersService,
  ) {}

  async getEffectedNocIssue() {
    return this.nocIssueRepository.getEffectedNocIssue();
  }

  async getEffectedSubscription(issueIds: number[]) {
    return this.nocIssueRepository.getEffectedSubscription(issueIds);
  }

  async getEffectedNocIssueByPhone(phone: string) {
    const issues = await this.getEffectedNocIssue();
    const issueMap = {};
    const fttxIssues = [];

    for (const issue of issues) {
      const { id, pop_id, ap_id, ...issueProp } = issue;
      issueMap[id] = { ...issueProp, subscription: [] };
      if (issue.type === 'fttx') {
        fttxIssues.push(id);
        continue;
      }
      // FIXME: pop issue
    }

    const effectedSubscription = await this.getEffectedSubscription(fttxIssues);
    for (const {
      noc_id: issueId,
      cs_id: subscription,
    } of effectedSubscription) {
      issueMap[issueId].subscription.push(subscription);
    }

    const subscriptions =
      await this.customersService.getValidSubscriptionByPhone(phone);

    const returnData = [];
    for (const issueId in issueMap) {
      for (const sub in subscriptions) {
        if (issueMap[issueId].subscription.includes(+sub)) {
          returnData.push({
            issue: issueMap[issueId].subject,
            start: issueMap[issueId].start_time,
            branch: issueMap[issueId].branchId,
            effect: issueMap[issueId].effect,
            service: subscriptions[sub].description,
            address: subscriptions[sub].installation_address,
          });
        }
      }
    }
    return returnData;
  }

  async getEffectedNocIssueMessage(phone: string) {
    const issues = await this.getEffectedNocIssueByPhone(phone);
    let message = '';
    const timeFormatOptions = {
      timeZone: 'Asia/Jakarta',
      year: 'numeric' as 'numeric',
      month: '2-digit' as '2-digit',
      day: '2-digit' as '2-digit',
      hour: '2-digit' as '2-digit',
      minute: '2-digit' as '2-digit',
      hour12: false,
    };

    for (const issue of issues) {
      timeFormatOptions.timeZone =
        issue.branch === '062' ? 'Asia/Makassar' : 'Asia/Jakarta';
      const formatter = new Intl.DateTimeFormat('en-US', timeFormatOptions);
      const [date, time] = formatter.format(issue.start).split(', ');
      const [mm, dd, yyyy] = date.split('/');
      const start = `${yyyy}-${mm}-${dd} ${time}`;
      message +=
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
    return { issueMessage: message };
  }
}
