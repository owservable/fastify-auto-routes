![owservable](https://avatars0.githubusercontent.com/u/87773159?s=75)

# @owservable/fastify-auto-routes

Automatically register Fastify routes from your file system structure. This library scans your routes directory and automatically registers all route files with your Fastify instance, supporting both TypeScript and JavaScript files.

## 🚀 Features

- **Automatic Route Discovery**: Scans directories recursively for route files
- **TypeScript & JavaScript Support**: Works with both `.ts` and `.js` files
- **Flexible Route Structure**: Supports single routes and array of routes per file
- **Route Mapping**: Built-in routes map for debugging and documentation
- **Action Integration**: Seamlessly integrates with `@owservable/actions`
- **Verbose Logging**: Optional detailed logging for debugging
- **Path Cleaning**: Automatic URL path generation from file structure

## 📦 Installation

```bash
npm install @owservable/fastify-auto-routes
```

or

```bash
yarn add @owservable/fastify-auto-routes
```

or

```bash
pnpm add @owservable/fastify-auto-routes
```

## 🔧 Usage

### Basic Setup

```typescript
import fastify from 'fastify';
import { addFastifyRoutes } from '@owservable/fastify-auto-routes';

const server = fastify();

// Add all routes from the routes directory
addFastifyRoutes(server, './routes');

// Start the server
server.listen({ port: 3000 });
```

### With Verbose Logging

```typescript
import fastify from 'fastify';
import { addFastifyRoutes } from '@owservable/fastify-auto-routes';

const server = fastify();

// Add routes with verbose logging enabled
addFastifyRoutes(server, './routes', true);

server.listen({ port: 3000 });
```

### Route File Examples

#### Single Route File (`routes/users.ts`)

```typescript
export default {
  method: 'GET',
  url: '/users',
  handler: async (request, reply) => {
    return { users: [] };
  }
};
```

#### Multiple Routes File (`routes/posts.ts`)

```typescript
export default [
  {
    method: 'GET',
    url: '/posts',
    handler: async (request, reply) => {
      return { posts: [] };
    }
  },
  {
    method: 'POST',
    url: '/posts',
    handler: async (request, reply) => {
      return { message: 'Post created' };
    }
  }
];
```

#### With Schema and Tags (`routes/api/v1/products.ts`)

```typescript
export default {
  method: 'GET',
  url: '/api/v1/products',
  schema: {
    tags: ['products'],
    summary: 'Get all products',
    response: {
      200: {
        type: 'object',
        properties: {
          products: { type: 'array' }
        }
      }
    }
  },
  handler: async (request, reply) => {
    return { products: [] };
  }
};
```

### Using with Action Routes

```typescript
import { addActionRoutes } from '@owservable/fastify-auto-routes';

// Add action-based routes
addActionRoutes(server, './actions');
```

### Route Mapping and Debugging

```typescript
import { RoutesMap } from '@owservable/fastify-auto-routes';

// Get all registered routes
const allRoutes = RoutesMap.list();
console.log(allRoutes);

// Get routes for specific method
const getRoutes = RoutesMap.getRoutes('GET');
console.log(getRoutes);

// Get all methods
const methods = RoutesMap.getMethods();
console.log(methods);
```

## 📁 File Structure Conventions

The library follows these conventions:

```
routes/
├── index.ts          → /
├── users.ts          → /users
├── posts.ts          → /posts
├── api/
│   ├── v1/
│   │   ├── users.ts  → /api/v1/users
│   │   └── posts.ts  → /api/v1/posts
│   └── v2/
│       └── users.ts  → /api/v2/users
└── admin/
    └── dashboard.ts  → /admin/dashboard
```

## 🔧 Configuration Options

### Route Object Properties

```typescript
interface RouteOptions {
  method: string | string[];        // HTTP method(s)
  url: string;                      // Route URL
  handler: Function;                // Route handler function
  schema?: object;                  // JSON schema for validation
  preHandler?: Function | Function[]; // Pre-handler hooks
  onRequest?: Function | Function[];  // Request hooks
  // ... other Fastify route options
}
```

### Auto-Generated Properties

The library automatically adds/fixes these properties:

- **URL**: Generated from file path if not provided
- **Method**: Defaults to 'GET' if not specified
- **Schema**: Enhanced with auto-generated tags
- **Tags**: Generated from file path for documentation

## 📚 API Documentation

### `addFastifyRoutes(fastify, folder, verbose?)`

Recursively scans and registers all route files in the specified folder.

**Parameters:**
- `fastify`: Fastify instance
- `folder`: Path to routes directory
- `verbose`: Optional boolean for detailed logging (default: false)

### `addActionRoutes(fastify, folder, verbose?)`

Registers action-based routes from the specified folder.

**Parameters:**
- `fastify`: Fastify instance
- `folder`: Path to actions directory
- `verbose`: Optional boolean for detailed logging (default: false)

### `RoutesMap`

Static class for managing registered routes.

**Methods:**
- `add(method, route)`: Add a route to the map
- `getMethods()`: Get all HTTP methods
- `getRoutes(method)`: Get routes for specific method
- `list()`: Get all routes organized by method
- `json()`: Get routes in JSON format
- `clear()`: Clear all routes
- `keys()`: Get all method keys
- `values()`: Get all route arrays

### `cleanRelativePath(rootFolder, absolutePath, extension)`

Utility function to generate clean URLs from file paths.

**Parameters:**
- `rootFolder`: Root directory path
- `absolutePath`: Absolute file path
- `extension`: File extension to remove

**Returns:** Clean relative path suitable for URL

## 🏗️ Requirements

- Node.js >= 20
- Fastify >= 4.x
- TypeScript support (optional)

## 🧪 Testing

```bash
npm test
```

## 📖 Documentation

- **TypeDoc Documentation**: [https://owservable.github.io/fastify-auto-routes/docs/](https://owservable.github.io/fastify-auto-routes/docs/)
- **Test Coverage**: [https://owservable.github.io/fastify-auto-routes/coverage/](https://owservable.github.io/fastify-auto-routes/coverage/)

## 🔗 Related Projects

- [@owservable/actions](https://github.com/owservable/actions) - Action pattern implementation
- [@owservable/folders](https://github.com/owservable/folders) - File system utilities
- [owservable](https://github.com/owservable/owservable) - Main reactive backend library

## 📄 License

Licensed under [The Unlicense](./LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
