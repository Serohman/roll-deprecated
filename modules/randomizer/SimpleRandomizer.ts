import {Randomizer} from "./Randomizer";

export class SimpleRandomizer extends Randomizer {
  protected generator(): number {
    return Math.random();
  }
}
