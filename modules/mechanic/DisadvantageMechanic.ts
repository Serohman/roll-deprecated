import {Randomizer} from "../randomizer/Randomizer";
import {Mechanic} from "./Mechanic";

export class DisadvantageMechanic extends Mechanic {
  do(min: number, max: number, randomizer: Randomizer) {
    const a = randomizer.generate(min, max);
    const b = randomizer.generate(min, max);
    return {result: Math.min(a, b), rolls: [a, b]};
  }
}
