import { LibraryVectorService } from './library-vector-service.js';
import { TagVectorBuilder } from './tag-vector-builder.js';
import { CosineSimilarityCalculator } from './cosine-similarity-calculator.js';
import type { AlbumTagsPort } from '../../albums/ports/album-tags.port.js';
import type { LibraryItem } from '../../library/domain/library-item.js';
import type { CandidateAlbum } from '../ports/top-albums.port.js';

describe('LibraryVectorService', () => {
  let service: LibraryVectorService;
  let tagVectorBuilder: TagVectorBuilder;
  let cosineSimilarity: CosineSimilarityCalculator;

  beforeEach(() => {
    const albumTags: jest.Mocked<AlbumTagsPort> = { getTopTags: jest.fn() };
    tagVectorBuilder = new TagVectorBuilder(albumTags);
    cosineSimilarity = new CosineSimilarityCalculator();
    service = new LibraryVectorService(tagVectorBuilder, cosineSimilarity);
  });

  describe('calculateAverageVector', () => {
    it('should return empty object for empty array', () => {
      expect(service.calculateAverageVector([])).toEqual({});
    });

    it('should return the same vector for a single vector', () => {
      const result = service.calculateAverageVector([{ rock: 1, pop: 0.5 }]);
      expect(result).toEqual({ rock: 1, pop: 0.5 });
    });

    it('should calculate the average of multiple vectors', () => {
      const result = service.calculateAverageVector([
        { rock: 1, pop: 0.5 },
        { rock: 0.5, electronic: 1 },
      ]);
      expect(result).toEqual({ rock: 0.75, pop: 0.25, electronic: 0.5 });
    });

    it('should handle vectors with disjoint keys', () => {
      const result = service.calculateAverageVector([
        { rock: 1 },
        { electronic: 1 },
      ]);
      expect(result).toEqual({ rock: 0.5, electronic: 0.5 });
    });
  });

  describe('scoreCandidates', () => {
    it('should return empty array when no candidates', async () => {
      const result = await service.scoreCandidates(
        [{ id: '1', name: 'A', artist: 'B', imageUrl: '', tags: [] }],
        [],
      );
      expect(result).toEqual([]);
    });

    it('should return empty array when library is empty', async () => {
      const result = await service.scoreCandidates(
        [],
        [{ name: 'A', artist: 'B', imageUrl: '' }],
      );
      expect(result).toEqual([]);
    });

    it('should score candidates and sort descending', async () => {
      const albumTags: jest.Mocked<AlbumTagsPort> = {
        getTopTags: jest.fn(),
      };
      albumTags.getTopTags.mockResolvedValue(['rock', 'alternative']);

      const localBuilder = new TagVectorBuilder(albumTags);
      const localService = new LibraryVectorService(
        localBuilder,
        cosineSimilarity,
      );

      const library: LibraryItem[] = [
        {
          id: '1',
          name: 'Album A',
          artist: 'Artist A',
          imageUrl: '',
          tags: [],
        },
        {
          id: '2',
          name: 'Album B',
          artist: 'Artist B',
          imageUrl: '',
          tags: [],
        },
      ];

      const candidates: CandidateAlbum[] = [
        { name: 'Candidate Rock', artist: 'Artist C', imageUrl: '' },
        { name: 'Candidate Pop', artist: 'Artist D', imageUrl: '' },
      ];

      albumTags.getTopTags.mockResolvedValue(['rock', 'alternative']);
      const result = await localService.scoreCandidates(library, candidates);

      expect(result).toHaveLength(2);
      expect(result[0].score).toBeGreaterThanOrEqual(result[1].score);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('artist');
      expect(result[0]).toHaveProperty('imageUrl');
      expect(result[0]).toHaveProperty('score');
    });
  });
});
