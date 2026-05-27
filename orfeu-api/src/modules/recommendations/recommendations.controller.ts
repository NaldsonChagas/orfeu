import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetSimilarArtistsUseCase } from './use-cases/get-similar-artists.use-case.js';

@ApiTags('Recommendations')
@Controller('api/v1/artists')
export class RecommendationsController {
  constructor(
    private readonly getSimilarArtistsUseCase: GetSimilarArtistsUseCase,
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
}
