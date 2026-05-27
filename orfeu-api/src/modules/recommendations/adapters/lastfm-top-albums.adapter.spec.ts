import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { LastFMTopAlbumsAdapter } from './lastfm-top-albums.adapter.js';
import { CACHE_PORT } from '../../../shared/ports/cache.port.js';
import type { CachePort } from '../../../shared/ports/cache.port.js';
import type { CandidateAlbum } from '../ports/top-albums.port.js';
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

describe('LastFMTopAlbumsAdapter', () => {
  let adapter: LastFMTopAlbumsAdapter;
  let httpService: jest.Mocked<HttpService>;
  let cacheService: jest.Mocked<CachePort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LastFMTopAlbumsAdapter,
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

    adapter = module.get<LastFMTopAlbumsAdapter>(LastFMTopAlbumsAdapter);
    httpService = module.get(HttpService);
    cacheService = module.get(CACHE_PORT);
  });

  describe('getTopAlbums', () => {
    const cacheKey = 'top_albums:radiohead';

    it('should return cached results when available', async () => {
      const cachedAlbums: CandidateAlbum[] = [
        {
          name: 'OK Computer',
          artist: 'Radiohead',
          imageUrl: 'http://img.com',
        },
      ];
      cacheService.get.mockReturnValue(cachedAlbums);

      const result = await adapter.getTopAlbums('Radiohead');

      expect(result).toEqual(cachedAlbums);
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('should fetch from Last.fm and cache when cache is empty', async () => {
      cacheService.get.mockReturnValue(null);

      const mockResponse = mockAxiosResponse({
        topalbums: {
          album: [
            {
              name: 'OK Computer',
              artist: { name: 'Radiohead' },
              image: [{ '#text': 'http://img.com', size: 'large' }],
            },
            {
              name: 'Kid A',
              artist: { name: 'Radiohead' },
              image: [],
            },
          ],
        },
      });

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getTopAlbums('Radiohead');

      expect(result).toEqual([
        {
          name: 'OK Computer',
          artist: 'Radiohead',
          imageUrl: 'http://img.com',
        },
        { name: 'Kid A', artist: 'Radiohead', imageUrl: '' },
      ]);
      expect(cacheService.set).toHaveBeenCalledWith(
        cacheKey,
        result,
        12 * 60 * 60 * 1000,
      );
    });

    it('should return empty array when Last.fm returns error', async () => {
      cacheService.get.mockReturnValue(null);

      const mockResponse = mockAxiosResponse({
        error: 6,
        message: 'Artist not found',
      });

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getTopAlbums('Nonexistent');

      expect(result).toEqual([]);
    });

    it('should return empty array when topalbums is empty', async () => {
      cacheService.get.mockReturnValue(null);

      const mockResponse = mockAxiosResponse({
        topalbums: {
          album: [],
        },
      });

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getTopAlbums('ObscureArtist');

      expect(result).toEqual([]);
    });

    it('should use lowercased artist name as cache key', async () => {
      cacheService.get.mockReturnValue(null);

      const mockResponse = mockAxiosResponse({
        topalbums: {
          album: [{ name: 'Album', artist: { name: 'Artist' }, image: [] }],
        },
      });
      httpService.get.mockReturnValue(of(mockResponse));

      await adapter.getTopAlbums('Radiohead');

      expect(cacheService.get).toHaveBeenCalledWith('top_albums:radiohead');
    });
  });
});
