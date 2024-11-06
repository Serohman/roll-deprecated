# Randomizers

Randomizers determine how randomness is achieved for rolls, enabling customizable strategies such as seeded, weighted, or default randomness.

- [Usage](#usage)
- [List of randomizer](#list-of-randomizers)
  - [Karmic](#karmic)
  - [Seeded](#seeded)
  - [Weighted](#weighted)
  - [Default](#default-mathrandom)

## Usage

There are two main ways to apply a randomizer:

1. By specifying the randomizer when creating a new `Roll` instance, which applies the randomizer as a default to all subsequent rolls.

```ts
const attack = new Roll(1, 20, {randomizer: new SeededRandomizer(12345)});
const attackRoll = attack.roll();
```

2. Alternatively, you can apply a randomizer individually to each roll as needed.

```ts
const attack = new Roll(1, 20);
const attackRollA = attack.roll(); // Default randomizer
const attackRollB = attack.roll(0, {randomizer: new SeededRandomizer(12345)}); // Seeded randomizer
```

## List of randomizers

### Karmic

Introduces a bias based on recent roll outcomes to balance overall results. After a streak of high rolls, high values become less likely, while low values become more likely, and vice versa. This approach is designed to reduce streaks, creating a sense of fairness and enhancing perceived variety.

#### Example

If recent rolls have consistently been high, the next roll has a slightly increased chance of being lower.

```ts
import {KarmicRandomizer, Roll} from "@seroh/roll";

const randomizer = new KarmicRandomizer({
  highRollThreshold: 0.8, // The threshold above which a roll is considered "high."
  lowRollThreshold: 0.2, // The threshold below which a roll is considered "low."
  biasFactor: 0.2, // The strength of the bias applied to subsequent rolls.
});

const attack = new Roll(1, 20, {randomizer});
const attackRoll = attack.roll();
```

### Seeded

Generates deterministic random sequences using a predefined seed value. Ensures consistent roll sequences when initialized with the same seed, making it ideal for debugging and reproducing specific scenarios.

#### Example

Given a seed of `12345`, the same set of rolls will be produced every time the randomizer is used.

```ts
import {Roll, SeededRandomizer} from "@seroh/roll";

const randomizer = new SeededRandomizer(1234);
const attack = new Roll(1, 20, {randomizer});
const attackRoll = attack.roll();
```

### Weighted

Assigns different probabilities to outcomes, allowing certain results to be more or less likely. Useful for custom scenarios where some results should occur more often than others.

#### Example

In a weighted `1d6` roll, a `6` might have a 50% chance of appearing, while the other numbers share the remaining 50%.

```ts
import {Roll, WeightedRandomizer} from "@seroh/roll";

const attack = new Roll(1, 20, {
  randomizer: new WeightedRandomizer({
    "1": 1 / 10,
    "2": 1 / 10,
    "3": 1 / 10,
    "4": 1 / 10,
    "5": 1 / 10,
    "6": 5 / 10,
  }),
});

attack.roll();
```

### Default (Math.random)

Uses JavaScript's built-in `Math.random` function for generating random numbers. Simple and reliable, suitable for most generic use cases.

#### Example

Rolls are determined by the standard random function, ensuring uniformly distributed results with no memory of prior outcomes.

```ts
import {Roll} from "@seroh/roll";

const attack = new Roll(1, 20);
const attackRoll = attack.roll();
```
