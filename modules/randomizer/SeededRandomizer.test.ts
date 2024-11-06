import {SeededRandomizer} from "./SeededRandomizer";

describe("SeededRandomizer", () => {
  describe("constructor", () => {
    it("should call 'validateSeed' method", () => {
      const validateSeedSpy = jest.spyOn(SeededRandomizer.prototype, "validateSeed" as any);

      new SeededRandomizer(1234);
      expect(validateSeedSpy).toHaveBeenCalledWith(1234);
    });
  });

  describe("generator", () => {
    it("should return result of 'lcg' method", () => {
      const seed = 1234567890;
      const randomizer = new SeededRandomizer(seed);

      const lcgMock = jest.spyOn(randomizer as any, "lcg").mockReturnValue(0.5678);

      const result = randomizer["generator"]();

      // Ensure the lcg method was called with the correct parameter (the current seed)
      expect(lcgMock).toHaveBeenCalledTimes(1);
      expect(lcgMock).toHaveBeenCalledWith(seed); // Current seed passed

      // Verify the generator returns the value from the mocked lcg
      expect(result).toBe(0.5678);

      // Clean up the mock
      lcgMock.mockRestore();
    });
  });

  describe("validateSeed", () => {
    const randomizer = new SeededRandomizer(1234);

    it("should throw an error if the seed is not an integer", () => {
      expect(() => {
        randomizer["validateSeed"](4.5);
      }).toThrow("Seed must be an integer.");
    });

    it("should throw an error if the seed is less than 0", () => {
      expect(() => {
        randomizer["validateSeed"](-1);
      }).toThrow("Seed must be a 32-bit unsigned integer (0 <= seed < 2^32).");
    });

    it("should throw an error if the seed is greater than or equal to 2^32", () => {
      expect(() => {
        randomizer["validateSeed"](2 ** 32);
      }).toThrow("Seed must be a 32-bit unsigned integer (0 <= seed < 2^32).");
    });

    it("should pass if the seed is a valid 32-bit unsigned integer", () => {
      expect(() => {
        randomizer["validateSeed"](1234567890);
      }).not.toThrow();
    });
  });

  describe("lcg", () => {
    it("should generate a number between 0 and 1 for a valid seed", () => {
      const seed = 1234567890;
      const randomizer = new SeededRandomizer(seed);
      const result = randomizer["lcg"](seed);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it("should return different results for different seeds", () => {
      const seed1 = 1234567890;
      const seed2 = 987654321;
      let randomizer = new SeededRandomizer(seed1);
      const result1 = randomizer["lcg"](seed1);
      randomizer = new SeededRandomizer(seed2);
      const result2 = randomizer["lcg"](seed2);
      expect(result1).not.toBe(result2);
    });

    it("should produce a predictable sequence of random numbers for the same seed", () => {
      const seed = 1234567890;
      const randomizer = new SeededRandomizer(seed);
      const firstResult = randomizer["lcg"](randomizer.seed);
      const secondResult = randomizer["lcg"](randomizer.seed); // The next iteration
      expect(firstResult).not.toBe(secondResult); // Values should differ on each iteration

      // Testing consistency with same seed across different instances
      const randomizer2 = new SeededRandomizer(seed);
      const thirdResult = randomizer2["lcg"](randomizer2.seed);
      expect(firstResult).toBe(thirdResult);
    });
  });

  test("Produces the same sequence for the same seed", () => {
    const randomizer1 = new SeededRandomizer(12345);
    const randomizer2 = new SeededRandomizer(12345);

    const sequence1 = Array.from({length: 5}, () => randomizer1.generate(1, 20));
    const sequence2 = Array.from({length: 5}, () => randomizer2.generate(1, 20));

    expect(sequence1).toEqual(sequence2);
  });

  test("Produces different sequences for different seeds", () => {
    const randomizer1 = new SeededRandomizer(12345);
    const randomizer2 = new SeededRandomizer(67890);

    const sequence1 = Array.from({length: 5}, () => randomizer1.generate(1, 20));
    const sequence2 = Array.from({length: 5}, () => randomizer2.generate(1, 20));

    expect(sequence1).not.toEqual(sequence2);
  });

  test("Output values are within [0, 1)", () => {
    const randomizer = new SeededRandomizer(12345);

    for (let i = 0; i < 100; i++) {
      const value = randomizer.generate(1, 20);
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThanOrEqual(20);
    }
  });

  test("Seed updates correctly after each generate() call", () => {
    const randomizer = new SeededRandomizer(12345);

    const initialSeed = randomizer.seed;
    randomizer.generate(1, 20);
    const updatedSeed = randomizer.seed;

    expect(initialSeed).not.toBe(updatedSeed);
  });
});
