import {AdvantageMechanic} from "../mechanic/AdvantageMechanic";
import {DisadvantageMechanic} from "../mechanic/DisadvantageMechanic";
import {Mechanic} from "../mechanic/Mechanic";
import {SingleRollMechanic} from "../mechanic/SingleRollMechanic";
import {Randomizer} from "../randomizer/Randomizer";
import {SimpleRandomizer} from "../randomizer/SimpleRandomizer";

export interface RollConfig {
  randomizer?: Randomizer;
  mechanic?: Mechanic;
}

export class Roll {
  public randomizer: Randomizer;
  public mechanic: Mechanic;

  constructor(
    public min: number,
    public max: number,
    defaults: RollConfig = {}
  ) {
    this.randomizer = defaults.randomizer || new SimpleRandomizer();
    this.mechanic = defaults.mechanic instanceof Mechanic ? defaults.mechanic : new SingleRollMechanic();
  }

  roll(
    modifier: number = 0,
    overrideDefaults: RollConfig = {}
  ): {
    natural: number;
    modified: number;
    rolls: number[];
  } {
    const mechanic = overrideDefaults.mechanic || this.mechanic;
    const randomizer = overrideDefaults.randomizer || this.randomizer;

    const {result: natural, rolls} = mechanic.do(this.min, this.max, randomizer);
    const modified = natural + (modifier || 0);

    return {
      natural,
      modified,
      rolls,
    };
  }

  rollAdvantage(modifier?: number, overrideDefaults: Omit<RollConfig, "mechanic"> = {}) {
    return this.roll(modifier, {
      ...overrideDefaults,
      mechanic: new AdvantageMechanic(),
    });
  }

  rollDisadvantage(modifier: number, overrideDefaults: Omit<RollConfig, "mechanic"> = {}) {
    return this.roll(modifier, {
      ...overrideDefaults,
      mechanic: new DisadvantageMechanic(),
    });
  }
}
