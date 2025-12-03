import type { Route } from '@angular/router';

import { TaskDetails } from '@mbau/task-management-feature-task-details';

import { taskResolver } from './resolvers/details-resolver';
import { taskTitleResolver } from './resolvers/task-title-resolver';

export const taskDetailsRoutes: Route[] = [
  {
    path: ':id',
    component: TaskDetails,
    title: taskTitleResolver,
    resolve: {
      task: taskResolver,
    },
    data: {
      navbarControl: 'back',
    },
  },
];
