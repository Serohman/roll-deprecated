import {MockSequenceRandomizer} from "../randomizer/Randomizer.test";
import {ExplodingMechanic} from "./ExplodingMechanic";

describe("ExplodingMechanic", () => {
  let randomizer, mechanic;

  afterEach(() => {
    randomizer = undefined;
    mechanic = undefined;
  });

  describe("do", () => {
    test("should return total of one roll if max value is not rolled", () => {
      randomizer = new MockSequenceRandomizer([5]);
      mechanic = new ExplodingMechanic();
      const {result} = mechanic.do(1, 6, randomizer);
      expect(result).toBe(5); // No explosion, so the total is the same as the roll
    });

    test("should keep rolling if max value is hit", () => {
      randomizer = new MockSequenceRandomizer([6, 3]);
      mechanic = new ExplodingMechanic();
      const {result} = mechanic.do(1, 6, randomizer);
      expect(result).toBe(9); // 6 + 3 = 9, since 6 was rolled first
    });

    test("should stop rolling when a non-max value is rolled", () => {
      randomizer = new MockSequenceRandomizer([6, 6, 2]);
      mechanic = new ExplodingMechanic();
      const {result} = mechanic.do(1, 6, randomizer);
      expect(result).toBe(14); // 6 + 6 + 2 = 14
    });

    test("should not roll when min == max", () => {
      randomizer = new MockSequenceRandomizer([5]);
      mechanic = new ExplodingMechanic();
      const {result} = mechanic.do(5, 5, randomizer);
      expect(result).toBe(5); // No explosion since min == max
    });

    test("should return correct total with multiple explosions", () => {
      randomizer = new MockSequenceRandomizer([6, 6, 6, 1]);
      mechanic = new ExplodingMechanic();
      const {result} = mechanic.do(1, 6, randomizer);
      expect(result).toBe(19); // 6 + 6 + 6 + 1 = 19
    });

    test("should return total for a single non-max roll", () => {
      randomizer = new MockSequenceRandomizer([3]);
      mechanic = new ExplodingMechanic();
      const {result} = mechanic.do(1, 6, randomizer);
      expect(result).toBe(3); // No explosion, so the total is just the roll
    });

    test("should return correct rolls history", () => {
      randomizer = new MockSequenceRandomizer([6, 6, 2]);
      mechanic = new ExplodingMechanic();
      const {rolls} = mechanic.do(1, 6, randomizer);
      expect(rolls).toEqual([6, 6, 2]);
    });
  });
});
