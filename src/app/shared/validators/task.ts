import { iso, enum as enum_, object, string, nullable } from 'zod/mini';

export const TaskValidator = object({
  id: string(),
  title: string(),
  status: enum_(['pending', 'in-progress', 'done']),
  created_at: iso.datetime(),
  updated_at: nullable(iso.datetime()),
  description: string(),
});
