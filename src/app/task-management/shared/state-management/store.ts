import { httpResource } from '@angular/common/http';
import { computed, effect, inject } from '@angular/core';

import {
  patchState,
  signalStore,
  type,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  addEntities,
  addEntity,
  entityConfig,
  removeEntity,
  type SelectEntityId,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, exhaustMap, pipe, tap } from 'rxjs';

import { TaskHttp } from '@mbau/task-management-data-access';
import type { Task } from '@mbau/dtos';
import { ToastService } from '@mbau/toast-notifications';
import {
  PaginatedTaskResponseValidator,
  TaskValidator,
} from '@mbau/validators';

import type { TasksStoreDefaultState } from './models';

export const selectTaskId: SelectEntityId<Task> = (task: Task) => task.id;

export const tasksEntityConfig = entityConfig({
  entity: type<Task>(),
  collection: 'tasks',
  selectId: selectTaskId,
});

export const TasksStore = signalStore(
  { providedIn: 'root' },

  withState<TasksStoreDefaultState>({
    _fetchListing: false,
    _fetchById: false,
    _requestedId: null,
    currentPage: 1,
    pageSize: 2,
    totalItems: 0,
    totalPages: 0,
  }),

  withEntities(tasksEntityConfig),

  withProps(
    ({ currentPage, pageSize, _fetchListing, _fetchById, _requestedId }) => {
      const taskHttp = inject(TaskHttp);
      const listingResource = httpResource(
        () =>
          _fetchListing()
            ? taskHttp.getTasksEndpoint(currentPage(), pageSize())
            : undefined,
        {
          parse: PaginatedTaskResponseValidator.parse,
        }
      );
      const detailsResource = httpResource(
        () => {
          const id = _requestedId();

          return _fetchById() && id !== null
            ? taskHttp.getTaskDetailEndpoint(id)
            : undefined;
        },
        {
          parse: TaskValidator.parse,
        }
      );

      return {
        _toastsService: inject(ToastService),
        _taskHttp: taskHttp,
        _detailsResource: detailsResource,
        detailsResource: detailsResource.asReadonly(),
        _listingResource: listingResource,
        listingResource: listingResource.asReadonly(),
      };
    }
  ),

  withComputed(({ _listingResource }) => ({
    currentPageItems: computed(() => _listingResource.value()?.data ?? []),
  })),

  withMethods((store) => ({
    loadListing(page = 1, pageSize = 2) {
      patchState(store, { _fetchListing: true, currentPage: page, pageSize });
    },

    getTaskById(id: string) {
      patchState(store, { _fetchById: true, _requestedId: id });
    },

    deleteTask: rxMethod<Task>(
      pipe(
        exhaustMap((task) =>
          store._taskHttp.deleteTask(task.id).pipe(
            tap(() => {
              patchState(store, removeEntity(task.id, tasksEntityConfig));

              store._toastsService.show({
                message: 'Task Deleted',
                classname: 'bg-success text-light',
                delay: 3000,
              });
            }),

            catchError(() => {
              store._toastsService.show({
                message: 'Unable to delete the task. Please try again later',
                classname: 'bg-danger text-light',
                delay: 3000,
              });

              return EMPTY;
            })
          )
        )
      )
    ),
  })),

  withHooks({
    onInit(store) {
      effect(() => {
        if (
          store._listingResource.status() === 'resolved' &&
          store._listingResource.hasValue()
        ) {
          const value = store._listingResource.value();

          patchState(store, addEntities(value.data, tasksEntityConfig), () => ({
            totalItems: value.items,
            totalPages: value.pages,
          }));
        }
      });

      effect(() => {
        if (
          store._detailsResource.status() === 'resolved' &&
          store._detailsResource.hasValue()
        ) {
          const value = store._detailsResource.value();

          patchState(store, addEntity(value, tasksEntityConfig));
        }
      });
    },
  })
);

/** @see https://ngrx.io/guide/signals/faq */
export type TasksStore = InstanceType<typeof TasksStore>;
