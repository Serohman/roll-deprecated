import {Randomizer} from "../randomizer/Randomizer";
import {MockReturn10Randomizer, MockSequenceRandomizer, MockThrowRandomizer} from "../randomizer/Randomizer.test";
import {DisadvantageMechanic} from "./DisadvantageMechanic";

describe("DisadvantageBehahviour", () => {
  let mechanic = new DisadvantageMechanic();
  let randomizer: Randomizer;

  describe("do", () => {
    test("should call randomizer.generate with correct parameters", () => {
      randomizer = new MockReturn10Randomizer();
      const spy = jest.spyOn(randomizer, "generate");
      mechanic.do(1, 2, randomizer);
      expect(spy).toHaveBeenCalledWith(1, 2);
    });

    test("should call randomizer.generate twice", () => {
      randomizer = new MockReturn10Randomizer();
      const spy = jest.spyOn(randomizer, "generate");
      mechanic.do(3, 4, randomizer);
      expect(spy).toHaveBeenNthCalledWith(1, 3, 4);
      expect(spy).toHaveBeenNthCalledWith(2, 3, 4);
    });

    test("should return the lower number of two rolls", () => {
      const randomizerLowerFirst = new MockSequenceRandomizer([5, 6]);
      const randomizerLowerSecond = new MockSequenceRandomizer([6, 5]);
      const {result: resultA} = mechanic.do(1, 10, randomizerLowerFirst);
      const {result: resultB} = mechanic.do(1, 10, randomizerLowerSecond);
      expect(resultA).toBe(5);
      expect(resultB).toBe(5);
    });

    test("should return the rolls history", () => {
      const randomizer = new MockSequenceRandomizer([5, 6]);
      const {result, rolls} = mechanic.do(1, 10, randomizer);
      expect(result).toBe(5);
      expect(rolls).toEqual([5, 6]);
    });

    test("should throw an error if randomizer.generate throws an error", () => {
      const errorMock = new MockThrowRandomizer();
      expect(() => {
        mechanic.do(1, 10, errorMock);
      }).toThrow(Error);
    });
  });
});
