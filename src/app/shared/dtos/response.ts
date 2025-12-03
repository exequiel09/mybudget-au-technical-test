import type { output } from 'zod/mini';

import type {
  PaginatedTaskResponseValidator,
  TaskResponseValidator,
} from '@mbau/validators';

export type TaskResponse = output<typeof TaskResponseValidator>;
export type PaginatedTaskResponse = output<
  typeof PaginatedTaskResponseValidator
>;
