import { HttpClient } from '../client';
import {
  Plan,
  CreatePlanRequest,
  UpdatePlanRequest,
  PlanUsage,
  PlanUsersResponse,
  PlanKeysResponse,
  ApiResponse,
  PaginatedResponse,
  RequestOptions,
} from '../types';

/**
 * Module for managing Plans
 * Optimized for Next.js server-side rendering
 */
export class PlansModule {
  constructor(private client: HttpClient) {}

  /**
   * Lists all plans
   * @param options - Request options including Next.js cache options
   * @returns Promise with paginated plans
   */
  async list(options?: RequestOptions): Promise<PaginatedResponse<Plan>> {
    return this.client.get<PaginatedResponse<Plan>>('/plans', options);
  }

  /**
   * Creates a new plan
   * @param data - Plan creation data
   * @param options - Request options
   * @returns Promise with created plan
   */
  async create(
    data: CreatePlanRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<Plan>> {
    return this.client.post<ApiResponse<Plan>>('/plans', data, options);
  }

  /**
   * Gets a specific plan by ID
   * @param planId - The plan ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with plan details
   */
  async get(planId: string, options?: RequestOptions): Promise<ApiResponse<Plan>> {
    return this.client.get<ApiResponse<Plan>>(`/plans/${planId}`, options);
  }

  /**
   * Updates an existing plan
   * @param planId - The plan ID
   * @param data - Update data
   * @param options - Request options
   * @returns Promise with updated plan
   */
  async update(
    planId: string,
    data: UpdatePlanRequest,
    options?: RequestOptions
  ): Promise<ApiResponse<Plan>> {
    return this.client.put<ApiResponse<Plan>>(`/plans/${planId}`, data, options);
  }

  /**
   * Deletes a plan
   * @param planId - The plan ID
   * @param options - Request options
   * @returns Promise with deletion confirmation
   */
  async delete(planId: string, options?: RequestOptions): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<ApiResponse<{ message: string }>>(`/plans/${planId}`, options);
  }

  /**
   * Gets usage statistics for a plan
   * @param planId - The plan ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with plan usage statistics
   */
  async getUsage(planId: string, options?: RequestOptions): Promise<ApiResponse<PlanUsage>> {
    return this.client.get<ApiResponse<PlanUsage>>(`/plans/${planId}/usage`, options);
  }

  /**
   * Gets all users assigned to a plan
   * @param planId - The plan ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with plan users
   */
  async getUsers(planId: string, options?: RequestOptions): Promise<ApiResponse<PlanUsersResponse>> {
    return this.client.get<ApiResponse<PlanUsersResponse>>(`/plans/${planId}/users`, options);
  }

  /**
   * Gets all API Keys assigned to a plan
   * @param planId - The plan ID
   * @param options - Request options including Next.js cache options
   * @returns Promise with plan API keys
   */
  async getKeys(planId: string, options?: RequestOptions): Promise<ApiResponse<PlanKeysResponse>> {
    return this.client.get<ApiResponse<PlanKeysResponse>>(`/plans/${planId}/keys`, options);
  }

  /**
   * Gets plans with usage statistics (optimized for Next.js)
   * @param options - Request options
   * @returns Promise with plans and their usage
   */
  async listWithUsage(options?: RequestOptions): Promise<PaginatedResponse<Plan & { usage?: PlanUsage }>> {
    return this.client.get<PaginatedResponse<Plan & { usage?: PlanUsage }>>('/plans/with-usage', options);
  }
} 