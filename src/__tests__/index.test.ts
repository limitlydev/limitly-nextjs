import { Limitly } from '../index';
import { HttpClient } from '../client';
import { ValidationModule } from '../modules/validation';
import { ApiKeysModule } from '../modules/api-keys';
import { PlansModule } from '../modules/plans';
import { UsersModule } from '../modules/users';

// Mock axios
jest.mock('axios');
const mockAxios = require('axios');

describe('Limitly SDK', () => {
  let limitly: Limitly;

  beforeEach(() => {
    limitly = new Limitly({
      apiKey: 'test_api_key'
    });
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create a Limitly instance with all modules', () => {
      expect(limitly).toBeInstanceOf(Limitly);
      expect(limitly.apiKeys).toBeInstanceOf(ApiKeysModule);
      expect(limitly.plans).toBeInstanceOf(PlansModule);
      expect(limitly.users).toBeInstanceOf(UsersModule);
      expect(limitly.validation).toBeInstanceOf(ValidationModule);
    });

    it('should get the internal client', () => {
      const client = limitly.getClient();
      expect(client).toBeInstanceOf(HttpClient);
    });
  });

  describe('Validation', () => {
    it('should validate a request successfully', async () => {
      const mockResponse = {
        success: true,
        details: {
          current_usage: 5,
          limit: 100,
          plan_name: 'Basic Plan',
          period_start: '2024-01-01T00:00:00.000Z',
          period_end: '2024-01-31T23:59:59.999Z'
        }
      };

      mockAxios.mockResolvedValueOnce({ data: mockResponse });

      const result = await limitly.validation.validate(
        'user_api_key',
        '/api/users',
        'GET'
      );

      expect(result).toEqual(mockResponse);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.stringContaining('/validate'),
        expect.objectContaining({
          method: 'POST',
          data: {
            api_key: 'user_api_key',
            endpoint: '/api/users',
            method: 'GET'
          }
        })
      );
    });

    it('should validate a request with context', async () => {
      const mockResponse = {
        success: true,
        details: {
          current_usage: 5,
          limit: 100
        }
      };

      mockAxios.mockResolvedValueOnce({ data: mockResponse });

      const result = await limitly.validation.validateWithContext(
        'user_api_key',
        '/api/users',
        'GET',
        { userId: 123, sessionId: 'abc123' }
      );

      expect(result).toEqual(mockResponse);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.stringContaining('/validate'),
        expect.objectContaining({
          method: 'POST',
          data: {
            api_key: 'user_api_key',
            endpoint: '/api/users',
            method: 'GET',
            context: { userId: 123, sessionId: 'abc123' }
          }
        })
      );
    });
  });

  describe('API Keys', () => {
    it('should list API keys', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 'key1',
            name: 'Test Key 1',
            status: 'active'
          }
        ]
      };

      mockAxios.mockResolvedValueOnce({ data: mockResponse });

      const result = await limitly.apiKeys.list();

      expect(result).toEqual(mockResponse);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.stringContaining('/keys'),
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should create an API key', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'new_key',
          name: 'New API Key',
          api_key: 'new_api_key_string',
          status: 'active'
        }
      };

      mockAxios.mockResolvedValueOnce({ data: mockResponse });

      const result = await limitly.apiKeys.create({
        name: 'New API Key',
        user_id: 123
      });

      expect(result).toEqual(mockResponse);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.stringContaining('/keys'),
        expect.objectContaining({
          method: 'POST',
          data: {
            name: 'New API Key',
            user_id: 123
          }
        })
      );
    });
  });

  describe('Plans', () => {
    it('should list plans', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 'plan1',
            name: 'Basic Plan',
            max_requests: 1000,
            request_period: 'month'
          }
        ]
      };

      mockAxios.mockResolvedValueOnce({ data: mockResponse });

      const result = await limitly.plans.list();

      expect(result).toEqual(mockResponse);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.stringContaining('/plans'),
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('Users', () => {
    it('should list users', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            user_id: 1,
            name: 'John Doe',
            email: 'john@example.com'
          }
        ]
      };

      mockAxios.mockResolvedValueOnce({ data: mockResponse });

      const result = await limitly.users.list();

      expect(result).toEqual(mockResponse);
      expect(mockAxios).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError: any = new Error('Network error');
      networkError.request = {};
      
      mockAxios.mockRejectedValueOnce(networkError);

      await expect(
        limitly.validation.validate('invalid_key', '/api/test', 'GET')
      ).rejects.toThrow('Network error: Network error');
    });

    it('should handle server errors', async () => {
      const serverError = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: { error: 'Invalid API key' }
        }
      };
      
      mockAxios.mockRejectedValueOnce(serverError);

      await expect(
        limitly.validation.validate('invalid_key', '/api/test', 'GET')
      ).rejects.toThrow('Invalid API key');
    });
  });
}); 