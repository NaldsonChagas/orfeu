import { CosineSimilarityCalculator } from './cosine-similarity-calculator.js';

describe('CosineSimilarityCalculator', () => {
  let calculator: CosineSimilarityCalculator;

  beforeEach(() => {
    calculator = new CosineSimilarityCalculator();
  });

  it('should return 1 for identical vectors', () => {
    const vector = { rock: 0.8, electronic: 0.2 };
    const score = calculator.calculate(vector, vector);
    expect(score).toBeCloseTo(1, 5);
  });

  it('should return 0 for perpendicular vectors (no overlap)', () => {
    const vectorA = { rock: 1 };
    const vectorB = { electronic: 1 };
    const score = calculator.calculate(vectorA, vectorB);
    expect(score).toBe(0);
  });

  it('should return 0 for a zero-magnitude vector', () => {
    const vectorA = {};
    const vectorB = { rock: 1 };
    const score = calculator.calculate(vectorA, vectorB);
    expect(score).toBe(0);
  });

  it('should return 0 when both vectors are empty', () => {
    const score = calculator.calculate({}, {});
    expect(score).toBe(0);
  });

  it('should calculate correct cosine similarity for known vectors', () => {
    const vectorA = { rock: 1, pop: 1, indie: 1 };
    const vectorB = { rock: 1, pop: 0.5, electronic: 1 };
    const score = calculator.calculate(vectorA, vectorB);
    const dot = 1 * 1 + 1 * 0.5;
    const magA = Math.sqrt(1 + 1 + 1);
    const magB = Math.sqrt(1 + 0.25 + 1);
    const expected = dot / (magA * magB);
    expect(score).toBeCloseTo(expected, 5);
  });

  it('should return higher similarity for more similar vectors', () => {
    const library = { rock: 0.8, alternative: 0.6, indie: 0.4 };
    const closeAlbum = { rock: 0.7, alternative: 0.5, indie: 0.3 };
    const farAlbum = { pop: 0.9, electronic: 0.8, dance: 0.7 };
    const closeScore = calculator.calculate(library, closeAlbum);
    const farScore = calculator.calculate(library, farAlbum);
    expect(closeScore).toBeGreaterThan(farScore);
  });

  it('should be symmetric (commutative)', () => {
    const vectorA = { rock: 0.9, jazz: 0.1 };
    const vectorB = { rock: 0.3, classical: 0.7 };
    const scoreAB = calculator.calculate(vectorA, vectorB);
    const scoreBA = calculator.calculate(vectorB, vectorA);
    expect(scoreAB).toBeCloseTo(scoreBA, 10);
  });

  it('should handle single-dimension vectors', () => {
    const score = calculator.calculate({ metal: 5 }, { metal: 2 });
    const expected = (5 * 2) / (Math.sqrt(25) * Math.sqrt(4));
    expect(score).toBeCloseTo(expected, 5);
  });
});
