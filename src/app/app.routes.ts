import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@mbau/task-management-shell-task-listing').then(
        (module_) => module_.taskListRoutes
      ),
  },

  {
    path: 'details',
    loadChildren: () =>
      import('@mbau/task-management-shell-task-details').then(
        (module_) => module_.taskDetailsRoutes
      ),
  },
];
