import {Randomizer} from "./Randomizer";

export class SeededRandomizer extends Randomizer {
  private static readonly LCG_MULTIPLIER = 1664525;
  private static readonly LCG_INCREMENT = 1013904223;
  private static readonly LCG_MODULUS = 2 ** 32;

  constructor(public seed: number) {
    super();
    this.validateSeed(seed);
  }

  protected generator(): number {
    return this.lcg(this.seed);
  }

  // Linear Congruential Generator (LCG) implementation
  private lcg(seed: number): number {
    this.seed =
      (SeededRandomizer.LCG_MULTIPLIER * seed + SeededRandomizer.LCG_INCREMENT) % SeededRandomizer.LCG_MODULUS;
    return this.seed / SeededRandomizer.LCG_MODULUS;
  }

  private validateSeed(seed: number): void {
    if (!Number.isInteger(seed)) {
      throw new Error("Seed must be an integer.");
    }

    if (seed < 0 || seed >= 2 ** 32) {
      throw new Error("Seed must be a 32-bit unsigned integer (0 <= seed < 2^32).");
    }
  }
}
