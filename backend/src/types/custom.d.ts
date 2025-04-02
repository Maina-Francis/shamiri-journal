// Custom type declarations for modules that might need additional type support
declare module 'express-async-handler' {
  import { RequestHandler } from 'express';
  function asyncHandler<T>(fn: (...args: Parameters<RequestHandler>) => Promise<T>): RequestHandler;
  export = asyncHandler;
}

// Add any other custom type declarations here if needed 