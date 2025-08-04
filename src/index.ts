import { HttpClient } from './client';
import { ApiKeysModule } from './modules/api-keys';
import { PlansModule } from './modules/plans';
import { UsersModule } from './modules/users';
import { ValidationModule } from './modules/validation';
import { LimitlyConfig, NextJsConfig } from './types';

/**
 * Main Limitly SDK client for Next.js
 * Optimized for server-side rendering and Next.js applications
 * 
 * @example
 * ```typescript
 * import { Limitly } from '@limitly/limitly-nextjs';
 * 
 * const limitly = new Limitly({
 *   apiKey: 'your_limitly_api_key'
 * });
 * 
 * // Validate a request in a Next.js API route
 * export async function GET(request: Request) {
 *   const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
 *   
 *   if (!apiKey) {
 *     return Response.json({ error: 'API Key required' }, { status: 401 });
 *   }
 * 
 *   const result = await limitly.validation.validate(
 *     apiKey,
 *     '/api/users',
 *     'GET'
 *   );
 * 
 *   if (!result.success) {
 *     return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
 *   }
 * 
 *   return Response.json({ message: 'Request allowed' });
 * }
 * ```
 */
export class Limitly {
  public readonly apiKeys: ApiKeysModule;
  public readonly plans: PlansModule;
  public readonly users: UsersModule;
  public readonly validation: ValidationModule;

  private client: HttpClient;

  constructor(config: LimitlyConfig | NextJsConfig) {
    this.client = new HttpClient(config);
    
    this.apiKeys = new ApiKeysModule(this.client);
    this.plans = new PlansModule(this.client);
    this.users = new UsersModule(this.client);
    this.validation = new ValidationModule(this.client);
  }

  /**
   * Gets the internal HTTP client
   * Useful for debugging and testing
   */
  getClient(): HttpClient {
    return this.client;
  }

  /**
   * Creates a middleware function for Next.js API routes
   * @param options - Middleware configuration options
   * @returns Middleware function
   */
  createMiddleware(options?: {
    apiKeyHeader?: string;
    onRateLimitExceeded?: (req: any, res: any) => void;
    onValidationError?: (req: any, res: any, error: any) => void;
  }) {
    const apiKeyHeader = options?.apiKeyHeader || 'authorization';
    
    return async (req: any, res: any, next?: () => void) => {
      try {
        const apiKey = req.headers?.[apiKeyHeader]?.replace('Bearer ', '') ||
                      req.headers?.authorization?.replace('Bearer ', '');
        
        if (!apiKey) {
          if (options?.onValidationError) {
            options.onValidationError(req, res, new Error('API Key required'));
          }
          return res.status(401).json({ error: 'API Key required' });
        }

        const result = await this.validation.validate(
          apiKey,
          req.url || req.path,
          req.method
        );

        if (!result.success) {
          if (options?.onRateLimitExceeded) {
            options.onRateLimitExceeded(req, res);
          }
          return res.status(429).json({
            error: 'Rate limit exceeded',
            details: result.details
          });
        }

        if (next) {
          next();
        }
      } catch (error) {
        if (options?.onValidationError) {
          options.onValidationError(req, res, error);
        }
        return res.status(500).json({ error: 'Validation error' });
      }
    };
  }

  /**
   * Creates a Next.js API route handler with built-in rate limiting
   * @param handler - The API route handler function
   * @param options - Rate limiting options
   * @returns Wrapped API route handler
   */
  withRateLimit(
    handler: (request: Request, ...args: any[]) => Promise<Response>,
    options?: {
      apiKeyHeader?: string;
      onRateLimitExceeded?: (request: Request) => Response;
    }
  ) {
    const apiKeyHeader = options?.apiKeyHeader || 'authorization';
    
    return async (request: Request, ...args: any[]): Promise<Response> => {
      try {
        const apiKey = request.headers.get(apiKeyHeader)?.replace('Bearer ', '') ||
                      request.headers.get('authorization')?.replace('Bearer ', '');
        
        if (!apiKey) {
          return Response.json({ error: 'API Key required' }, { status: 401 });
        }

        const result = await this.validation.validate(
          apiKey,
          new URL(request.url).pathname,
          request.method
        );

        if (!result.success) {
          if (options?.onRateLimitExceeded) {
            return options.onRateLimitExceeded(request);
          }
          return Response.json({
            error: 'Rate limit exceeded',
            details: result.details
          }, { status: 429 });
        }

        return handler(request, ...args);
      } catch (error) {
        console.error('Rate limiting error:', error);
        return Response.json({ error: 'Validation error' }, { status: 500 });
      }
    };
  }
}

// Exportar tipos
export * from './types';

// Exportar clases individuales para uso avanzado
export { HttpClient } from './client';
export { ApiKeysModule } from './modules/api-keys';
export { PlansModule } from './modules/plans';
export { UsersModule } from './modules/users';
export { ValidationModule } from './modules/validation';

// Exportar la clase principal como default
export default Limitly; 