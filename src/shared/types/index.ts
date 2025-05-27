export type PresenceStatus = 'online' | 'idle' | 'dnd';

export interface TimeInterval {
  start: string;
  end?: string;
}

export interface Project {
  clientName?: string;
  name?: string;
}

export interface WebhookPayload {
  timeInterval: TimeInterval;
  currentlyRunning: boolean;
  project?: Project;
}
