# Mechanic

A mechanic defines the rules and behavior of a roll, shaping how the final results are determined. For example, the "Advantage/Disadvantage" mechanic, commonly used in D&D, modifies rolls to favor higher or lower outcomes.

- [Usage](#usage)
- [List of mechanics](#list-of-mechanics)
  - [Advantage/Disadvantage](#advantagedisadvantage)
  - [Reroll (or Lucky Roll)](#reroll-lucky-roll)
  - [Exploding Roll](#exploding-roll)

## Usage

There are two main ways to apply a mechanic:

1. By specifying the mechanic when creating a new `Roll` instance, which applies the mechanic by default to all subsequent rolls.

```ts
const attack = new Roll(1, 20, {mechanic: new AdvantageMechanic()});
const advantageAttackRoll = attack.roll(0);
```

2. Alternatively, you can apply a mechanic individually to each roll as needed.

```ts
const attack = new Roll(1, 20);
const attackRoll = attack.roll(0);
const advantageAttackRoll = attack.roll(0, {mechanic: new AdvantageMechanic()});
```

## List of mechanics

### Advantage/Disadvantage

Roll twice and select either the highest (advantage) or lowest (disadvantage) result based on circumstances. Common in systems like Dungeons & Dragons, it simplifies situational modifiers into a straightforward mechanic.

#### Example

Roll `1d20` twice for advantage and take the higher roll. For disadvantage, take the lower roll.

```ts
import {AdvantageMechanic, DisadvantageMechanic, Roll} from "@seroh/roll";

const attack = new Roll(1, 20);
const advantageAttackRoll = attack.roll(0, {mechanic: new AdvantageMechanic()});
const disadvantageAttackRoll = attack.roll(0, {mechanic: new DisadvantageMechanic()});
```

### Reroll (Lucky roll)

If a die rolls a specific value, reroll it. Often used to minimize bad rolls.

#### Example

When you roll a 1, you can reroll the die once and must use the new roll.

```ts
import {RerollMechanic, Roll} from "@seroh/roll";

const attack = new Roll(1, 20);
attack.roll(0, {
  mechanic: new RerollMechanic({
    target: [1],
    maxRerollCount: 1,
  }),
});
```

### Exploding Roll

If a die rolls its maximum value, it "explodes," allowing an additional roll of the same die. The new roll is added to the total, and the process can repeat. Adds excitement by providing the possibility of extraordinarily high results.

#### Example

Roll `1d6`; if the result is `6`, roll again and add the result to the total. Continue rolling as long as `6` is rolled.

```ts
import {ExplodingMechanic, Roll} from "@seroh/roll";

const attack = new Roll(1, 6);
const explodingAttackRoll = attack.roll(0, {mechanic: new ExplodingMechanic()});
```
