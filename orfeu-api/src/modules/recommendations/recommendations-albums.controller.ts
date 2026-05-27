import { Controller, Get, Param, Sse, MessageEvent } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRecommendationsByAlbumUseCase } from './use-cases/get-recommendations-by-album.use-case.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('Recommendations')
@Controller('api/v1/albums')
export class RecommendationsAlbumsController {
  constructor(
    private readonly getRecommendationsByAlbumUseCase: GetRecommendationsByAlbumUseCase,
  ) {}

  @Get(':name/recommendations')
  @Sse()
  @ApiOperation({
    summary: 'Get album recommendations from a library album',
    description:
      'Returns album recommendations based on a album from the library, scored by cosine similarity of tag vectors.',
  })
  getRecommendationsFromAlbum(
    @Param('name') name: string,
  ): Observable<MessageEvent> {
    return this.getRecommendationsByAlbumUseCase
      .execute(name)
      .pipe(map((data) => ({ data })));
  }
}
