import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRecommendationsByAlbumUseCase } from './use-cases/get-recommendations-by-album.use-case.js';

@ApiTags('Recommendations')
@Controller('api/v1/albums')
export class RecommendationsAlbumsController {
  constructor(
    private readonly getRecommendationsByAlbumUseCase: GetRecommendationsByAlbumUseCase,
  ) {}

  @Get(':name/recommendations')
  @ApiOperation({
    summary: 'Get album recommendations from a library album',
    description:
      'Returns album recommendations based on a album from the library, scored by cosine similarity of tag vectors.',
  })
  async getRecommendationsFromAlbum(@Param('name') name: string) {
    return this.getRecommendationsByAlbumUseCase.execute(name);
  }
}
