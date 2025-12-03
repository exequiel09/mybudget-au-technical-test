import type { Route } from '@angular/router';

import { TaskDetails } from '@mbau/task-management-feature-task-details';

export const taskDetailsRoutes: Route[] = [
  {
    path: ':id',
    component: TaskDetails,
  },
];
