import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetSimilarArtistsUseCase } from './use-cases/get-similar-artists.use-case.js';
import { GetRecommendationsUseCase } from './use-cases/get-recommendations.use-case.js';

@ApiTags('Recommendations')
@Controller('api/v1/artists')
export class RecommendationsController {
  constructor(
    private readonly getSimilarArtistsUseCase: GetSimilarArtistsUseCase,
    private readonly getRecommendationsUseCase: GetRecommendationsUseCase,
  ) {}

  @Get('similar/:name')
  @ApiOperation({
    summary: 'Get similar artists',
    description:
      'Returns artists similar to the given name from Last.fm, excluding artists already in the library.',
  })
  async getSimilar(@Param('name') name: string) {
    return this.getSimilarArtistsUseCase.execute(name);
  }

  @Get('recommendations/:name')
  @ApiOperation({
    summary: 'Get album recommendations',
    description:
      'Returns album recommendations scored by cosine similarity of tag vectors against the user library.',
  })
  async getRecommendations(@Param('name') name: string) {
    const similarArtists = await this.getSimilarArtistsUseCase.execute(name);
    return this.getRecommendationsUseCase.execute(similarArtists);
  }
}
