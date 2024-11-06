import {Randomizer} from "./Randomizer";
import {SimpleRandomizer} from "./SimpleRandomizer";

describe("RandomizerDefault", () => {
  let randomizer: Randomizer = new SimpleRandomizer();

  describe("generate", () => {
    test("should return a number within the specified range", () => {
      const min = 1;
      const max = 10;
      const result = randomizer.generate(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    test("should handle the case where min equals max", () => {
      const minMax = 5;
      const result = randomizer.generate(minMax, minMax);
      expect(result).toBe(minMax);
    });

    test("should return a number when min and max are the same", () => {
      const min = 10;
      const max = 10;
      const result = randomizer.generate(min, max);
      expect(result).toBe(min);
    });

    test("should return a valid integer", () => {
      const min = 1;
      const max = 100;
      const result = randomizer.generate(min, max);
      expect(Number.isInteger(result)).toBe(true); // Ensure the result is an integer
    });
  });
});
