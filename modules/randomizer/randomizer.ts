export abstract class Randomizer {
  protected abstract generator(): number;

  generate(min: number, max: number): number {
    this.validateMinMax(min, max);
    return this.scaleToRange(this.generator(), min, max);
  }

  protected scaleToRange(rawRoll: number, min: number, max: number): number {
    if (rawRoll >= 0.99) return max;
    if (rawRoll <= 0) return min;

    return Math.floor(rawRoll * (max - min + 1)) + min;
  }

  protected validateMinMax(min: number, max: number): void {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error(`Invalid range: Both minimum (${min}) and maximum (${max}) values must be integers.`);
    }
    if (min < 1 || max < 1) {
      throw new Error(
        `Invalid range: Both minimum (${min}) and maximum (${max}) values must be positive integers greater than zero.`
      );
    }
    if (min > max) {
      throw new Error(`Invalid range: The minimum value (${min}) cannot be greater than the maximum value (${max}).`);
    }
  }
}
