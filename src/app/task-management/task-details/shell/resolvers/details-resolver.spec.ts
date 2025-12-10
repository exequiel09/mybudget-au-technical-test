import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  convertToParamMap,
  RedirectCommand,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
} from '@angular/router';

import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { firstValueFrom, Observable } from 'rxjs';

import type { Task } from '@mbau/dtos';
import { TasksStore } from '@mbau/task-management-state';

import { taskResolver } from './details-resolver';

const task: Task = {
  id: '1',
  title: 'Dummy Task 1',
  description: 'This is a dummy task',
  status: 'pending',
  created_at: '2025-12-03T08:20:48.188Z',
  updated_at: '2025-12-04T05:38:41.546Z',
};

describe('Tasks Details Resolver', () => {
  let appRef: ApplicationRef;
  let httpController: HttpTestingController;
  let store: TasksStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksStore, provideHttpClient(), provideHttpClientTesting()],
    });

    appRef = TestBed.inject(ApplicationRef);
    httpController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(TasksStore);
  });

  it('should return an existing item from the tasks store', () => {
    patchState(unprotected(store), {
      tasksEntityMap: {
        1: task,
      },
      tasksIds: ['1'],
    });

    const resolvedValue = TestBed.runInInjectionContext(() => {
      const mockRoute = {
        params: { id: 1 },
        paramMap: convertToParamMap({ id: 1 }),
      } as unknown as ActivatedRouteSnapshot;

      return taskResolver(mockRoute, {} as RouterStateSnapshot);
    });

    expect(resolvedValue).not.toBeInstanceOf(RedirectCommand);
    expect(resolvedValue).not.toBeInstanceOf(Promise);
    expect(resolvedValue).not.toBeInstanceOf(Observable);
    expect(resolvedValue).toBe(task);
  });

  it('should return a redirect command if route snapshot is malformed', () => {
    patchState(unprotected(store), {
      tasksEntityMap: {
        1: task,
      },
      tasksIds: ['1'],
    });

    const resolvedValue = TestBed.runInInjectionContext(() => {
      const mockRoute = {
        params: {},
        paramMap: convertToParamMap({}),
      } as unknown as ActivatedRouteSnapshot;

      return taskResolver(mockRoute, {} as RouterStateSnapshot);
    });

    expect(resolvedValue).not.toBeInstanceOf(Observable);
    expect(resolvedValue).not.toBeInstanceOf(Promise);
    expect(resolvedValue).toBeInstanceOf(RedirectCommand);
  });

  it('should remotely fetch the data if not available on the store', async () => {
    vi.spyOn(store, 'getTaskById');

    expect(store.detailsResource.status()).toEqual('idle');

    const resolvedValue = TestBed.runInInjectionContext(() => {
      const mockRoute = {
        params: { id: 1 },
        paramMap: convertToParamMap({ id: 1 }),
      } as unknown as ActivatedRouteSnapshot;

      return taskResolver(mockRoute, {} as RouterStateSnapshot);
    });

    expect(resolvedValue).not.toBeInstanceOf(RedirectCommand);
    expect(resolvedValue).not.toBeInstanceOf(Promise);
    expect(resolvedValue).toBeInstanceOf(Observable);
    expect(store.getTaskById).toHaveBeenCalled();

    // trigger the `httpResource`
    appRef.tick();

    // ensure that we're flushing the http requests with data
    httpController.expectOne(`/api/tasks/${task.id}`).flush(task);

    await appRef.whenStable();

    const fromRemote = await firstValueFrom(<Observable<Task>>resolvedValue);

    expect(store.detailsResource.status()).toEqual('resolved');
    expect(store.detailsResource.value()).toEqual(task);
    expect(fromRemote).toEqual(task);
  });

  it('should return a redirect command if the data exists does not exist on remote ', async () => {
    vi.spyOn(store, 'getTaskById');

    expect(store.detailsResource.status()).toEqual('idle');

    const resolvedValue = TestBed.runInInjectionContext(() => {
      const mockRoute = {
        params: { id: 1 },
        paramMap: convertToParamMap({ id: 1 }),
      } as unknown as ActivatedRouteSnapshot;

      return taskResolver(mockRoute, {} as RouterStateSnapshot);
    });

    expect(resolvedValue).not.toBeInstanceOf(RedirectCommand);
    expect(resolvedValue).not.toBeInstanceOf(Promise);
    expect(resolvedValue).toBeInstanceOf(Observable);
    expect(store.getTaskById).toHaveBeenCalled();

    // trigger the `httpResource`
    appRef.tick();

    // ensure that we're flushing the http requests with data
    httpController
      .expectOne(`/api/tasks/${task.id}`)
      .flush({}, { status: 404, statusText: 'Task not found' });

    await appRef.whenStable();

    const fromRemote = await firstValueFrom(
      <Observable<RedirectCommand>>resolvedValue
    );

    expect(store.detailsResource.status()).toEqual('error');
    expect(fromRemote).toBeInstanceOf(RedirectCommand);
  });
});
