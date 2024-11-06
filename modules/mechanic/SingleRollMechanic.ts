import {Randomizer} from "../randomizer/Randomizer";

export class SingleRollMechanic {
  do(min: number, max: number, randomizer: Randomizer) {
    const result = randomizer.generate(min, max);
    return {result, rolls: [result]};
  }
}
