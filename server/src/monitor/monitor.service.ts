import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class MonitorService {
  private readonly base = 'https://api.uptimerobot.com/v2';
  private readonly apiKey = 'u3084781-f8637905a333e32da7917b31';

  private client(): AxiosInstance {
    return axios.create({
      baseURL: this.base,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
  }

  // Create a new HTTP monitor
 async createMonitor(name: string, url: string, intervalMinutes: number) {
  try {
    // Convert minutes to seconds for UptimeRobot
    let intervalSeconds = intervalMinutes * 60;

    // Force minimum of 5 minutes (300 seconds)
    if (intervalSeconds < 300) intervalSeconds = 300;

    const res = await this.client().post('/newMonitor', {
      api_key: this.apiKey,
      friendly_name: name,
      url,
      type: 1,  // HTTP monitor
      interval: intervalSeconds,   // in seconds
      timeout: 30,
      grace_period: 300,
      http_method_type: 'HEAD',
      auth_type: 'NONE',
      post_value_type: 'KEY_VALUE',
      post_value_data: {},
      success_http_response_codes: ['2xx', '3xx'],
      assigned_alert_contacts: [],
      check_ssl_errors: false,
      follow_redirections: false,
      tag_names: [],
      maintenance_windows_ids: [],
      domain_expiration_reminder: false,
      ssl_expiration_reminder: false,
      response_time_threshold: 0,
      regional_data: 'na',
      config: { dns_records: {}, ssl_expiration_period_days: [7, 14, 30] },
    });

    return res.data;
  } catch (err: any) {
    throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
  }
}


  // Delete monitor
  async deleteMonitor(id: string) {
    try {
      const res = await this.client().post('/deleteMonitor', {
        api_key: this.apiKey,
        format: 'json',
        id,
      });
      return res.data;
    } catch (err: any) {
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Get all monitors
  async getMonitors() {
    try {
      const res = await this.client().post('/getMonitors', {
        api_key: this.apiKey,
        format: 'json',
        logs: 1,
        response_times: 1,
      });
      return res.data.monitors;
    } catch (err: any) {
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Get monitor details by ID
  async getMonitorDetails(id: string) {
    try {
      const res = await this.client().post('/getMonitors', {
        api_key: this.apiKey,
        format: 'json',
        logs: 1,
        response_times: 1,
        monitors: id,
      });
      return res.data.monitors[0];
    } catch (err: any) {
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Pause monitor
  async pauseMonitor(id: string) {
    try {
      const res = await this.client().post('/pauseMonitor', {
        api_key: this.apiKey,
        format: 'json',
        id,
      });
      return res.data;
    } catch (err: any) {
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Restart monitor (simulate by pausing and resetting)
  async restartMonitor(id: string) {
    try {
      await this.pauseMonitor(id); // pause first
      const res = await this.client().post('/resetMonitor', {
        api_key: this.apiKey,
        format: 'json',
        id,
      });
      return res.data;
    } catch (err: any) {
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
