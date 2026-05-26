import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Album } from '../domain/album.js';
import { AlbumSearchPort } from '../ports/album-search.port.js';
import { AlbumTagsPort } from '../ports/album-tags.port.js';

interface LastfmImage {
  '#text': string;
  size: string;
}

interface LastfmAlbumResult {
  name: string;
  artist: string;
  mbid: string;
  image: LastfmImage[];
}

interface LastfmSearchResponse {
  results?: {
    albummatches?: {
      album: LastfmAlbumResult[];
    };
  };
  error?: number;
  message?: string;
}

interface LastfmTag {
  name: string;
  count: number;
}

interface LastfmTagsResponse {
  toptags?: {
    tag: LastfmTag[];
  };
  error?: number;
  message?: string;
}

@Injectable()
export class LastfmAlbumAdapter implements AlbumSearchPort, AlbumTagsPort {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('LASTFM_API_KEY')!;
    this.baseUrl = this.configService.get<string>('LASTFM_BASE_URL')!;
  }

  async search(query: string): Promise<Album[]> {
    const params = {
      method: 'album.search',
      album: query,
      api_key: this.apiKey,
      format: 'json',
      limit: '10',
    };

    const response = await lastValueFrom(
      this.httpService.get<LastfmSearchResponse>(this.baseUrl, { params }),
    );

    if (response.data.error === 6) {
      return [];
    }

    const albums = response.data.results?.albummatches?.album ?? [];

    return albums.map((result) => ({
      id: result.mbid || `${result.artist}::${result.name}`,
      name: result.name,
      artist: result.artist,
      imageUrl: result.image?.find((i) => i.size === 'large')?.['#text'] ?? '',
      tags: [] as string[],
    }));
  }

  async getTopTags(artist: string, album: string): Promise<string[]> {
    const params = {
      method: 'album.getTopTags',
      artist,
      album,
      api_key: this.apiKey,
      format: 'json',
    };

    const response = await lastValueFrom(
      this.httpService.get<LastfmTagsResponse>(this.baseUrl, { params }),
    );

    if (response.data.error) {
      return [];
    }

    return (response.data.toptags?.tag ?? []).map((tag) => tag.name);
  }
}
