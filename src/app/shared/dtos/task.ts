import type { output } from 'zod/mini';

import type { TaskValidator } from '@mbau/validators';

export type Task = output<typeof TaskValidator>;
export type RawTask = Pick<Task, 'title' | 'description' | 'status'>;
