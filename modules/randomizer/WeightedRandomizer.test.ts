import {WeightedRandomizer} from "./WeightedRandomizer";

describe("WeightedRandomizer", () => {
  describe("validateWeights", () => {
    const randomizer = new WeightedRandomizer({
      1: 1 / 2,
      2: 1 / 2,
    });

    test("passes if valid keys are provided", () => {
      expect(() => {
        randomizer["validateWeights"]({
          "1": 1 / 2,
          2: 1 / 2,
        });
      }).not.toThrow();
    });

    test("throws if invalid key is provided", () => {
      throwIf("foo");
      throwIf("");
      throwIf("-1");
      throwIf("1.1");
      throwIf("0");

      function throwIf(value: any) {
        expect(() => {
          randomizer["validateWeights"]({
            [value]: 1 / 2,
            1: 1 / 2,
          });
        }).toThrow(`Invalid key "${value}": All keys must be positive integers.`);
      }
    });

    test("passes if valid values are provided", () => {
      expect(() => {
        randomizer["validateWeights"]({
          1: 0.1,
          2: 0.9,
          3: 0,
        });
      }).not.toThrow();
      expect(() => {
        randomizer["validateWeights"]({
          1: 1,
          2: 0,
          3: 0,
        });
      }).not.toThrow();
    });

    test("throws if invalid weights are provided", () => {
      throwIf(false);
      throwIf(true);
      throwIf(null);
      throwIf(undefined);
      throwIf([]);
      throwIf({});
      throwIf("");
      throwIf("0");
      throwIf(NaN);
      throwIf(-0.01);

      function throwIf(value: any) {
        expect(() => {
          randomizer["validateWeights"]({
            1: value,
            2: 1 / 2,
          });
        }).toThrow(
          `Invalid value for key "1": All values must be a number between 0 and 1 (inclusive). Received "${value}".`
        );
      }
    });

    test("throws if invalid number of die faces provided", () => {
      expect(() => {
        randomizer["validateWeights"]({
          1: 0.5,
          3: 0.5,
        });
      }).toThrow(`Incorrect number of weight entries: Expected entries from 1 to 3, but received 2 entries total.`);
    });

    test("throws if total weight sum not 1", () => {
      expect(() => {
        randomizer["validateWeights"]({
          1: 0.5,
          2: 0.9,
        });
      }).toThrow(`Incorrect weights provided, the total of all weights expected to be 1. Got ${1.4}`);

      expect(() => {
        randomizer["validateWeights"]({
          1: 0.5,
          2: 0.3,
        });
      }).toThrow(`Incorrect weights provided, the total of all weights expected to be 1. Got ${0.8}`);
    });
  });

  describe("convertToCumulativeWeights", () => {
    const instance = new WeightedRandomizer({1: 0.5, 2: 0.5}); // Replace with your class instance.

    test("should correctly convert a standard weight array", () => {
      const weights = [0.2, 0.3, 0.1, 0.4];
      const expected = [0.2, 0.5, 0.6, 1.0];
      expect(instance["convertToCumulativeWeights"](weights)).toEqual(expected);
    });

    test("should handle weights that sum to exactly 1", () => {
      const weights = [1 / 3, 1 / 3, 1 / 3];
      const expected = [1 / 3, 1 / 3 + 1 / 3, 1];
      expect(instance["convertToCumulativeWeights"](weights)).toEqual(expected);
    });
  });

  describe("mapToWeightedValue", () => {
    const instance = new WeightedRandomizer({1: 0.5, 2: 0.5}); // Replace with your class instance.

    test("returns the correct value when randomValue falls in the first range", () => {
      const cumulativeWeights = [0.2, 0.5, 0.8, 1.0];
      expect(instance["mapToWeightedValue"](0.1, cumulativeWeights)).toBe(1);
    });

    test("should return the correct value when randomValue falls in the second range", () => {
      const cumulativeWeights = [0.2, 0.5, 0.8, 1.0];
      expect(instance["mapToWeightedValue"](0.3, cumulativeWeights)).toBe(2);
    });

    test("should return the correct value when randomValue falls in the last range", () => {
      const cumulativeWeights = [0.2, 0.5, 0.8, 1.0];
      expect(instance["mapToWeightedValue"](0.95, cumulativeWeights)).toBe(4);
    });

    test("should throw an error if randomValue is equal to or greater than 1.0", () => {
      const cumulativeWeights = [0.2, 0.5, 0.8, 1.0];
      expect(() => {
        instance["mapToWeightedValue"](1.0, cumulativeWeights);
      }).toThrow("Invalid weights or random value");
    });

    it("should throw an error if cumulativeWeights is empty", () => {
      const cumulativeWeights: number[] = [];
      expect(() => {
        instance["mapToWeightedValue"](0.5, cumulativeWeights);
      }).toThrow("Invalid weights or random value");
    });

    it("should return the correct value when randomValue is very close to the cumulative weight", () => {
      const cumulativeWeights = [0.2, 0.5, 0.8, 1.0];
      expect(instance["mapToWeightedValue"](0.499999, cumulativeWeights)).toBe(2);
    });
  });
});
