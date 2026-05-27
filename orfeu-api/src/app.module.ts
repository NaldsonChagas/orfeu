import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlbumsModule } from './modules/albums/albums.module.js';
import { LibraryModule } from './modules/library/library.module.js';
import { RecommendationsModule } from './modules/recommendations/recommendations.module.js';
import { SharedModule } from './shared/shared.module.js';
import { configValidationSchema } from './config.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    AlbumsModule,
    LibraryModule,
    RecommendationsModule,
    SharedModule,
  ],
})
export class AppModule {}
