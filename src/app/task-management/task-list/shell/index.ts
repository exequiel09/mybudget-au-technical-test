import type { Route } from '@angular/router';

import { TaskList } from '@mbau/task-management-feature-task-listing';

export const taskListRoutes: Route[] = [
  {
    path: '',
    title: 'Home',
    component: TaskList,
  },
];
