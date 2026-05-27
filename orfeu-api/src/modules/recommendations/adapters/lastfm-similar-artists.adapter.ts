import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import type {
  SimilarArtistsPort,
  SimilarArtist,
} from '../ports/similar-artists.port.js';
import { CACHE_PORT } from '../../../shared/ports/cache.port.js';
import type { CachePort } from '../../../shared/ports/cache.port.js';

const SIMILAR_ARTISTS_TTL = 24 * 60 * 60 * 1000;

interface LastfmSimilarArtist {
  name: string;
  match: string;
}

interface LastfmSimilarArtistsResponse {
  similarartists?: {
    artist: LastfmSimilarArtist[];
  };
  error?: number;
  message?: string;
}

const CACHE_PREFIX = 'similar_artists:';

@Injectable()
export class LastFMSimilarArtistsAdapter implements SimilarArtistsPort {
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

  async getSimilar(artist: string): Promise<SimilarArtist[]> {
    const cacheKey = `${CACHE_PREFIX}${artist.toLowerCase()}`;

    const cached = this.cache.get<SimilarArtist[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const params = {
      method: 'artist.getSimilar',
      artist,
      api_key: this.apiKey,
      format: 'json',
    };

    const response = await lastValueFrom(
      this.httpService.get<LastfmSimilarArtistsResponse>(this.baseUrl, {
        params,
      }),
    );

    if (response.data.error) {
      return [];
    }

    const artists = (response.data.similarartists?.artist ?? []).map((a) => ({
      name: a.name,
      match: Number.parseFloat(a.match),
    }));

    this.cache.set(cacheKey, artists, SIMILAR_ARTISTS_TTL);

    return artists;
  }
}
