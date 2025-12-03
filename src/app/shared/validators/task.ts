import { iso, enum as enum_, object, string } from 'zod/mini';

export const TaskValidator = object({
  id: string(),
  title: string(),
  status: enum_(['Pending', 'In Progress', 'Done']),
  created_at: iso.date(),
  updated_at: iso.date(),
  description: string(),
});
