import { GatewayIntentBits } from 'discord.js';
import type { ClientOptions } from 'discord.js';

export const discordConfig: ClientOptions = {
  intents: [GatewayIntentBits.Guilds],
  presence: {
    status: 'dnd',
    activities: [],
  },
};
