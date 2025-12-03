import { httpResource } from '@angular/common/http';
import { computed, effect } from '@angular/core';

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
  entityConfig,
  type SelectEntityId,
  withEntities,
} from '@ngrx/signals/entities';

import type { Task } from '@mbau/dtos';
import { PaginatedTaskResponseValidator } from '@mbau/validators';

export const selectTaskId: SelectEntityId<Task> = (task: Task) => task.id;

export const tasksEntityConfig = entityConfig({
  entity: type<Task>(),
  collection: 'tasks',
  selectId: selectTaskId,
});

export const TasksStore = signalStore(
  { providedIn: 'root' },

  withState({
    _fetchListing: false,
    currentPage: 1,
    pageSize: 2,
    totalItems: 0,
    totalPages: 0,
  }),

  withEntities(tasksEntityConfig),

  withProps(({ currentPage, pageSize, _fetchListing }) => {
    const listingResource = httpResource(
      () =>
        _fetchListing()
          ? `/api/tasks?_page=${currentPage()}&_per_page=${pageSize()}`
          : undefined,
      {
        parse: PaginatedTaskResponseValidator.parse,
      }
    );

    return {
      _listingResource: listingResource,
      listingResource: listingResource.asReadonly(),
    };
  }),

  withComputed(({ _listingResource }) => ({
    currentPageItems: computed(() => _listingResource.value()?.data ?? []),
  })),

  withMethods((store) => ({
    loadListing(page = 1, pageSize = 2) {
      patchState(store, { _fetchListing: true, currentPage: page, pageSize });
    },
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
    },
  })
);

/** @see https://ngrx.io/guide/signals/faq */
export type TasksStore = InstanceType<typeof TasksStore>;
