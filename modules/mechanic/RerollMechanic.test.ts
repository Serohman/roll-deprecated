import {Randomizer} from "../randomizer/Randomizer";
import {RerollMechanic} from "./RerollMechanic";

describe("RerollMechanic", () => {
  describe("Constructor", () => {
    test("should not throw an error for valid options", () => {
      expect(() => {
        new RerollMechanic({target: [1, 20], maxRerollCount: 1});
      }).not.toThrow();
    });

    test("should throw an error if 'target' contains non-number values", () => {
      expect(() => {
        new RerollMechanic({target: [1, "string" as any, 20], maxRerollCount: 1});
      }).toThrow("All values in the target array must be numbers.");
      expect(() => {
        new RerollMechanic({target: [1, null as any, 20], maxRerollCount: 1});
      }).toThrow("All values in the target array must be numbers.");
    });

    test("should throw an error if 'target' is empty", () => {
      expect(() => {
        new RerollMechanic({target: [], maxRerollCount: 1});
      }).toThrow("Target can not be an empty array.");
    });

    test("should throw an error if maxRerollCount is not a number", () => {
      expect(() => {
        new RerollMechanic({target: [1, 2], maxRerollCount: "not-a-number" as any});
      }).toThrow("Times must be a positive integer.");
    });

    test("should throw an error if maxRerollCount is zero or negative", () => {
      expect(() => {
        new RerollMechanic({target: [1, 2], maxRerollCount: 0});
      }).toThrow("Times must be a positive integer.");
      expect(() => {
        new RerollMechanic({target: [1, 2], maxRerollCount: -1});
      }).toThrow("Times must be a positive integer.");
    });
  });

  describe("do", () => {
    const mockRandomizer = (values: number[]): Randomizer =>
      ({
        generate: jest.fn(() => values.shift() || 0),
      }) as any;

    test("should accept the first roll if not in target", () => {
      const mechanic = new RerollMechanic({target: [1, 2], maxRerollCount: 3});
      const randomizer = mockRandomizer([3]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 3, rolls: [3]});
    });

    it("should reroll until success", () => {
      const mechanic = new RerollMechanic({target: [1, 2], maxRerollCount: 3});
      const randomizer = mockRandomizer([1, 2, 5]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 5, rolls: [1, 2, 5]});
    });

    it("should exhaust all rerolls if all rolls are in target", () => {
      const mechanic = new RerollMechanic({target: [1, 2, 3], maxRerollCount: 3});
      const randomizer = mockRandomizer([1, 2, 3, 4]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 4, rolls: [1, 2, 3, 4]}); // 1 initial roll + 3 rerolls
    });

    it("should not reroll if target contains no values in range", () => {
      const mechanic = new RerollMechanic({target: [7, 8], maxRerollCount: 3});
      const randomizer = mockRandomizer([4]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 4, rolls: [4]});
    });

    it("should allow only one reroll when maxRerollCount is 1", () => {
      const mechanic = new RerollMechanic({target: [1], maxRerollCount: 1});
      const randomizer = mockRandomizer([1, 2, 3]);
      const result = mechanic.do(1, 6, randomizer);

      expect(result).toEqual({result: 2, rolls: [1, 2]});
    });
  });

  // it("should do a reroll if target number is hit");
  // it("should reroll correct number of times if target number is hit");
  // it("should return a list of rolled values (including the rerolled values)");
  // it("should return a valid value");
});
