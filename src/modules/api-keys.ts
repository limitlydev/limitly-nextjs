import { HttpClient } from '../client';
import {
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  ApiKeyUsage,
  ApiKeyRequestsResponse,
  ApiResponse,
  PaginatedResponse,
  LimitInfo,
  RequestOptions,
} from '../types';

/**
 * Module for managing API Keys
 * Optimized for Next.js server-side rendering
 */
export class ApiKeysModule {
  constructor(private client: HttpClient) {}

  /**
   * Lists all API Keys for the authenticated owner
   * @param options - Request options including Next.js cache options
   * @returns Promise with paginated API keys
   */
  async list(options?: RequestOptions): Promise<PaginatedResponse<ApiKey>> {
    return this.client.get<PaginatedResponse<ApiKey>>('/keys', options);
  }

  /**
   * Creates a new API Key
   * @param data - API key creation data
   * @param options - Request options
   * @returns Promise with created API key
   */
  async create(
    data: CreateApiKeyRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKey & { limitInfo?: LimitInfo }>> {
    return this.client.post<ApiResponse<ApiKey & { limitInfo?: LimitInfo }>>('/keys', data, options);
  }

  /**
   * Gets a specific API Key by ID
   * @param keyId - The API key ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with API key details
   */
  async get(keyId: string, options?: RequestOptions): Promise<ApiResponse<ApiKey>> {
    return this.client.get<ApiResponse<ApiKey>>(`/keys/${keyId}`, options);
  }

  /**
   * Updates an existing API Key
   * @param keyId - The API key ID
   * @param data - Update data
   * @param options - Request options
   * @returns Promise with updated API key
   */
  async update(
    keyId: string,
    data: UpdateApiKeyRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKey>> {
    return this.client.put<ApiResponse<ApiKey>>(`/keys/${keyId}`, data, options);
  }

  /**
   * Deletes an API Key (soft delete)
   * @param keyId - The API key ID
   * @param options - Request options
   * @returns Promise with deletion confirmation
   */
  async delete(keyId: string, options?: RequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<ApiResponse<{ message: string }>>(`/keys/${keyId}`, options);
  }

  /**
   * Regenerates an existing API Key
   * @param keyId - The API key ID
   * @param options - Request options
   * @returns Promise with regenerated API key
   */
  async regenerate(
    keyId: string,
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKey>> {
    return this.client.post<ApiResponse<ApiKey>>(`/keys/${keyId}/regenerate`, undefined, options);
  }

  /**
   * Gets usage statistics for an API Key
   * @param keyId - The API key ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with usage statistics
   */
  async getUsage(keyId: string, options?: RequestOptions): Promise<ApiResponse<ApiKeyUsage>> {
    return this.client.get<ApiResponse<ApiKeyUsage>>(`/keys/${keyId}/usage`, options);
  }

  /**
   * Gets detailed request history for an API Key
   * @param keyId - The API key ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with request history
   */
  async getRequests(
    keyId: string,
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKeyRequestsResponse>> {
    return this.client.get<ApiResponse<ApiKeyRequestsResponse>>(`/keys/${keyId}/requests`, options);
  }

  /**
   * Gets API keys with usage statistics (optimized for Next.js)
   * @param options - Request options
   * @returns Promise with API keys and their usage
   */
  async listWithUsage(options?: RequestOptions): Promise<PaginatedResponse<ApiKey & { usage?: ApiKeyUsage }>> {
    return this.client.get<PaginatedResponse<ApiKey & { usage?: ApiKeyUsage }>>('/keys/with-usage', options);
  }
} 