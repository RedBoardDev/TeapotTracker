import type { PresenceStatus } from '@shared/types/index.js';
import { InvalidBotStatusError } from '@shared/errors/domain.error.js';

export class BotStatus {
  private static readonly VALID_STATUSES: PresenceStatus[] = ['online', 'idle', 'dnd'];

  constructor(private readonly value: PresenceStatus) {
    this.validate();
  }

  private validate(): void {
    if (!BotStatus.VALID_STATUSES.includes(this.value)) {
      throw new InvalidBotStatusError(`Invalid status: ${this.value}`);
    }
  }

  getValue(): PresenceStatus {
    return this.value;
  }

  equals(other: BotStatus): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static online(): BotStatus {
    return new BotStatus('online');
  }

  static idle(): BotStatus {
    return new BotStatus('idle');
  }

  static dnd(): BotStatus {
    return new BotStatus('dnd');
  }
}
