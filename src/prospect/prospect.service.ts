import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios'
import * as FormData from 'form-data'

@Injectable()
export class ProspectService {
  constructor(
    private configService: ConfigService,
  ) {}

  async getToken() {
    const form = new FormData()
    form.append('grant_type', this.configService.get('PROSPECT_GRANT_TYPE'))
    form.append('client_id', this.configService.get('PROSPECT_CLIENT_ID'))
    form.append('client_secret', this.configService.get('PROSPECT_CLIENT_SECRET'))
    form.append('username', this.configService.get('PROSPECT_USERNAME'))
    form.append('password', this.configService.get('PROSPECT_PASSWORD'))
    const options = {
      headers: {
        ...form.getHeaders()
      }
    }
    const response = await axios.post(this.configService.get('PROSPECT_TOKEN_API_URL'), form, options)
    return response.data.access_token
  }

  async getOwner(token: string) {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.get(this.configService.get('PROSPECT_PROFILE_API_URL'), { headers })
    return response.data.data.user.user_uuid
  }

  async createLead(name: string, phone: string) {
    const token = await this.getToken()
    const owner = await this.getOwner(token)
    const groups = this.configService.get('PROSPECT_LEAD_GROUP_IDS').split(',')
    const data = {
      group_id: groups,
      description: this.configService.get('PROSPECT_LEAD_DESCRIPTION'),
      name,
      salutation_id: this.configService.get('PROSPECT_LEAD_SALUTATION_ID'),
      phones: [phone.startsWith('+') ? phone : `+${phone}`],
      email: null,
      website: null,
      company: '',
      title: null,
      number_of_employees: null,
      account_industry_list_id: null,
      product_services: [],
      lead_source_id: this.configService.get('PROSPECT_LEAD_SOURCE_ID'),
      owner,
      latitude: null,
      longitude: null,
      street: null,
      street_detail: null,
      sub_district: null,
      district: null,
      city: null,
      province: null,
      country: null,
      zip_code: null,
      custom_attributes: []
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
    axios.post(this.configService.get('PROSPECT_LEAD_API_URL'), data, { headers })
        .catch(error => {
          console.error('Error:', error.response.data)
        })
  }
}
