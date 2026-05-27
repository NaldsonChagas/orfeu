import type { AlbumTagsPort } from '../../albums/ports/album-tags.port.js';

interface CacheEntry {
  vector: Record<string, number>;
  expiresAt: number;
}

export class TagVectorBuilder {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttlMs = 6 * 60 * 60 * 1000;

  constructor(private readonly albumTags: AlbumTagsPort) {}

  async buildTagVector(
    artist: string,
    album: string,
  ): Promise<Record<string, number>> {
    const cacheKey = `${artist.toLowerCase()}::${album.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() < cached.expiresAt) {
      return cached.vector;
    }

    const tags = await this.albumTags.getTopTags(artist, album);

    const tagCount = tags.length;
    const vector: Record<string, number> = {};
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const weight = tagCount > 0 ? (tagCount - i) / tagCount : 0;
      vector[tag.toLowerCase()] = weight;
    }

    this.cache.set(cacheKey, { vector, expiresAt: Date.now() + this.ttlMs });

    return vector;
  }
}
