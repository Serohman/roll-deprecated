import {Randomizer} from "../randomizer/Randomizer";
import {Mechanic} from "./Mechanic";

export class ExplodingMechanic extends Mechanic {
  do(min: number, max: number, randomizer: Randomizer) {
    if (min === max) return {result: min, rolls: [min]};

    let result = 0;
    let roll;
    let rolls = [];

    do {
      roll = randomizer.generate(min, max);
      rolls.push(roll);
      result += roll;
    } while (roll === max); // Continue rolling if max value is hit

    return {result, rolls};
  }
}
