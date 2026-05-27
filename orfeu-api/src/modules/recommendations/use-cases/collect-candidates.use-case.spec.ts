import { CollectCandidatesUseCase } from './collect-candidates.use-case.js';
import type {
  TopAlbumsPort,
  CandidateAlbum,
} from '../ports/top-albums.port.js';
import type { LibraryRepositoryPort } from '../../library/ports/library-repository.port.js';
import type { LibraryItem } from '../../library/domain/library-item.js';

describe('CollectCandidatesUseCase', () => {
  let useCase: CollectCandidatesUseCase;
  let topAlbums: jest.Mocked<TopAlbumsPort>;
  let libraryRepository: jest.Mocked<LibraryRepositoryPort>;

  beforeEach(() => {
    topAlbums = {
      getTopAlbums: jest.fn(),
    };
    libraryRepository = {
      add: jest.fn(),
      remove: jest.fn(),
      getAll: jest.fn(),
      exists: jest.fn(),
    };

    useCase = new CollectCandidatesUseCase(topAlbums, libraryRepository);
  });

  it('should collect albums from similar artists excluding library albums', async () => {
    const artists = [{ name: 'Thom Yorke' }, { name: 'Atoms for Peace' }];

    topAlbums.getTopAlbums.mockResolvedValueOnce([
      { name: 'The Eraser', artist: 'Thom Yorke', imageUrl: 'http://img.com' },
      { name: 'Anima', artist: 'Thom Yorke', imageUrl: 'http://img.com' },
    ]);
    topAlbums.getTopAlbums.mockResolvedValueOnce([
      { name: 'Amok', artist: 'Atoms for Peace', imageUrl: 'http://img.com' },
    ]);

    const library: LibraryItem[] = [
      {
        id: '1',
        name: 'The Eraser',
        artist: 'Thom Yorke',
        imageUrl: '',
        tags: [],
      },
    ];
    libraryRepository.getAll.mockResolvedValue(library);

    const result = await useCase.execute(artists);

    expect(result).toEqual([
      { name: 'Anima', artist: 'Thom Yorke', imageUrl: 'http://img.com' },
      { name: 'Amok', artist: 'Atoms for Peace', imageUrl: 'http://img.com' },
    ]);
  });

  it('should deduplicate albums appearing from multiple artists', async () => {
    const artists = [{ name: 'Radiohead' }, { name: 'Thom Yorke' }];

    topAlbums.getTopAlbums.mockResolvedValue([
      { name: 'The Eraser', artist: 'Thom Yorke', imageUrl: 'http://img.com' },
    ]);
    topAlbums.getTopAlbums.mockResolvedValue([
      { name: 'The Eraser', artist: 'Thom Yorke', imageUrl: 'http://img.com' },
    ]);

    libraryRepository.getAll.mockResolvedValue([]);

    const result = await useCase.execute(artists);

    expect(result).toEqual([
      { name: 'The Eraser', artist: 'Thom Yorke', imageUrl: 'http://img.com' },
    ]);
  });

  it('should return empty array when all albums are in library', async () => {
    topAlbums.getTopAlbums.mockResolvedValue([
      { name: 'OK Computer', artist: 'Radiohead', imageUrl: '' },
    ]);

    libraryRepository.getAll.mockResolvedValue([
      {
        id: '1',
        name: 'OK Computer',
        artist: 'Radiohead',
        imageUrl: '',
        tags: [],
      },
    ]);

    const result = await useCase.execute([{ name: 'Radiohead' }]);

    expect(result).toEqual([]);
  });

  it('should perform case-insensitive library comparison', async () => {
    topAlbums.getTopAlbums.mockResolvedValue([
      { name: 'ok computer', artist: 'radiohead', imageUrl: '' },
      { name: 'Kid A', artist: 'Radiohead', imageUrl: '' },
    ]);

    libraryRepository.getAll.mockResolvedValue([
      {
        id: '1',
        name: 'OK Computer',
        artist: 'Radiohead',
        imageUrl: '',
        tags: [],
      },
    ]);

    const result = await useCase.execute([{ name: 'Radiohead' }]);

    expect(result).toEqual([
      { name: 'Kid A', artist: 'Radiohead', imageUrl: '' },
    ]);
  });

  it('should handle artist returning no albums gracefully', async () => {
    topAlbums.getTopAlbums.mockResolvedValue([]);
    libraryRepository.getAll.mockResolvedValue([]);

    const result = await useCase.execute([{ name: 'Unknown' }]);

    expect(result).toEqual([]);
  });

  it('should return all albums when library is empty', async () => {
    const albums: CandidateAlbum[] = [
      { name: 'OK Computer', artist: 'Radiohead', imageUrl: '' },
    ];

    topAlbums.getTopAlbums.mockResolvedValue(albums);
    libraryRepository.getAll.mockResolvedValue([]);

    const result = await useCase.execute([{ name: 'Radiohead' }]);

    expect(result).toEqual(albums);
  });
});
