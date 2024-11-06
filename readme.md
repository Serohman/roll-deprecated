> [!IMPORTANT]
> This repository is under active development, and the API is subject to change. Before version 1.0.0, there may be significant updates or modifications to the functionality and structure of the code. Use with caution in production environments and consider pinning your dependency to a specific version.

# Dice Rolling Library

This library provides a flexible and extensible system for rolling dice in tabletop RPGs, simulations, or any other applications requiring randomized results.

- [Installation](#installation)
- [Usage](#usage)
  - [Quick Start](#usage)
  - [Mechanics](#mechanics)
  - [Randomizers](#randomizers)
- [Extending](#extending)
  - [Randomizer](#randomizer)
  - [Mechanic](#mechanic)

## Installation

Install the library via npm:

```bash
npm install @seroh/roll
```

## Usage

Here’s an example of creating a simple D&D `1d20` attack roll with a `-1` modifier:

```ts
import {Roll} from "@seroh/roll";

const attack = new Roll(1, 20);
const result = attack.roll(-1);

console.log(`Natural Roll: ${result.natural}`);
console.log(`Modified Roll: ${result.modified}`);
```

### Mechanics

A mechanic defines the rules and behavior of a roll, shaping how the final results are determined. For example, the "Advantage/Disadvantage" mechanic, commonly used in D&D, modifies rolls to favor higher or lower outcomes.

The following mechanics are currently available:

- [Advantage/Disadvantage](modules/mechanic/readme.md#advantagedisadvantage)
- [Reroll (Lucky Roll)](modules/mechanic/readme.md#reroll-lucky-roll)
- [Exploding Roll](modules/mechanic/readme.md#exploding-roll)

#### Example

```ts
import {Roll, ExplodingMechanic} from "@seroh/roll";

const explodingAttack = new Roll(1, 20, {mechanic: new ExplodingMechanic()});
const result = explodingAttack.roll();
```

### Randomizers

Randomizers determine how randomness is achieved for rolls, enabling customizable strategies such as seeded, weighted, or default randomness.

In addition to the default strategy (which utilizes `Math.random`), the following randomization strategies are also supported:

- [Karmic Randomizer](modules/randomizer/readme.md#karmic)
- [Seeded Randomizer](modules/randomizer/readme.md#seeded)
- [Weighted Randomizer](modules/randomizer/readme.md#weighted)

#### Example

```ts
import {Roll, KarmicRandomizer} from "@seroh/roll";

const weightedAttack = new Roll(1, 20, {
  randomizer: new KarmicRandomizer({
    highRollThreshold: 0.8,
    lowRollThreshold: 0.2,
    biasFactor: 0.2,
  }),
});
const result = weightedAttack.roll();
```

## Extending

The goal of this library is to provide a clear path for other developers to implement their own roll behaviours, therfore the library is seprated into core modules. Each core module is extensible and allows you to implement your own roll mechanics.

### Randomizer

Developers can implement their own randomization strategies. By default, all rolls use JavaScript's standard `Math.random` method. However, the system is fully extensible, giving you complete control over the randomness.

In order to create your own randomization strategy, you have to extend the `Randomizer` class and override its `generator` method. This method must return a random number between 0 (inclusive) and 1 (exclusive).

**Example of creating your own randomizer**

Here’s an example of how seeded randomness can be achieved. It employs the 'Linear Congruential Generator' (LCG) algorithm instead of the default `Math.random` function, allowing the generator to produce a deterministic random value based on a provided seed.

```ts
import {Randomizer, Roll} from "@seroh/roll";

class SeededRandomizer extends Randomizer {
  constructor(private seed: number) {
    super();
  }

  // Generate a number between 0 and 1 (exclusive)
  protected generator(): number {
    return this.lcg(this.seed);
  }

  // Linear Congruential Generator (LCG) implementation
  private lcg(seed: number): number {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;

    // Generate the next seed
    this.seed = (a * seed + c) % m;
    return this.seed / m;
  }
}

const attack = new Roll(1, 20, {
  randomizer: new SeededRandomizer(12345678),
});
```

### Mechanic

A mechanic defines the rules and behavior of a roll, determining how final results are calculated. For instance, you can use a custom mechanic to implement advanced rolling rules such as exploding roll, advantage mechanics, or other game-specific logic. This allows you to encapsulate and reuse the behavior within your rolls seamlessly.

To create your own roll mechanic, extend the Mechanic class and override its do method.

**Example of creating your own roll mechanic**

Here's an implementation of a standard "Advantage" mechanic. This mechanic performs two rolls instead of one and returns the highest result. Additionally, it records the history of rolls in the rolls property.

```ts
import {Randomizer, Mechanic} from "@seroh/roll";

export class AdvantageMechanic extends Mechanic {
  do(min: number, max: number, randomizer: Randomizer) {
    const a = randomizer.generate(min, max);
    const b = randomizer.generate(min, max);
    return {result: Math.max(a, b), rolls: [a, b]};
  }
}
```
