import { Module, Global } from '@nestjs/common';
import { CACHE_PORT } from './ports/cache.port.js';
import type { CachePort } from './ports/cache.port.js';
import { InMemoryCacheAdapter } from './adapters/in-memory-cache.adapter.js';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_PORT,
      useClass: InMemoryCacheAdapter,
    },
  ],
  exports: [CACHE_PORT],
})
export class SharedModule {}
