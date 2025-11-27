import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class RenderService {
  private base = 'https://api.render.com/v1';
  private client(apiKey: string): AxiosInstance {
    return axios.create({
      baseURL: this.base,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      timeout: 30_000,
    });
  }

  // ---------- helpers ----------
  private getServiceStatus(svc: any) {
  const s = svc.service ?? svc;

  // Render's real boolean flag
  if (s.suspended === true) return 'stopped';
  if (s.suspended === false) return 'working';

  // Extract the real Render status
  const raw =
    s.serviceDetails?.status ||
    s.service?.serviceDetails?.status ||
    s.status ||
    '';

  if (raw === 'live') return 'working';

  if ([
    'build_in_progress',
    'deploy_in_progress',
    'building',
    'deploying',
  ].includes(raw)) {
    return 'deploying';
  }

  if ([
    'not_live',
    'inactive',
    'deactivated',
    'failed',
  ].includes(raw)) {
    return 'stopped';
  }

  return 'working'; 
}


  private safeField(obj: any, path: string[], fallback: any) {
    try {
      let cur = obj;
      for (const p of path) {
        if (cur == null) return fallback;
        cur = cur[p];
      }
      return cur == null ? fallback : cur;
    } catch {
      return fallback;
    }
  }

  // ---------- list & format ----------
  async listServices(apiKey: string) {
    const client = this.client(apiKey);

    try {
      const resp = await client.get('/services');
      console.log(resp.data.serviceDetails)
      const items: any[] = resp.data; // raw array

      const formatted = items.map((item) => {
  const svc = item.service ?? item;

  // Extract URL based on service type
  let url = null;

  if (svc.serviceDetails) {
    if (svc.serviceDetails.url) {
      url = svc.serviceDetails.url; // Web services
    } else if (svc.serviceDetails.publishUrl) {
      url = svc.serviceDetails.publishUrl; // Static sites
    }
  }

  return {
    id: this.safeField(svc, ['id'], 'unknown'),
    name: this.safeField(svc, ['name'], 'unknown'),
    createdAt: this.safeField(svc, ['createdAt'], null),
    region: this.safeField(
      svc,
      ['serviceDetails', 'region'],
      this.safeField(svc, ['service', 'serviceDetails', 'region'], 'Unknown'),
    ),
    type: this.safeField(svc, ['type'], 'unknown'),
    suspended: svc.suspended ?? false,
    not_suspended: svc.not_suspended ?? false,
    status: this.getServiceStatus(item),
    url: url, 
    raw: svc,
  };
});

      const working = formatted.filter((s) => s.status === 'working');
      const stopped = formatted.filter((s) => s.status === 'stopped');

      return {
        Status: true,
        Total: formatted.length,
        Working_Count: working.length,
        Stopped_Count: stopped.length,
        Working: working,
        Stopped: stopped,
        All_Services: formatted,
      };
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return { Status: false, Message: 'Invalid API key' };
      }
      throw new HttpException(
        { Status: false, Message: 'Failed to list services', error: err?.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------- control endpoints ----------
  async suspendService(apiKey: string, serviceId: string) {
    const client = this.client(apiKey);
    try {
      const resp = await client.post(`/services/${serviceId}/suspend`);
      return { Status: true, Message: 'Service suspended', data: resp.data };
    } catch (err: any) {
      if (err?.response?.status === 401) return { Status: false, Message: 'Invalid API key' };
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async resumeService(apiKey: string, serviceId: string) {
    const client = this.client(apiKey);
    try {
      const resp = await client.post(`/services/${serviceId}/resume`);
      return { Status: true, Message: 'Service resumed', data: resp.data };
    } catch (err: any) {
      if (err?.response?.status === 401) return { Status: false, Message: 'Invalid API key' };
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async restartService(apiKey: string, serviceId: string) {
    const client = this.client(apiKey);
    try {
      // POST /v1/services/{serviceId}/restart
      // console.log(client)
      const resp = await client.post(`/services/${serviceId}/restart`);
      
      console.log(resp.statusText)   
      return { Status: true, Message: 'Restart triggered', data: resp.data };
    } catch (err: any) {
      if (err?.response?.status === 401) return { Status: false, Message: 'Invalid API key' };
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createDeploy(apiKey: string, serviceId: string, opts?: { commit?: string; skip?: boolean }) {
    const client = this.client(apiKey);
    try {
      // POST /v1/services/{serviceId}/deploys
      const body: any = {};
      if (opts?.commit) body.commit = opts.commit;
      if (opts?.skip === true) body.skip = true;
      const resp = await client.post(`/services/${serviceId}/deploys`, body);
      return { Status: true, Message: 'Deploy triggered', data: resp.data };
    } catch (err: any) {
      if (err?.response?.status === 401) return { Status: false, Message: 'Invalid API key' };
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ---------- logs ----------
  /**
   * Querying logs:
   * - startTime, endTime are ISO strings (optional)
   * - query (optional): filter text
   * - limit (optional)
   */
  async getLogs(apiKey: string, opts: { serviceId?: string; startTime?: string; endTime?: string; limit?: number; query?: string }) {
    const client = this.client(apiKey);

    try {
      const params: any = {};
      if (opts.serviceId) params.resourceIds = opts.serviceId;
      if (opts.startTime) params.startTime = opts.startTime;
      if (opts.endTime) params.endTime = opts.endTime;
      if (opts.limit) params.limit = opts.limit;
      if (opts.query) params.q = opts.query;

      // GET /v1/logs
      const resp = await client.get('/logs', { params });
      return { Status: true, Count: resp.data?.logs?.length ?? resp.data?.length ?? 0, data: resp.data };
    } catch (err: any) {
      if (err?.response?.status === 401) return { Status: false, Message: 'Invalid API key' };
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  // ---------- metrics ----------
  /**
   * metric: 'cpu' | 'memory'
   * resourceIds: comma separated or array of service ids
   * startTime, endTime ISO strings optional
   */
  async getMetrics(apiKey: string, metric: 'cpu' | 'memory', opts: { resourceIds?: string | string[]; startTime?: string; endTime?: string; step?: string }) {
    const client = this.client(apiKey);
    try {
      const params: any = {};
      if (opts.resourceIds) params.resourceIds = Array.isArray(opts.resourceIds) ? opts.resourceIds : [opts.resourceIds];
      if (opts.startTime) params.startTime = opts.startTime;
      if (opts.endTime) params.endTime = opts.endTime;
      if (opts.step) params.step = opts.step;

      // GET /v1/metrics/cpu or /v1/metrics/memory
      const path = metric === 'cpu' ? '/metrics/cpu' : '/metrics/memory';
      const resp = await client.get(path, { params });
      return { Status: true, metric, data: resp.data };
    } catch (err: any) {
      if (err?.response?.status === 401) return { Status: false, Message: 'Invalid API key' };
      throw new HttpException(err?.response?.data || err?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
