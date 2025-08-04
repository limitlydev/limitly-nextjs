# @limitly/limitly-nextjs

Official Next.js SDK for [Limitly](https://www.limitly.dev) - API Key management, plans, users and request validation optimized for server-side rendering.

## 🚀 Installation

```bash
npm install @limitly/limitly-nextjs
```

```bash
pnpm add @limitly/limitly-nextjs
```

```bash
yarn add @limitly/limitly-nextjs
```

## 📖 Basic Usage

### Initialization

```typescript
import { Limitly } from '@limitly/limitly-nextjs';

const limitly = new Limitly({
  apiKey: 'your_limitly_api_key'
});
```

### Request Validation in Next.js API Routes

The most common use case is validating your users' requests in Next.js API routes:

```typescript
// app/api/users/route.ts
import { Limitly } from '@limitly/limitly-nextjs';

const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY!
});

export async function GET(request: Request) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!apiKey) {
    return Response.json({ error: 'API Key required' }, { status: 401 });
  }

  const result = await limitly.validation.validate(
    apiKey,
    '/api/users',
    'GET'
  );

  if (!result.success) {
    return Response.json({
      error: 'Rate limit exceeded',
      details: result.details
    }, { status: 429 });
  }

  // Your API logic here
  return Response.json({ message: 'Request allowed' });
}
```

### Using the withRateLimit Wrapper

For cleaner code, use the built-in rate limiting wrapper:

```typescript
// app/api/users/route.ts
import { Limitly } from '@limitly/limitly-nextjs';

const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY!
});

const apiHandler = async (request: Request) => {
  // Your API logic here
  return Response.json({ 
    message: 'Success',
    data: { users: [] }
  });
};

// Wrap your handler with rate limiting
export const GET = limitly.withRateLimit(apiHandler);
export const POST = limitly.withRateLimit(apiHandler);
```

### Middleware for Express-style APIs

If you're using Express-style middleware:

```typescript
// pages/api/users.ts (Pages Router)
import { Limitly } from '@limitly/limitly-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY!
});

const rateLimitMiddleware = limitly.createMiddleware({
  onRateLimitExceeded: (req, res) => {
    res.status(429).json({ error: 'Custom rate limit message' });
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply rate limiting middleware
  await rateLimitMiddleware(req, res, () => {
    // Your API logic here
    res.json({ message: 'Success' });
  });
}
```

## 🔧 Configuration

### Configuration Options

```typescript
const limitly = new Limitly({
  apiKey: 'your_limitly_api_key',
  baseUrl: 'https://xfkyofkqbukqtxcuapvf.supabase.co/functions/v1', // optional
  timeout: 30000 // optional, default: 30000ms
});
```

### Next.js Specific Configuration

```typescript
const limitly = new Limitly({
  apiKey: 'your_limitly_api_key',
  cache: true, // Enable Next.js caching
  revalidate: 3600 // Cache for 1 hour
});
```

### Request Options with Caching

```typescript
// Get data with caching for SSR
const plans = await limitly.plans.list({
  cache: true,
  revalidate: 3600, // Cache for 1 hour
  timeout: 10000
});

// Get real-time data without caching
const usage = await limitly.apiKeys.getUsage('key-id', {
  cache: false
});
```

## 📚 Complete API

### Request Validation

#### `validation.validate(apiKey, endpoint, method, options?)`
Validates a user request.

```typescript
const result = await limitly.validation.validate(
  'user_api_key',
  '/api/users',
  'GET'
);
```

#### `validation.validateWithContext(apiKey, endpoint, method, context?, options?)`
Validates a request with additional context for Next.js.

```typescript
const result = await limitly.validation.validateWithContext(
  'user_api_key',
  '/api/users',
  'GET',
  { userId: 123, sessionId: 'abc123' }
);
```

### API Keys

#### `apiKeys.list(options?)`
Lists all API Keys.

#### `apiKeys.listWithUsage(options?)`
Lists API Keys with usage statistics (Next.js optimized).

#### `apiKeys.create(data, options?)`
Creates a new API Key.

```typescript
const key = await limitly.apiKeys.create({
  name: 'New API Key',
  user_id: 123, // optional
  plan_id: 'plan-id', // optional
  status: 'active' // optional
});
```

#### `apiKeys.get(keyId, options?)`
Gets a specific API Key.

#### `apiKeys.update(keyId, data, options?)`
Updates an API Key.

#### `apiKeys.delete(keyId, options?)`
Deletes an API Key (soft delete).

#### `apiKeys.regenerate(keyId, options?)`
Regenerates an API Key.

#### `apiKeys.getUsage(keyId, options?)`
Gets usage statistics for an API Key.

#### `apiKeys.getRequests(keyId, options?)`
Gets request history for an API Key.

### Plans

#### `plans.list(options?)`
Lists all plans.

#### `plans.listWithUsage(options?)`
Lists plans with usage statistics (Next.js optimized).

#### `plans.create(data, options?)`
Creates a new plan.

```typescript
const plan = await limitly.plans.create({
  name: 'Basic Plan',
  description: 'Plan for basic users',
  max_requests: 10000,
  request_period: 'month', // 'day', 'week', 'month', 'year'
  is_active: true
});
```

#### `plans.get(planId, options?)`
Gets a specific plan.

#### `plans.update(planId, data, options?)`
Updates a plan.

#### `plans.delete(planId, options?)`
Deletes a plan.

#### `plans.getUsage(planId, options?)`
Gets usage statistics for a plan.

#### `plans.getUsers(planId, options?)`
Gets all users assigned to a plan.

#### `plans.getKeys(planId, options?)`
Gets all API Keys assigned to a plan.

### Users

#### `users.list(options?)`
Lists all users.

#### `users.listWithUsage(options?)`
Lists users with usage statistics (Next.js optimized).

#### `users.create(data, options?)`
Creates a new user.

```typescript
const user = await limitly.users.create({
  name: 'John Doe',
  email: 'john@example.com', // optional
  plan_id: 'plan-id', // optional
  custom_start: '2024-01-01T00:00:00.000Z' // optional
});
```

#### `users.get(userId, options?)`
Gets a specific user.

#### `users.update(userId, data, options?)`
Updates a user.

#### `users.delete(userId, options?)`
Deletes a user.

#### `users.getUsage(userId, options?)`
Gets user usage.

#### `users.getKeys(userId, options?)`
Gets all API Keys for a user.

#### `users.createKey(userId, data, options?)`
Creates a new API Key for a user.

```typescript
const key = await limitly.users.createKey(123, {
  name: 'API Key for John'
});
```

## 🛠️ Error Handling

The SDK throws specific errors that you can catch:

```typescript
try {
  const result = await limitly.validation.validate(
    'invalid_api_key',
    '/api/users',
    'GET'
  );
} catch (error) {
  if (error instanceof LimitlyError) {
    console.log('Limitly error:', error.message);
    console.log('Status code:', error.statusCode);
    console.log('Full response:', error.response);
  } else {
    console.log('Unexpected error:', error);
  }
}
```

## 🔍 Advanced Examples

### Next.js App Router with Rate Limiting

```typescript
// app/api/users/route.ts
import { Limitly } from '@limitly/limitly-nextjs';

const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY!
});

export async function GET(request: Request) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!apiKey) {
    return Response.json({ error: 'API Key required' }, { status: 401 });
  }

  try {
    const result = await limitly.validation.validate(
      apiKey,
      '/api/users',
      'GET'
    );

    if (!result.success) {
      return Response.json({
        error: 'Rate limit exceeded',
        details: result.details
      }, { status: 429 });
    }

    // Your API logic here
    const users = await fetchUsers();
    
    return Response.json({ users });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Server-Side Rendering with Caching

```typescript
// app/dashboard/page.tsx
import { Limitly } from '@limitly/limitly-nextjs';

const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY!
});

