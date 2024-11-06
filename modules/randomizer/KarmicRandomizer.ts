import {Randomizer} from "./Randomizer";

export interface KarmicRandomizerConfig {
  highRollThreshold?: number;
  lowRollThreshold?: number;
  biasFactor?: number;
  historyLimit?: number;
}

enum HistoryEntry {
  HIGH,
  LOW,
  NEUTRAL,
}

export class KarmicRandomizer extends Randomizer {
  private static readonly HistoryEntry = HistoryEntry;
  private historyQueue: HistoryEntry[] = [];
  historyLimit: number;
  highRollThreshold: number;
  lowRollThreshold: number;
  biasFactor: number;

  constructor({highRollThreshold, lowRollThreshold, biasFactor, historyLimit}: KarmicRandomizerConfig = {}) {
    //validate high roll / low roll
    super();
    this.historyLimit = historyLimit || 10;
    this.highRollThreshold = highRollThreshold || 0.8;
    this.lowRollThreshold = lowRollThreshold || 0.2;
    this.biasFactor = biasFactor || 0.2;
    this.historyLimit = historyLimit || 10;
  }

  protected generator(): number {
    const rawRoll = this.generateRawRoll();
    const biasedRoll = this.applyBias(this.biasFactor, rawRoll);
    const rollType = this.evaluateRoll(biasedRoll);

    // Update history and maintain the limit
    this.historyQueue.push(rollType);
    if (this.historyQueue.length > this.historyLimit) {
      this.historyQueue.shift();
    }

    return biasedRoll;
  }

  private applyBias(biasFactor: number, rawRoll: number): any {
    if (this.recentLowRolls > this.recentHighRolls) {
      return Math.min(1, rawRoll + biasFactor); // Skew slightly toward high
    } else if (this.recentHighRolls > this.recentLowRolls) {
      return Math.max(0, rawRoll - biasFactor); // Skew slightly toward low
    }
    return rawRoll;
  }

  get recentHighRolls() {
    return this.historyQueue.filter((entry) => entry === HistoryEntry.HIGH).length;
  }

  get recentLowRolls() {
    return this.historyQueue.filter((entry) => entry === HistoryEntry.LOW).length;
  }

  private evaluateRoll(rawRoll: number): HistoryEntry {
    if (rawRoll >= this.highRollThreshold) return HistoryEntry.HIGH;
    if (rawRoll <= this.lowRollThreshold) return HistoryEntry.LOW;
    return HistoryEntry.NEUTRAL;
  }

  private mapRollToRange(rawRoll: number, min: number, max: number): number {
    if (rawRoll >= 0.99) return max;
    if (rawRoll <= 0) return min;

    return Math.floor(rawRoll * (max - min + 1)) + min;
  }

  private generateRawRoll(): number {
    return Math.random();
  }
}
