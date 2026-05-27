import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import type {
  TopAlbumsPort,
  CandidateAlbum,
} from '../ports/top-albums.port.js';
import { CACHE_PORT } from '../../../shared/ports/cache.port.js';
import type { CachePort } from '../../../shared/ports/cache.port.js';
import { withRetry } from '../../../shared/utils/retry.js';

const TOP_ALBUMS_TTL = 12 * 60 * 60 * 1000;

interface LastfmImage {
  '#text': string;
  size: string;
}

interface LastfmTopAlbum {
  name: string;
  artist: { name: string };
  image: LastfmImage[];
}

interface LastfmTopAlbumsResponse {
  topalbums?: {
    album: LastfmTopAlbum[];
  };
  error?: number;
  message?: string;
}

const CACHE_PREFIX = 'top_albums:';

@Injectable()
export class LastFMTopAlbumsAdapter implements TopAlbumsPort {
  private readonly logger = new Logger(LastFMTopAlbumsAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_PORT) private readonly cache: CachePort,
  ) {
    this.apiKey = this.configService.get<string>('LASTFM_API_KEY')!;
    this.baseUrl = this.configService.get<string>('LASTFM_BASE_URL')!;
  }

  async getTopAlbums(artist: string): Promise<CandidateAlbum[]> {
    const cacheKey = `${CACHE_PREFIX}${artist.toLowerCase()}`;

    const cached = this.cache.get<CandidateAlbum[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const params = {
      method: 'artist.getTopAlbums',
      artist,
      api_key: this.apiKey,
      format: 'json',
      limit: '10',
    };

    const context = `top albums: ${artist}`;
    const response = await withRetry(
      () =>
        lastValueFrom(
          this.httpService.get<LastfmTopAlbumsResponse>(this.baseUrl, {
            params,
          }),
        ),
      { context },
    );

    if (!response) {
      return [];
    }

    if (response.data.error) {
      this.logger.warn(
        `Last.fm API error for ${context}: ${response.data.message}`,
      );
      return [];
    }

    const albums = (response.data.topalbums?.album ?? []).map((a) => ({
      name: a.name,
      artist: a.artist.name,
      imageUrl: a.image?.find((i) => i.size === 'large')?.['#text'] ?? '',
    }));

    this.cache.set(cacheKey, albums, TOP_ALBUMS_TTL);

    return albums;
  }
}
