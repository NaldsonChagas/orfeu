import { GetSimilarArtistsUseCase } from './get-similar-artists.use-case.js';
import type {
  SimilarArtistsPort,
  SimilarArtist,
} from '../ports/similar-artists.port.js';
import type { LibraryRepositoryPort } from '../../library/ports/library-repository.port.js';
import type { LibraryItem } from '../../library/domain/library-item.js';

describe('GetSimilarArtistsUseCase', () => {
  let useCase: GetSimilarArtistsUseCase;
  let similarArtists: jest.Mocked<SimilarArtistsPort>;
  let libraryRepository: jest.Mocked<LibraryRepositoryPort>;

  beforeEach(() => {
    similarArtists = {
      getSimilar: jest.fn(),
    };
    libraryRepository = {
      add: jest.fn(),
      remove: jest.fn(),
      getAll: jest.fn(),
      exists: jest.fn(),
    };

    useCase = new GetSimilarArtistsUseCase(similarArtists, libraryRepository);
  });

  it('should return similar artists excluding those in library', async () => {
    const similar: SimilarArtist[] = [
      { name: 'Thom Yorke', match: 0.9 },
      { name: 'Atoms for Peace', match: 0.85 },
      { name: 'Pink Floyd', match: 0.7 },
    ];

    const library: LibraryItem[] = [
      {
        id: '1',
        name: 'Dark Side',
        artist: 'Pink Floyd',
        imageUrl: '',
        tags: [],
      },
      {
        id: '2',
        name: 'OK Computer',
        artist: 'Radiohead',
        imageUrl: '',
        tags: [],
      },
    ];

    similarArtists.getSimilar.mockResolvedValue(similar);
    libraryRepository.getAll.mockResolvedValue(library);

    const result = await useCase.execute('Radiohead');

    expect(result).toEqual([
      { name: 'Thom Yorke', match: 0.9 },
      { name: 'Atoms for Peace', match: 0.85 },
    ]);
  });

  it('should return all similar artists when library is empty', async () => {
    const similar: SimilarArtist[] = [{ name: 'Thom Yorke', match: 0.9 }];

    similarArtists.getSimilar.mockResolvedValue(similar);
    libraryRepository.getAll.mockResolvedValue([]);

    const result = await useCase.execute('Radiohead');

    expect(result).toEqual(similar);
  });

  it('should return empty array when no similar artists found', async () => {
    similarArtists.getSimilar.mockResolvedValue([]);
    libraryRepository.getAll.mockResolvedValue([]);

    const result = await useCase.execute('Unknown');

    expect(result).toEqual([]);
  });

  it('should perform case-insensitive library comparison', async () => {
    const similar: SimilarArtist[] = [
      { name: 'pink floyd', match: 0.9 },
      { name: 'Thom Yorke', match: 0.8 },
    ];

    const library: LibraryItem[] = [
      { id: '1', name: 'Album', artist: 'Pink Floyd', imageUrl: '', tags: [] },
    ];

    similarArtists.getSimilar.mockResolvedValue(similar);
    libraryRepository.getAll.mockResolvedValue(library);

    const result = await useCase.execute('Radiohead');

    expect(result).toEqual([{ name: 'Thom Yorke', match: 0.8 }]);
  });
});
