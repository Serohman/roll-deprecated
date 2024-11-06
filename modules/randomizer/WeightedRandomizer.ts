import {Randomizer} from "./Randomizer";

export class WeightedRandomizer extends Randomizer {
  private weights: number[];
  private cumulativeWeights: number[];

  constructor(weights: Record<number, number>) {
    super();
    this.validateWeights(weights);
    this.weights = Object.values(weights);
    this.cumulativeWeights = this.convertToCumulativeWeights(this.weights);
  }

  generator(): number {
    return this.mapToWeightedValue(Math.random(), this.cumulativeWeights);
  }

  private validateWeights(weights: Record<number, number>): void {
    const entries = Object.entries(weights);
    let maxFace = 0;
    let weightSum = 0;

    for (const [key, value] of entries) {
      const face = Number(key);

      // Validate key
      if (key === "" || !Number.isInteger(face) || face <= 0) {
        throw new Error(`Invalid key "${key}": All keys must be positive integers.`);
      }

      // Validate value
      if (typeof value !== "number" || value > 1 || value < 0 || isNaN(value)) {
        throw new Error(
          `Invalid value for key "${key}": All values must be a number between 0 and 1 (inclusive). Received "${value}".`
        );
      }
      if (face > maxFace) {
        maxFace = face;
      }
      weightSum += value;
    }

    if (maxFace !== entries.length) {
      throw new Error(
        `Incorrect number of weight entries: Expected entries from 1 to ${maxFace}, but received ${entries.length} entries total.`
      );
    }

    if (weightSum != 1) {
      throw new Error(`Incorrect weights provided, the total of all weights expected to be 1. Got ${weightSum}`);
    }
  }

  private convertToCumulativeWeights(weights: number[]): number[] {
    const cumulativeWeights = [];
    let cumulativeSum = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulativeSum += weights[i];
      cumulativeWeights.push(cumulativeSum);
    }

    return cumulativeWeights;
  }

  private mapToWeightedValue(randomValue: number, cumulativeWeights: number[]): number {
    for (let i = 0; i < cumulativeWeights.length; i++) {
      if (randomValue < cumulativeWeights[i]) {
        return i + 1;
      }
    }

    // Should not reach here if weights are valid
    throw new Error("Invalid weights or random value.");
  }

  protected scaleToRange(weightedRoll: number, min: number, max: number): number {
    return weightedRoll;
  }
}
