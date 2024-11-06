import {AdvantageMechanic} from "../mechanic/AdvantageMechanic";
import {DisadvantageMechanic} from "../mechanic/DisadvantageMechanic";
import {Mechanic} from "../mechanic/Mechanic"; // Import your Mechanic class
import {Randomizer} from "../randomizer/Randomizer"; // Import your Randomizer class
import {MockReturn10Randomizer, MockSequenceRandomizer} from "../randomizer/Randomizer.test";
import {Roll} from "./Roll"; // Adjust the import based on your file structure

describe("Roll", () => {
  let roll: Roll;
  let randomizer: Randomizer;

  beforeEach(() => {
    randomizer = new MockReturn10Randomizer();
    roll = new Roll(1, 20, {randomizer});
  });

  describe("roll", () => {
    test("should return correct natural and modified values with default mechanic", () => {
      const result = roll.roll();
      expect(result.natural).toBe(10); // Based on the mock implementation
      expect(result.modified).toBe(10);
      expect(result.rolls).toEqual([10]);
    });

    test("should apply modifier correctly", () => {
      const resultA = roll.roll(3);
      const resultB = roll.roll(-3);
      expect(resultA.natural).toBe(10);
      expect(resultA.modified).toBe(13);
      expect(resultB.natural).toBe(10);
      expect(resultB.modified).toBe(7);
    });

    test("should allow mechanic to be overridden", () => {
      const mockMechanic: Mechanic = {
        do: jest.fn().mockReturnValue(7), // Always returns 7
      };
      const result = roll.roll(0, {mechanic: mockMechanic});
      expect(mockMechanic.do).toHaveBeenCalledWith(1, 20, randomizer);
    });

    test("should allow randomizer to be overridden", () => {
      randomizer = new MockSequenceRandomizer([1, 2, 3]);
      const randomizerSpy = jest.spyOn(randomizer, "generate");
      const result = roll.roll(0, {randomizer});
      expect(randomizerSpy).toHaveBeenCalledWith(1, 20);
    });
  });

  describe("rollAdvantage", () => {
    test("should call roll with advantage mechanic", () => {
      const rollSpy = jest.spyOn(roll, "roll").mockImplementation(() => ({
        natural: 10,
        modified: 10,
        rolls: [10, 10],
      }));
      roll.rollAdvantage(2);

      // Check that the roll method was called with the correct parameters
      expect(rollSpy).toHaveBeenCalledWith(
        2,
        expect.objectContaining({
          mechanic: expect.any(AdvantageMechanic),
        })
      );
    });
  });

  describe("rollDisadvantage", () => {
    test("should call roll with disadvantage mechanic", () => {
      const rollSpy = jest.spyOn(roll, "roll").mockImplementation(() => ({
        natural: 10,
        modified: 10,
        rolls: [10, 10],
      }));
      roll.rollDisadvantage(2);

      // Check that the roll method was called with the correct parameters
      expect(rollSpy).toHaveBeenCalledWith(
        2,
        expect.objectContaining({
          mechanic: expect.any(DisadvantageMechanic),
        })
      );
    });
  });
});
