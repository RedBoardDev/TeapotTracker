import { InvalidTimeIntervalError } from '@shared/errors/domain.error.js';

export class TimeInterval {
  private readonly start: Date;
  private readonly end?: Date;

  constructor(start: string, end?: string) {
    this.start = new Date(start);
    if (end) {
      this.end = new Date(end);
    }
    this.validate();
  }

  private validate(): void {
    if (Number.isNaN(this.start.getTime())) {
      throw new InvalidTimeIntervalError('Invalid start date');
    }

    if (this.end && Number.isNaN(this.end.getTime())) {
      throw new InvalidTimeIntervalError('Invalid end date');
    }

    if (this.end && this.end <= this.start) {
      throw new InvalidTimeIntervalError('End date must be after start date');
    }
  }

  getStart(): Date {
    return this.start;
  }

  getEnd(): Date | undefined {
    return this.end;
  }

  isRunning(): boolean {
    return !this.end;
  }

  getStartTimestamp(): number {
    return this.start.getTime();
  }
}
