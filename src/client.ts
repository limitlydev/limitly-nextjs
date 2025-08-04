import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { LimitlyConfig, LimitlyError, RequestOptions } from './types';

/**
 * HTTP client for making requests to the Limitly API
 * Optimized for Next.js server-side rendering
 */
export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: LimitlyConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://xfkyofkqbukqtxcuapvf.supabase.co/functions/v1';
    this.timeout = config.timeout || 30000;
  }

  /**
   * Makes an HTTP request to the Limitly API
   * @param endpoint - The API endpoint to call
   * @param options - Axios request configuration
   * @param requestOptions - Additional request options including Next.js specific options
   * @returns Promise with the response data
   */
  private async makeRequest<T>(
    endpoint: string,
    options: AxiosRequestConfig = {},
    requestOptions?: RequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const requestConfig: AxiosRequestConfig = {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
        ...requestOptions?.headers,
      },
      timeout: requestOptions?.timeout || this.timeout,
    };

    try {
      const response: AxiosResponse<T> = await axios(url, requestConfig);
      return response.data;
    } catch (error: any) {
      if (error instanceof LimitlyError) {
        throw error;
      }
      
      if (error.response) {
        // Server response error
        const data = error.response.data;
        throw new LimitlyError(
          data.error || `HTTP ${error.response.status}: ${error.response.statusText}`,
          error.response.status,
          data
        );
      } else if (error.request) {
        // Network error
        throw new LimitlyError(
          `Network error: ${error.message}`,
          0,
          { originalError: error.message }
        );
      } else {
        // Unexpected error
        throw new LimitlyError('Unknown error occurred', 0);
      }
    }
  }

  /**
   * Makes a GET request to the API with Next.js cache support
   * @param endpoint - The API endpoint
   * @param requestOptions - Additional request options
   * @returns Promise with the response data
   */
  async get<T>(endpoint: string, requestOptions?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET' }, requestOptions);
  }

  /**
   * Makes a POST request to the API
   * @param endpoint - The API endpoint
   * @param body - Request body data
   * @param requestOptions - Additional request options
   * @returns Promise with the response data
   */
  async post<T>(
    endpoint: string,
    body?: any,
    requestOptions?: RequestOptions
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      data: body,
    }, requestOptions);
  }

  /**
   * Makes a PUT request to the API
   * @param endpoint - The API endpoint
   * @param body - Request body data
   * @param requestOptions - Additional request options
   * @returns Promise with the response data
   */
  async put<T>(
    endpoint: string,
    body?: any,
    requestOptions?: RequestOptions
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      data: body,
    }, requestOptions);
  }

  /**
   * Makes a DELETE request to the API
   * @param endpoint - The API endpoint
   * @param requestOptions - Additional request options
   * @returns Promise with the response data
   */
  async delete<T>(endpoint: string, requestOptions?: RequestOptions): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' }, requestOptions);
  }

  /**
   * Gets the base URL for debugging purposes
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Gets the API key (masked for security)
   */
  getApiKey(): string {
    return this.apiKey.substring(0, 8) + '...';
  }
} 