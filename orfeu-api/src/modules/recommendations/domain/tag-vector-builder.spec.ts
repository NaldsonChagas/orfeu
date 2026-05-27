import { TagVectorBuilder } from './tag-vector-builder.js';
import type { AlbumTagsPort } from '../../albums/ports/album-tags.port.js';

describe('TagVectorBuilder', () => {
  let builder: TagVectorBuilder;
  let albumTags: jest.Mocked<AlbumTagsPort>;

  beforeEach(() => {
    jest.useFakeTimers();
    albumTags = { getTopTags: jest.fn() };
    builder = new TagVectorBuilder(albumTags);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should build a tag vector with rank-based weights', async () => {
    albumTags.getTopTags.mockResolvedValue(['rock', 'alternative', 'indie']);

    const vector = await builder.buildTagVector('Radiohead', 'OK Computer');

    expect(vector).toEqual({
      rock: 1,
      alternative: 2 / 3,
      indie: 1 / 3,
    });
    expect(albumTags.getTopTags).toHaveBeenCalledTimes(1);
  });

  it('should return empty vector when no tags', async () => {
    albumTags.getTopTags.mockResolvedValue([]);

    const vector = await builder.buildTagVector('Unknown', 'Unknown');

    expect(vector).toEqual({});
  });

  it('should cache results within TTL', async () => {
    albumTags.getTopTags.mockResolvedValue(['rock']);

    const vector1 = await builder.buildTagVector('Radiohead', 'OK Computer');
    const vector2 = await builder.buildTagVector('Radiohead', 'OK Computer');

    expect(vector1).toEqual(vector2);
    expect(albumTags.getTopTags).toHaveBeenCalledTimes(1);
  });

  it('should refetch after TTL expires', async () => {
    albumTags.getTopTags.mockResolvedValue(['rock']);

    await builder.buildTagVector('Radiohead', 'OK Computer');

    jest.advanceTimersByTime(6 * 60 * 60 * 1000 + 1);

    albumTags.getTopTags.mockResolvedValue(['electronic']);
    const vector = await builder.buildTagVector('Radiohead', 'OK Computer');

    expect(vector).toEqual({ electronic: 1 });
    expect(albumTags.getTopTags).toHaveBeenCalledTimes(2);
  });

  it('should be case-insensitive for cache keys', async () => {
    albumTags.getTopTags.mockResolvedValue(['rock']);

    const vector1 = await builder.buildTagVector('Radiohead', 'OK Computer');
    const vector2 = await builder.buildTagVector('radiohead', 'ok computer');

    expect(vector1).toEqual(vector2);
    expect(albumTags.getTopTags).toHaveBeenCalledTimes(1);
  });
});
