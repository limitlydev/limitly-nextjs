import { HttpClient } from '../client';
import {
  ValidateRequestRequest,
  ValidateRequestResponse,
  RequestOptions,
} from '../types';

/**
 * Module for validating requests
 * Optimized for Next.js server-side rendering
 */
export class ValidationModule {
  constructor(private client: HttpClient) {}

  /**
   * Validates a user request using their API Key
   * @param data - Request validation data
   * @param options - Request options including Next.js cache options
   * @returns Promise with validation result
   */
  async validateRequest(
    data: ValidateRequestRequest,
    options?: RequestOptions
  ): Promise<ValidateRequestResponse> {
    return this.client.post<ValidateRequestResponse>('/validate', data, options);
  }

  /**
   * Convenience method to validate a request with individual parameters
   * @param apiKey - The API key to validate
   * @param endpoint - The endpoint being accessed
   * @param method - The HTTP method
   * @param options - Request options including Next.js cache options
   * @returns Promise with validation result
   */
  async validate(
    apiKey: string,
    endpoint: string,
    method: string,
    options?: RequestOptions
  ): Promise<ValidateRequestResponse> {
    return this.validateRequest(
      {
        api_key: apiKey,
        endpoint,
        method,
      },
      options
    );
  }

  /**
   * Validates a request with additional context for Next.js
   * @param apiKey - The API key to validate
   * @param endpoint - The endpoint being accessed
   * @param method - The HTTP method
   * @param context - Additional context (e.g., user ID, session info)
   * @param options - Request options
   * @returns Promise with validation result
   */
  async validateWithContext(
    apiKey: string,
    endpoint: string,
    method: string,
    context?: Record<string, any>,
    options?: RequestOptions
  ): Promise<ValidateRequestResponse> {
    const requestData: ValidateRequestRequest & { context?: Record<string, any> } = {
      api_key: apiKey,
      endpoint,
      method,
      ...(context && { context }),
    };

    return this.client.post<ValidateRequestResponse>('/validate', requestData, options);
  }
} 