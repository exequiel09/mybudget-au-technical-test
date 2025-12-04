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
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, exhaustMap, pipe, tap } from 'rxjs';

import { TaskHttp } from '@mbau/task-management-data-access';
import type { RawTask, Task } from '@mbau/dtos';
import { ToastService } from '@mbau/toast-notifications';
import { TaskResponseValidator, TaskValidator } from '@mbau/validators';

import type { SortOptionKey, TasksStoreDefaultState } from './models';

export const selectTaskId: SelectEntityId<Task> = (task: Task) => task.id;

export const tasksEntityConfig = entityConfig({
  entity: type<Task>(),
  collection: 'tasks',
  selectId: selectTaskId,
});

const DEFAULT_PAGE_SIZE = 10;

export const TasksStore = signalStore(
  { providedIn: 'root' },

  withState<TasksStoreDefaultState>({
    _fetchListing: false,
    _fetchById: false,
    _requestedId: null,
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'title',
    searchQuery: null,
  }),

  withEntities(tasksEntityConfig),

  withProps(({ _fetchListing, _fetchById, _requestedId }) => {
    const taskHttp = inject(TaskHttp);
    const listingResource = httpResource(
      () => (_fetchListing() ? taskHttp.getTasksEndpoint() : undefined),
      {
        parse: TaskResponseValidator.parse,
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
  }),

  withComputed(
    ({ tasksEntities, currentPage, pageSize, sortBy, searchQuery }) => {
      const matchedItems = computed(() => {
        const searchQueryStr = searchQuery();
        let entities = tasksEntities();
        if (searchQueryStr !== null) {
          entities = tasksEntities().filter(
            (task) => task.title.search(new RegExp(searchQueryStr, 'i')) > -1
          );
        }

        return entities;
      });

      return {
        currentPageItems: computed(() => {
          const startIndex = (currentPage() - 1) * pageSize();
          const endIndex = startIndex + pageSize();
          const sortByProp = sortBy();

          return matchedItems()
            .sort((taskA, taskB) => {
              if (sortByProp === 'status') {
                return taskA.status > taskB.status ? 1 : -1;
              }

              if (sortByProp === 'date-created') {
                return taskA.created_at > taskB.created_at ? 1 : -1;
              }

              return taskA.title > taskB.title ? 1 : -1;
            })
            .slice(startIndex, endIndex);
        }),

        totalItems: computed(() => matchedItems().length),

        totalPages: computed(() =>
          Math.ceil(matchedItems().length / pageSize())
        ),
      };
    }
  ),

  withMethods((store) => ({
    loadListing(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
      patchState(store, { _fetchListing: true, currentPage: page, pageSize });
    },

    getTaskById(id: string) {
      patchState(store, { _fetchById: true, _requestedId: id });
    },

    setPage(page: number) {
      patchState(store, { currentPage: page });
    },

    setSearch(query: string | null) {
      patchState(store, { searchQuery: query });
    },

    setSort(sortBy: SortOptionKey) {
      patchState(store, { sortBy });
    },

    addTask: rxMethod<RawTask>(
      pipe(
        exhaustMap((task) =>
          store._taskHttp.addTask(task).pipe(
            tap((task) => {
              patchState(store, addEntity(task, tasksEntityConfig));

              store._toastsService.show({
                message: 'Task Created',
                classname: 'bg-success text-light',
                delay: 3000,
              });
            }),

            catchError(() => {
              store._toastsService.show({
                message: 'Unable to add task. Please try again later',
                classname: 'bg-danger text-light',
                delay: 3000,
              });

              return EMPTY;
            })
          )
        )
      )
    ),

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

    updateTask: rxMethod<{ id: string; payload: RawTask }>(
      pipe(
        exhaustMap(({ id, payload }) =>
          store._taskHttp.updateTask(id, payload).pipe(
            tap(() => {
              patchState(
                store,
                updateEntity({ id, changes: payload }, tasksEntityConfig)
              );

              store._toastsService.show({
                message: 'Task Updated',
                classname: 'bg-success text-light',
                delay: 3000,
              });
            }),

            catchError(() => {
              store._toastsService.show({
                message: 'Unable to update task. Please try again later',
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

          patchState(store, addEntities(value, tasksEntityConfig));
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
