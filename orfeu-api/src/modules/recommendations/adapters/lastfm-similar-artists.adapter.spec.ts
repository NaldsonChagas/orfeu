import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { LastFMSimilarArtistsAdapter } from './lastfm-similar-artists.adapter.js';
import { CACHE_PORT } from '../../../shared/ports/cache.port.js';
import type { CachePort } from '../../../shared/ports/cache.port.js';
import type { SimilarArtist } from '../ports/similar-artists.port.js';
import type { AxiosResponse } from 'axios';

function mockAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} } as any,
  };
}

describe('LastFMSimilarArtistsAdapter', () => {
  let adapter: LastFMSimilarArtistsAdapter;
  let httpService: jest.Mocked<HttpService>;
  let cacheService: jest.Mocked<CachePort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LastFMSimilarArtistsAdapter,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-api-key'),
          },
        },
        {
          provide: CACHE_PORT,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    adapter = module.get<LastFMSimilarArtistsAdapter>(
      LastFMSimilarArtistsAdapter,
    );
    httpService = module.get(HttpService);
    cacheService = module.get(CACHE_PORT);
  });

  describe('getSimilar', () => {
    const cacheKey = 'similar_artists:radiohead';

    it('should return cached results when available', async () => {
      const cachedArtists: SimilarArtist[] = [
        { name: 'Thom Yorke', match: 0.9 },
      ];
      cacheService.get.mockReturnValue(cachedArtists);

      const result = await adapter.getSimilar('Radiohead');

      expect(result).toEqual(cachedArtists);
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('should fetch from Last.fm and cache when cache is empty', async () => {
      cacheService.get.mockReturnValue(null);

      const mockResponse = mockAxiosResponse({
        similarartists: {
          artist: [
            { name: 'Thom Yorke', match: '0.9' },
            { name: 'Atoms for Peace', match: '0.85' },
          ],
        },
      });

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getSimilar('Radiohead');

      expect(result).toEqual([
        { name: 'Thom Yorke', match: 0.9 },
        { name: 'Atoms for Peace', match: 0.85 },
      ]);
      expect(cacheService.set).toHaveBeenCalledWith(
        cacheKey,
        result,
        24 * 60 * 60 * 1000,
      );
    });

    it('should return empty array when Last.fm returns error', async () => {
      cacheService.get.mockReturnValue(null);

      const mockResponse = mockAxiosResponse({
        error: 6,
        message: 'Artist not found',
      });

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getSimilar('Nonexistent');

      expect(result).toEqual([]);
    });

    it('should return empty array when similarartists is empty', async () => {
      cacheService.get.mockReturnValue(null);

      const mockResponse = mockAxiosResponse({
        similarartists: {
          artist: [],
        },
      });

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getSimilar('ObscureArtist');

      expect(result).toEqual([]);
    });

    it('should use lowercased artist name as cache key', async () => {
      cacheService.get.mockReturnValue(null);

      const mockResponse = mockAxiosResponse({
        similarartists: {
          artist: [{ name: 'Thom Yorke', match: '0.9' }],
        },
      });
      httpService.get.mockReturnValue(of(mockResponse));

      await adapter.getSimilar('Radiohead');

      expect(cacheService.get).toHaveBeenCalledWith(
        'similar_artists:radiohead',
      );
    });
  });
});
