import { InvalidActivityError } from '@shared/errors/domain.error.js';

export class ActivityEntity {
  constructor(
    private readonly name: string,
    private readonly type: number,
    private readonly startTimestamp?: number,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new InvalidActivityError('Activity name cannot be empty');
    }

    if (this.startTimestamp && this.startTimestamp > Date.now()) {
      throw new InvalidActivityError('Start timestamp cannot be in the future');
    }
  }

  getName(): string {
    return this.name;
  }

  getType(): number {
    return this.type;
  }

  getStartTimestamp(): number | undefined {
    return this.startTimestamp;
  }

  toDiscordActivity(): { name: string; type: number; startTimestamp?: number } {
    return {
      name: this.name,
      type: this.type,
      ...(this.startTimestamp && { startTimestamp: this.startTimestamp }),
    };
  }
}