export default async function DashboardPage() {
  // Get data with caching for SSR
  const [plans, keysWithUsage] = await Promise.all([
    limitly.plans.list({ cache: true, revalidate: 3600 }),
    limitly.apiKeys.listWithUsage({ cache: true, revalidate: 300 })
  ]);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Plans ({plans.data?.length || 0})</h2>
        {/* Render plans */}
      </div>
      <div>
        <h2>API Keys ({keysWithUsage.data?.length || 0})</h2>
        {/* Render API keys with usage */}
      </div>
    </div>
  );
}
```

### Custom Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Limitly } from '@limitly/limitly-nextjs';

const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY!
});

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API Key required' },
      { status: 401 }
    );
  }

  try {
    const result = await limitly.validation.validate(
      apiKey,
      request.nextUrl.pathname,
      request.method
    );

    if (!result.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json(
      { error: 'Validation error' },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};
```

### Usage Monitoring

```typescript
// app/api/monitor/route.ts
import { Limitly } from '@limitly/limitly-nextjs';

const limitly = new Limitly({
  apiKey: process.env.LIMITLY_API_KEY!
});

export async function GET() {
  try {
    const keys = await limitly.apiKeys.list();
    const alerts = [];
    
    for (const key of keys.data || []) {
      const usage = await limitly.apiKeys.getUsage(key.id);
      
      if (usage.data && usage.data.percentageUsed > 80) {
        alerts.push({
          keyId: key.id,
          keyName: key.name,
          usage: usage.data.percentageUsed
        });
      }
    }
    
    return Response.json({ alerts });
  } catch (error) {
    console.error('Monitoring error:', error);
    return Response.json({ error: 'Monitoring failed' }, { status: 500 });
  }
}
```

## 📦 Project Structure

```
src/
├── index.ts          # Main SDK class with Next.js optimizations
├── client.ts         # HTTP client with caching support
├── types/            # TypeScript type definitions
│   └── index.ts
└── modules/          # Specific modules
    ├── api-keys.ts
    ├── plans.ts
    ├── users.ts
    └── validation.ts
```

## 🔄 Differences from @limitly/limitly-js

This Next.js SDK includes several optimizations for server-side rendering:

1. **Caching Support**: Built-in support for Next.js caching with `cache` and `revalidate` options
2. **Middleware Integration**: `createMiddleware()` and `withRateLimit()` for easy integration
3. **SSR Optimized Methods**: `listWithUsage()` methods for efficient data fetching
4. **Next.js Types**: Additional TypeScript types for Next.js specific features
5. **App Router Support**: Optimized for Next.js 13+ App Router
6. **Server-Side Focus**: Designed for server-side usage in Next.js applications

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

- 📧 Email: hi@limitly.dev
- 💻 Limitly: https://www.limitly.dev
- 📖 Documentation: https://docs.limitly.com
- 🐛 Issues: https://github.com/limitlydev/limitly-nextjs/issues 