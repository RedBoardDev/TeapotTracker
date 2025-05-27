import { ActivityType as DiscordActivityType } from 'discord.js';

export class ActivityType {
  constructor(private readonly value: DiscordActivityType) {}

  getValue(): DiscordActivityType {
    return this.value;
  }

  equals(other: ActivityType): boolean {
    return this.value === other.value;
  }

  static custom(): ActivityType {
    return new ActivityType(DiscordActivityType.Custom);
  }

  static playing(): ActivityType {
    return new ActivityType(DiscordActivityType.Playing);
  }

  static streaming(): ActivityType {
    return new ActivityType(DiscordActivityType.Streaming);
  }

  static listening(): ActivityType {
    return new ActivityType(DiscordActivityType.Listening);
  }

  static watching(): ActivityType {
    return new ActivityType(DiscordActivityType.Watching);
  }

  static competing(): ActivityType {
    return new ActivityType(DiscordActivityType.Competing);
  }
}
