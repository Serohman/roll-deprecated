import {Randomizer} from "./Randomizer"; // Adjust the import based on your file structure

describe("Randomizer", () => {
  let randomizer: MockReturn10Randomizer;

  beforeEach(() => {
    randomizer = new MockReturn10Randomizer();
  });

  describe("validateMinMax", () => {
    test("should not throw for valid min and max", () => {
      expect(() => randomizer["validateMinMax"](1, 10)).not.toThrow(Error);
      expect(() => randomizer["validateMinMax"](1, 1)).not.toThrow(Error);
    });

    test("should throw if min is greater than max", () => {
      expect(() => randomizer["validateMinMax"](10, 1)).toThrow(Error);
      expect(() => randomizer["validateMinMax"](5, 3)).toThrow(
        "Invalid range: The minimum value (5) cannot be greater than the maximum value (3)."
      );
    });

    test("should throw if min or max is not positive", () => {
      expect(() => randomizer["validateMinMax"](-1, 10)).toThrow(Error);
      expect(() => randomizer["validateMinMax"](1, -10)).toThrow(Error);
      expect(() => randomizer["validateMinMax"](0, 10)).toThrow(Error);
      expect(() => randomizer["validateMinMax"](1, 0)).toThrow(Error);
      expect(() => randomizer["validateMinMax"](0, -1)).toThrow(
        "Invalid range: Both minimum (0) and maximum (-1) values must be positive integers greater than zero."
      );
    });

    test("should throw if min or max is not an integer", () => {
      expect(() => randomizer["validateMinMax"](1.5, 10)).toThrow(Error);
      expect(() => randomizer["validateMinMax"](1, 10.5)).toThrow(Error);
      expect(() => randomizer["validateMinMax"](1.5, 10.5)).toThrow(
        `Invalid range: Both minimum (1.5) and maximum (10.5) values must be integers.`
      );
    });
  });

  describe("scaleToRange", () => {
    class MockRandomizer extends Randomizer {
      protected generator(): number {
        return Math.random();
      }
    }

    let randomizer: Randomizer, min: number, max: number, rawRoll: number, result: number | undefined;

    beforeEach(() => {
      randomizer = new MockRandomizer();
      min = 1;
      max = 20;
      rawRoll = 0;
    });

    afterEach(() => {
      result = undefined;
    });

    test("should return the minimum value when rawRoll is 0 or lower", () => {
      rawRoll = 0;
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBe(min);

      rawRoll = -0.1;
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBe(min);
    });

    test("should return the maximum value when rawRoll is higher than 0.99", () => {
      rawRoll = 1;
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBe(max); // Expecting 10 as the maximum value
    });

    test("should return a value within the range when rawRoll is between 0 and 1", () => {
      rawRoll = 0.5;
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    test("should return correct value for rawRoll between 0 and 1", () => {
      rawRoll = 0.2; // Some random fraction between 0 and 1
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBe(5); // Expect a value close to the 20% mark in the range [1,20], which is 5
    });

    test("should return correct value when min and max are equal", () => {
      min = max = 5; // Edge case: single number range [5,5]

      rawRoll = 0; // Low roll (though it should be irrelevant)
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBe(5); // Only possible outcome is 5

      rawRoll = 0.5; // Midpoint
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBe(5);

      rawRoll = 1; // High roll
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBe(5);
    });

    test("should correctly handle negative values for min and max", () => {
      min = -5;
      max = -1;
      rawRoll = 0.5;
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBe(-3); // Expect midpoint of the range [-5, -1] which is -3
    });

    test("should work with a large range", () => {
      min = 1;
      max = 1000;
      rawRoll = 0.999;
      result = randomizer["scaleToRange"](rawRoll, min, max);
      expect(result).toBe(1000); // Should be the highest value in the range
    });
  });

  describe("generate", () => {
    test("should call 'validateMinMax' with the provided min and max", () => {
      const validateSpy = jest.spyOn(randomizer, "validateMinMax" as any);
      randomizer.generate(1, 10);
      expect(validateSpy).toHaveBeenCalledWith(1, 10);
      validateSpy.mockRestore();
    });

    test("should return a value that falls within the specified range", () => {
      const result = randomizer.generate(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });
  });
});

export class MockReturn10Randomizer extends Randomizer {
  protected generator(): number {
    return 10;
  }

  protected scaleToRange(rawRoll: number, min: number, max: number): number {
    return rawRoll;
  }
}

export class MockThrowRandomizer extends Randomizer {
  protected generator(): number {
    throw new Error("Randomizer Error");
  }
}

export class MockSequenceRandomizer extends Randomizer {
  counter = -1;

  constructor(private sequence: number[]) {
    super();
  }

  protected generator(): number {
    this.counter++;
    return this.sequence[this.counter];
  }

  protected scaleToRange(rawRoll: number, min: number, max: number): number {
    return rawRoll;
  }
}
