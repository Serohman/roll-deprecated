import {Randomizer} from "../randomizer/Randomizer";
import {MockReturn10Randomizer, MockThrowRandomizer} from "../randomizer/Randomizer.test";
import {SingleRollMechanic} from "./SingleRollMechanic";

describe("SingleRoll", () => {
  let mechanic = new SingleRollMechanic();
  let randomizer: Randomizer = new MockReturn10Randomizer();

  describe("do", () => {
    test("should call randomizer.generate with correct parameters", () => {
      const spy = jest.spyOn(randomizer, "generate");
      const min = 3;
      const max = 7;
      mechanic.do(min, max, randomizer);
      expect(spy).toHaveBeenCalledWith(min, max);
    });

    test("should return value from randomizer.generate for valid min and max", () => {
      const min = 1;
      const max = 10;
      const {result, rolls} = mechanic.do(min, max, randomizer);
      expect(result).toBe(10);
      expect(rolls).toEqual([10]);
    });

    test("should throw an error if randomizer.generate throws an error", () => {
      const errorMock = new MockThrowRandomizer();
      expect(() => {
        mechanic.do(1, 10, errorMock);
      }).toThrow(Error);
    });
  });
});
