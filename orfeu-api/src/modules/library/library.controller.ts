import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { AddToLibraryUseCase } from './use-cases/add-to-library.use-case.js';
import { RemoveFromLibraryUseCase } from './use-cases/remove-from-library.use-case.js';
import { GetLibraryUseCase } from './use-cases/get-library.use-case.js';
import type { AddToLibraryDto } from './ports/add-to-library.dto.js';
import { addToLibrarySchema } from './ports/add-to-library.schema.js';
import { JoiValidationPipe } from './adapters/joi-validation.pipe.js';
import {
  ALBUM_ALREADY_EXISTS,
  ALBUM_NOT_FOUND,
  isAlbumError,
} from './errors/index.js';

@ApiTags('Library')
@Controller('api/v1/library')
export class LibraryController {
  constructor(
    private readonly addToLibraryUseCase: AddToLibraryUseCase,
    private readonly removeFromLibraryUseCase: RemoveFromLibraryUseCase,
    private readonly getLibraryUseCase: GetLibraryUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all albums in the library' })
  async getAll() {
    return this.getLibraryUseCase.execute();
  }

  @Post()
  @ApiOperation({ summary: 'Add an album to the library' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123' },
        name: { type: 'string', example: 'OK Computer' },
        artist: { type: 'string', example: 'Radiohead' },
        imageUrl: {
          type: 'string',
          example: 'https://lastfm.fm/album-art.jpg',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          example: ['rock', 'alternative'],
        },
      },
    },
  })
  async add(
    @Body(new JoiValidationPipe(addToLibrarySchema)) dto: AddToLibraryDto,
  ) {
    try {
      await this.addToLibraryUseCase.execute(dto);
    } catch (error) {
      if (isAlbumError(error, ALBUM_ALREADY_EXISTS)) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an album from the library' })
  async remove(@Param('id') id: string) {
    try {
      await this.removeFromLibraryUseCase.execute(id);
    } catch (error) {
      if (isAlbumError(error, ALBUM_NOT_FOUND)) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
