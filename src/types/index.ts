// Base types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count?: number;
}

// API Keys types
export interface ApiKey {
  id: string;
  name: string;
  api_key?: string; // Only included in creation/regeneration
  status: 'active' | 'inactive';
  created_at: string;
  last_used_at?: string;
  user_id?: number;
  plan_id?: string;
  user?: User;
  plan?: Plan;
}

export interface CreateApiKeyRequest {
  name: string;
  user_id?: number;
  plan_id?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateApiKeyRequest {
  name?: string;
  user_id?: number;
  plan_id?: string;
  status?: 'active' | 'inactive';
}

export interface ApiKeyUsage {
  apiKeyId: string;
  apiKeyName: string;
  created_at: string;
  periodStart: string;
  periodEnd: string;
  totalRequests: number;
  requestsInPeriod: number;
  percentageUsed: number;
  limit: number;
  planName: string;
  isUnlimited: boolean;
}

export interface ApiKeyRequest {
  api_key_id: string;
  created_at: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time_ms: number;
}

export interface ApiKeyRequestsResponse {
  apiKeyId: string;
  apiKeyName: string;
  created_at: string;
  periodStart: string;
  periodEnd: string;
  totalRequests: number;
  requestsInPeriod: number;
  requestsInPeriodDetails: ApiKeyRequest[];
}

export interface LimitInfo {
  can_create: boolean;
  current_count: number;
  max_allowed: number;
  remaining_keys: number;
  plan_type: string;
}

// Plans types
export interface Plan {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  max_requests: number;
  request_period: 'day' | 'week' | 'month' | 'year';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePlanRequest {
  name: string;
  description?: string;
  max_requests: number;
  request_period: 'day' | 'week' | 'month' | 'year';
  is_active?: boolean;
}

export interface UpdatePlanRequest {
  name?: string;
  description?: string;
  max_requests?: number;
  request_period?: 'day' | 'week' | 'month' | 'year';
  is_active?: boolean;
}

export interface PlanUsage {
  plan_id: string;
  plan_name: string;
  max_requests: number;
  request_period: string;
  total_requests: number;
  percentage_used: number;
  users_count: number;
  api_keys_count: number;
  is_unlimited: boolean;
}

export interface PlanUsersResponse {
  plan: Plan;
  users: User[];
}

export interface PlanKeysResponse {
  plan: Plan;
  api_keys: ApiKey[];
}

// Users types
export interface User {
  user_id: number;
  name: string;
  email?: string;
  is_disabled: boolean;
  created_at: string;
  updated_at: string;
  custom_start?: string;
  plan?: Plan;
}

export interface CreateUserRequest {
  name: string;
  email?: string;
  plan_id?: string;
  custom_start?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  is_disabled?: boolean;
  plan_id?: string;
  custom_start?: string;
}

export interface UserUsage {
  type: 'user';
  current_usage?: number;
  limit?: number;
  percentage_used?: number;
  user_name: string;
  plan_name?: string;
  period_start?: string;
  period_end?: string;
  is_unlimited?: boolean;
}

// Request validation types
export interface ValidateRequestRequest {
  api_key: string;
  endpoint: string;
  method: string;
}

export interface ValidateRequestResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: {
    current_usage: number;
    limit: number;
    plan_name: string;
    period_start: string;
    period_end: string;
  };
}

// Next.js specific types
export interface NextJsConfig extends LimitlyConfig {
  // Additional Next.js specific configuration
  cache?: boolean;
  revalidate?: number;
}

// Client configuration types
export interface LimitlyConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

// Error types
export class LimitlyError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'LimitlyError';
  }
}

// Request options types
export interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
  cache?: boolean;
  revalidate?: number;
}

// Next.js middleware types
export interface NextJsMiddlewareOptions {
  apiKeyHeader?: string;
  onRateLimitExceeded?: (req: any, res: any) => void;
  onValidationError?: (req: any, res: any, error: any) => void;
}

// Server-side rendering types
export interface SSRConfig {
  cache?: boolean;
  revalidate?: number;
  tags?: string[];
} 