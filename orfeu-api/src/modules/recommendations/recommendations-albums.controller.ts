import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRecommendationsUseCase } from './use-cases/get-recommendations.use-case.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('Recommendations')
@Controller('api/v1/albums')
export class RecommendationsAlbumsController {
  constructor(
    private readonly getRecommendationsUseCase: GetRecommendationsUseCase,
  ) {}

  @Get('recommendations')
  @Sse()
  @ApiOperation({
    summary: 'Get album recommendations based on the current library',
    description:
      'Returns album recommendations scored by cosine similarity of tag vectors against the library tag profile.',
  })
  getRecommendations(): Observable<MessageEvent> {
    return this.getRecommendationsUseCase
      .execute()
      .pipe(map((data) => ({ data })));
  }
}
