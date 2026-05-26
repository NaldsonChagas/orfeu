import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AlbumSearchUseCase } from './use-cases/album-search.use-case.js';
import type { SearchAlbumDto } from './ports/search-album.dto.js';

@ApiTags('Albums')
@Controller('api/v1/albums')
export class AlbumsController {
  constructor(private readonly albumSearchUseCase: AlbumSearchUseCase) {}

  @Get('search')
  @ApiOperation({
    summary: 'Search albums',
    description:
      'Search for albums on Last.fm by name or artist. Returns enriched albums with tags.',
  })
  @ApiQuery({
    name: 'q',
    description: 'Search query',
    example: 'Radiohead',
    required: true,
    type: String,
  })
  async search(@Query() query: SearchAlbumDto) {
    return this.albumSearchUseCase.execute(query.q);
  }
}
