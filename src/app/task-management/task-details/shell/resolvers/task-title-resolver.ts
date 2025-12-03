import {
  type ResolveFn,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
  RedirectCommand,
} from '@angular/router';

import { defer, isObservable, map } from 'rxjs';

import type { Task } from '@mbau/dtos';

import { taskResolver } from './details-resolver';

const unpackValue = (value: RedirectCommand | Task) => {
  if (value instanceof RedirectCommand) {
    return value;
  }

  return value.title;
};

export const taskTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const value = taskResolver(route, state);

  if (isObservable(value) || value instanceof Promise) {
    return defer(() => value).pipe(map((val) => unpackValue(val)));
  }

  return unpackValue(value);
};
