import { HttpClient } from '../client';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserUsage,
  ApiKey,
  ApiResponse,
  PaginatedResponse,
  RequestOptions,
} from '../types';

/**
 * Module for managing Users
 * Optimized for Next.js server-side rendering
 */
export class UsersModule {
  constructor(private client: HttpClient) {}

  /**
   * Lists all users
   * @param options - Request options including Next.js cache options
   * @returns Promise with paginated users
   */
  async list(options?: RequestOptions): Promise<PaginatedResponse<User>> {
    return this.client.get<PaginatedResponse<User>>('/users', options);
  }

  /**
   * Creates a new user
   * @param data - User creation data
   * @param options - Request options
   * @returns Promise with created user
   */
  async create(
    data: CreateUserRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<User>> {
    return this.client.post<ApiResponse<User>>('/users', data, options);
  }

  /**
   * Gets a specific user by ID
   * @param userId - The user ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with user details
   */
  async get(userId: number, options?: RequestOptions): Promise<ApiResponse<User>> {
    return this.client.get<ApiResponse<User>>(`/users/${userId}`, options);
  }

  /**
   * Updates an existing user
   * @param userId - The user ID
   * @param data - Update data
   * @param options - Request options
   * @returns Promise with updated user
   */
  async update(
    userId: number,
    data: UpdateUserRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<User>> {
    return this.client.put<ApiResponse<User>>(`/users/${userId}`, data, options);
  }

  /**
   * Deletes a user
   * @param userId - The user ID
   * @param options - Request options
   * @returns Promise with deletion confirmation
   */
  async delete(userId: number, options?: RequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<ApiResponse<{ message: string }>>(`/users/${userId}`, options);
  }

  /**
   * Gets user usage statistics
   * @param userId - The user ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with user usage
   */
  async getUsage(userId: number, options?: RequestOptions): Promise<ApiResponse<UserUsage>> {
    return this.client.get<ApiResponse<UserUsage>>(`/users/${userId}/usage`, options);
  }

  /**
   * Gets all API Keys for a user
   * @param userId - The user ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with user API keys
   */
  async getKeys(userId: number, options?: RequestOptions): Promise<ApiResponse<ApiKey[]>> {
    return this.client.get<ApiResponse<ApiKey[]>>(`/users/${userId}/keys`, options);
  }

  /**
   * Creates a new API Key for a user
   * @param userId - The user ID
   * @param data - API key creation data
   * @param options - Request options
   * @returns Promise with created API key
   */
  async createKey(
    userId: number,
    data: { name: string; plan_id?: string; status?: 'active' | 'inactive' },
    options?: RequestOptions
  ): Promise<ApiResponse<ApiKey>> {
    return this.client.post<ApiResponse<ApiKey>>(`/users/${userId}/keys`, data, options);
  }

  /**
   * Gets users with usage statistics (optimized for Next.js)
   * @param options - Request options
   * @returns Promise with users and their usage
   */
  async listWithUsage(options?: RequestOptions): Promise<PaginatedResponse<User & { usage?: UserUsage }>> {
    return this.client.get<PaginatedResponse<User & { usage?: UserUsage }>>('/users/with-usage', options);
  }
} 