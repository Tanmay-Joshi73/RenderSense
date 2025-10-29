import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class RenderService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('Render_EndPoint')!;
    this.apiKey = this.config.get<string>('Render_Key')!;
  }

  /**
   * Private helper to make authorized requests to Render API.
   */
  private async makeRequest<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await axios({
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        ...config,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Render API error (${endpoint}):`, error.response?.data || error.message);
      throw new InternalServerErrorException('Error communicating with Render API');
    }
  }

  /**
   * Fetch all services (active + inactive)
   */
  async getAllServices(): Promise<any[]> {
    return await this.makeRequest<any[]>('/services');
  }

  /**
   * Fetch only active (non-suspended) services
   */
  async getActiveServices(): Promise<any[]> {
    const services = await this.getAllServices();
    return services.filter((item: any) => item.service.suspended === 'not_suspended');
  }

  /**
   * Fetch only inactive (suspended) services
   */
  async getInactiveServices(): Promise<any[]> {
    const services = await this.getAllServices();
    return services.filter((item: any) => item.service.suspended !== 'not_suspended');
  }

  /**
   * Fetch a specific service by its ID
   */
  async getServiceById(serviceId: string): Promise<any> {
    return await this.makeRequest<any>(`/services/${serviceId}`);
  }

  /**
   * Fetch all environment groups (for deployment configs)
   */
  async getEnvironmentGroups(limit = 20): Promise<any[]> {
    const data = await this.makeRequest<any>(`/env-groups?limit=${limit}`);
    return data;
  }

  /**
   * Fetch all deployments (recent deployments of services)
   */
  async getDeployments(): Promise<any[]> {
    return await this.makeRequest<any[]>('/services/');
  }

  /**
   * Fetch metrics of a specific service (if your Render plan supports it)
   */
  async getServiceMetrics(serviceId: string): Promise<any> {
    return await this.makeRequest<any>(`/metrics-stream/${serviceId}`);
  }
}
