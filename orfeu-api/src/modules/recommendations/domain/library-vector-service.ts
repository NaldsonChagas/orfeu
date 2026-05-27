import type { CandidateAlbum } from '../ports/top-albums.port.js';
import type { ScoredAlbum } from '../ports/scored-album.port.js';
import type { LibraryItem } from '../../library/domain/library-item.js';
import { TagVectorBuilder } from './tag-vector-builder.js';
import { CosineSimilarityCalculator } from './cosine-similarity-calculator.js';
import { EMPTY, from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';

export class LibraryVectorService {
  constructor(
    private readonly tagVectorBuilder: TagVectorBuilder,
    private readonly cosineSimilarity: CosineSimilarityCalculator,
  ) {}

  async scoreCandidates(
    library: LibraryItem[],
    candidates: CandidateAlbum[],
  ): Promise<ScoredAlbum[]> {
    if (candidates.length === 0 || library.length === 0) {
      return [];
    }

    const libraryVectors = await Promise.all(
      library.map((item) =>
        this.tagVectorBuilder.buildTagVector(item.artist, item.name),
      ),
    );

    const avgLibraryVector = this.calculateAverageVector(libraryVectors);

    const scored = await Promise.all(
      candidates.map(async (candidate) => {
        const candidateVector = await this.tagVectorBuilder.buildTagVector(
          candidate.artist,
          candidate.name,
        );
        const score = this.cosineSimilarity.calculate(
          avgLibraryVector,
          candidateVector,
        );
        return { ...candidate, score };
      }),
    );

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 50);
  }

  scoreCandidatesStream(
    library: LibraryItem[],
    candidates: CandidateAlbum[],
  ): Observable<ScoredAlbum> {
    if (candidates.length === 0 || library.length === 0) {
      return EMPTY;
    }

    const libraryVectors = library.map((item) =>
      this.tagVectorBuilder.buildTagVector(item.artist, item.name),
    );

    return from(Promise.all(libraryVectors)).pipe(
      mergeMap((vecs) => {
        const avgLibraryVector = this.calculateAverageVector(vecs);

        return from(candidates).pipe(
          mergeMap(async (candidate) => {
            const candidateVector = await this.tagVectorBuilder.buildTagVector(
              candidate.artist,
              candidate.name,
            );
            const score = this.cosineSimilarity.calculate(
              avgLibraryVector,
              candidateVector,
            );
            return { ...candidate, score };
          }),
          toArray(),
          map((scored) =>
            scored.sort((a, b) => b.score - a.score).slice(0, 50),
          ),
          mergeMap((top) => from(top)),
        );
      }),
    );
  }

  calculateAverageVector(
    vectors: Record<string, number>[],
  ): Record<string, number> {
    const avg: Record<string, number> = {};
    const count = vectors.length;

    if (count === 0) {
      return avg;
    }

    for (let i = 0; i < count; i++) {
      const vec = vectors[i];
      for (const key in vec) {
        if (Object.prototype.hasOwnProperty.call(vec, key)) {
          avg[key] = (avg[key] ?? 0) + vec[key];
        }
      }
    }

    for (const key in avg) {
      if (Object.prototype.hasOwnProperty.call(avg, key)) {
        avg[key] /= count;
      }
    }

    return avg;
  }
}
