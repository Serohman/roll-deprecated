import {Randomizer} from "../randomizer/Randomizer";
import {Mechanic} from "./Mechanic";

export class RerollMechanic extends Mechanic {
  constructor(public readonly options: RerollMechanic.Options) {
    super();
    this.options.maxRerollCount = options.maxRerollCount ?? 1;
    this.validateOptions(options);
  }

  do(min: number, max: number, randomizer: Randomizer) {
    const rolls: number[] = [];
    let result: number = randomizer.generate(min, max);
    let remainingRerolls = this.options.maxRerollCount ?? 0;
    rolls.push(result);

    while (this.options.target.includes(result) && remainingRerolls > 0) {
      result = randomizer.generate(min, max);
      rolls.push(result);
      remainingRerolls--;
    }

    return {result, rolls};
  }

  private validateOptions({target: target, maxRerollCount: times}: RerollMechanic.Options): void {
    if (target.length === 0) {
      throw new Error("Target can not be an empty array.");
    }
    if (target.some((target) => typeof target !== "number")) {
      throw new Error("All values in the target array must be numbers.");
    }
    if (typeof times !== "number" || !Number.isInteger(times) || times <= 0) {
      throw new Error("Times must be a positive integer.");
    }
  }
}

export namespace RerollMechanic {
  export interface Options {
    target: number[];
    maxRerollCount?: number;
  }
}
