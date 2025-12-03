import { array, nullable, number, object } from 'zod/mini';

import { TaskValidator } from './task';

export const TaskResponseValidator = array(TaskValidator);
export const PaginatedTaskResponseValidator = object({
  first: number(),
  prev: nullable(number()),
  next: nullable(number()),
  last: nullable(number()),
  pages: number(),
  items: number(),
  data: TaskResponseValidator,
});
