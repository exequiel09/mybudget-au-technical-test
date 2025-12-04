import {
  iso,
  enum as enum_,
  object,
  string,
  nullable,
  minLength,
} from 'zod/mini';

export const TASK_TITLE_MIN_LENGTH = 5;
export const TASK_DESCRIPTION_MIN_LENGTH = 20;

export const TaskValidator = object({
  id: string(),
  title: string().check(minLength(TASK_TITLE_MIN_LENGTH)),
  status: enum_(['pending', 'in-progress', 'done']),
  created_at: iso.datetime(),
  updated_at: nullable(iso.datetime()),
  description: string().check(minLength(TASK_DESCRIPTION_MIN_LENGTH)),
});
