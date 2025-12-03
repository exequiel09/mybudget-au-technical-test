import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  RedirectCommand,
  Router,
  type ActivatedRouteSnapshot,
  type ResolveFn,
  type RouterStateSnapshot,
} from '@angular/router';

import { catchError, filter, of, switchMap, take } from 'rxjs';

import type { Task } from '@mbau/dtos';
import { TasksStore } from '@mbau/task-management-state';

export const taskResolver: ResolveFn<Task> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const tasksStore = inject(TasksStore);

  const id = route.paramMap.get('id');
  if (id === null) {
    // TODO create a 404 page and integrate with it
    return new RedirectCommand(router.parseUrl('/'));
  }

  const matchedEntity = tasksStore.tasksEntityMap()[id];
  if (typeof matchedEntity !== 'undefined') {
    return matchedEntity;
  }

  tasksStore.getTaskById(id);

  return toObservable(tasksStore.detailsResource.status).pipe(
    filter((status) => status === 'resolved' || status === 'error'),

    switchMap(() => {
      const matchedEntity = tasksStore.tasksEntityMap()[id];

      if (typeof matchedEntity === 'undefined') {
        throw new Error('Task not loaded');
      }

      return of(matchedEntity);
    }),

    // TODO create a 404 page and integrate with it
    catchError(() => of(new RedirectCommand(router.parseUrl('/')))),

    take(1)
  );
};
