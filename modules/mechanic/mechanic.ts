import {Randomizer} from "../randomizer/Randomizer";

export abstract class Mechanic {
  abstract do(min: number, max: number, randomizer: Randomizer): {result: number; rolls: number[]};
}
