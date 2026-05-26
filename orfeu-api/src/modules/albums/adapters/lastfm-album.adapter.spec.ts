import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { LastfmAlbumAdapter } from './lastfm-album.adapter.js';
import { Album } from '../domain/album.js';

describe('LastfmAlbumAdapter', () => {
  let adapter: LastfmAlbumAdapter;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LastfmAlbumAdapter,
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
      ],
    }).compile();

    adapter = module.get<LastfmAlbumAdapter>(LastfmAlbumAdapter);
    httpService = module.get(HttpService);
  });

  describe('search', () => {
    it('should return mapped albums from Last.fm response', async () => {
      const mockResponse = {
        data: {
          results: {
            albummatches: {
              album: [
                {
                  name: 'OK Computer',
                  artist: 'Radiohead',
                  mbid: 'mbid-123',
                  image: [
                    { '#text': 'small.jpg', size: 'small' },
                    { '#text': 'large.jpg', size: 'large' },
                  ],
                },
                {
                  name: 'In Rainbows',
                  artist: 'Radiohead',
                  mbid: '',
                  image: [{ '#text': 'large.jpg', size: 'large' }],
                },
              ],
            },
          },
        },
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.search('radiohead');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual<Album>({
        id: 'mbid-123',
        name: 'OK Computer',
        artist: 'Radiohead',
        imageUrl: 'large.jpg',
        tags: [],
      });
      expect(result[1]).toEqual<Album>({
        id: 'Radiohead::In Rainbows',
        name: 'In Rainbows',
        artist: 'Radiohead',
        imageUrl: 'large.jpg',
        tags: [],
      });
    });

    it('should return empty array when Last.fm returns error 6', async () => {
      const mockResponse = {
        data: {
          error: 6,
          message: 'Album not found',
        },
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.search('nonexistent');

      expect(result).toEqual([]);
    });

    it('should return empty array when no albums match', async () => {
      const mockResponse = {
        data: {
          results: {
            albummatches: {
              album: [],
            },
          },
        },
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.search('zzzznonexistent');

      expect(result).toEqual([]);
    });

    it('should handle missing image gracefully', async () => {
      const mockResponse = {
        data: {
          results: {
            albummatches: {
              album: [
                {
                  name: 'Test Album',
                  artist: 'Test Artist',
                  mbid: 'mbid-456',
                  image: [],
                },
              ],
            },
          },
        },
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.search('test');

      expect(result[0].imageUrl).toBe('');
    });

    it('should use fallback ID when mbid is missing', async () => {
      const mockResponse = {
        data: {
          results: {
            albummatches: {
              album: [
                {
                  name: 'Test Album',
                  artist: 'Test Artist',
                  mbid: '',
                  image: [{ '#text': 'img.jpg', size: 'large' }],
                },
              ],
            },
          },
        },
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.search('test');

      expect(result[0].id).toBe('Test Artist::Test Album');
    });
  });

  describe('getTopTags', () => {
    it('should return tag names from Last.fm response', async () => {
      const mockResponse = {
        data: {
          toptags: {
            tag: [
              { name: 'alternative', count: 100 },
              { name: 'rock', count: 50 },
              { name: 'indie', count: 75 },
            ],
          },
        },
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getTopTags('Radiohead', 'OK Computer');

      expect(result).toEqual(['alternative', 'rock', 'indie']);
    });

    it('should return empty array when tags are not found', async () => {
      const mockResponse = {
        data: {
          error: 6,
          message: 'Album not found',
        },
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getTopTags('Unknown', 'Unknown');

      expect(result).toEqual([]);
    });

    it('should return empty array when toptags is empty', async () => {
      const mockResponse = {
        data: {
          toptags: {
            tag: [],
          },
        },
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await adapter.getTopTags('Test', 'Test');

      expect(result).toEqual([]);
    });
  });
});
