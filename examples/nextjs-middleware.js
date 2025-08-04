const { Limitly } = require('../dist/index.js');

// Initialize the SDK
const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY || 'your_limitly_api_key'
});

// Example 1: Basic API Route with Rate Limiting
async function exampleApiRoute() {
  console.log('Example 1: Basic API Route with Rate Limiting');
  
  // Simulate a Next.js API route
  const mockRequest = {
    headers: {
      authorization: 'Bearer user_api_key_here'
    },
    url: 'http://localhost:3000/api/users',
    method: 'GET'
  };

  const mockResponse = {
    status: (code) => ({
      json: (data) => {
        console.log(`Response ${code}:`, data);
        return data;
      }
    })
  };

  // Use the middleware
  const middleware = limitly.createMiddleware({
    onRateLimitExceeded: (req, res) => {
      console.log('Rate limit exceeded for:', req.url);
      res.status(429).json({ error: 'Custom rate limit message' });
    },
    onValidationError: (req, res, error) => {
      console.log('Validation error:', error.message);
      res.status(500).json({ error: 'Custom validation error' });
    }
  });

  await middleware(mockRequest, mockResponse);
}

// Example 2: Using withRateLimit wrapper
async function exampleWithRateLimit() {
  console.log('\nExample 2: Using withRateLimit wrapper');
  
  // Define your API route handler
  const apiHandler = async (request) => {
    // Your API logic here
    return Response.json({ message: 'API response', data: 'some data' });
  };

  // Wrap with rate limiting
  const rateLimitedHandler = limitly.withRateLimit(apiHandler, {
    onRateLimitExceeded: (request) => {
      return Response.json({ 
        error: 'Custom rate limit exceeded message' 
      }, { status: 429 });
    }
  });

  // Simulate calling the wrapped handler
  const mockRequest = new Request('http://localhost:3000/api/users', {
    headers: {
      authorization: 'Bearer user_api_key_here'
    }
  });

  try {
    const response = await rateLimitedHandler(mockRequest);
    console.log('Handler response status:', response.status);
  } catch (error) {
    console.error('Handler error:', error);
  }
}

// Example 3: Server-side rendering with caching
async function exampleSSR() {
  console.log('\nExample 3: Server-side rendering with caching');
  
  try {
    // Get plans with caching for SSR
    const plans = await limitly.plans.list({
      cache: true,
      revalidate: 3600 // Cache for 1 hour
    });
    
    console.log('Plans loaded (cached):', plans.data?.length || 0);
    
    // Get API keys with usage for dashboard
    const keysWithUsage = await limitly.apiKeys.listWithUsage({
      cache: true,
      revalidate: 300 // Cache for 5 minutes
    });
    
    console.log('API Keys with usage (cached):', keysWithUsage.data?.length || 0);
    
  } catch (error) {
    console.error('SSR error:', error.message);
  }
}

async function main() {
  await exampleApiRoute();
  await exampleWithRateLimit();
  await exampleSSR();
}

main(); 