export class CosineSimilarityCalculator {
  calculate(
    vectorA: Record<string, number>,
    vectorB: Record<string, number>,
  ): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    const keysA = Object.keys(vectorA);
    const keysB = Object.keys(vectorB);

    for (let i = 0; i < keysA.length; i++) {
      const key = keysA[i];
      const val = vectorA[key];
      magnitudeA += val * val;
      if (key in vectorB) {
        dotProduct += val * vectorB[key];
      }
    }

    for (let i = 0; i < keysB.length; i++) {
      const val = vectorB[keysB[i]];
      magnitudeB += val * val;
    }

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  }
}
