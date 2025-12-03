import type { Route } from '@angular/router';

import { TaskDetails } from '@mbau/task-management-feature-task-details';

import { taskResolver } from './resolvers/details-resolver';

export const taskDetailsRoutes: Route[] = [
  {
    path: ':id',
    component: TaskDetails,
    resolve: {
      task: taskResolver,
    },
  },
];
