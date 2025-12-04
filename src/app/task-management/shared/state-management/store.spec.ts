import { randomUUID } from 'node:crypto';

import { TestBed } from '@angular/core/testing';

import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { of } from 'rxjs';

import { TaskHttp } from '@mbau/task-management-data-access';
import { ToastService } from '@mbau/toast-notifications';
import type { RawTask, Task } from '@mbau/dtos';

import { TasksStore } from './store';

const MockTaskHttp = {
  getTasksEndpoint: () => {
    return `/api/tasks`;
  },

  getTaskDetailEndpoint: (id: string) => {
    return `/api/tasks/${id}`;
  },

  addTask: vi.fn((task: RawTask) =>
    of<Task>({
      ...task,
      id: randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: null,
    })
  ),
  updateTask: vi.fn((id: string, task: RawTask) =>
    of({ ...task, id, updated_at: new Date().toISOString() })
  ),
  deleteTask: vi.fn(() => of({})),
};

describe('TasksStore', () => {
  let store: TasksStore;
  let toastService: ToastService;
  let taskHttp: TaskHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksStore, { provide: TaskHttp, useValue: MockTaskHttp }],
    });

    store = TestBed.inject(TasksStore);
    taskHttp = TestBed.inject(TaskHttp);
    toastService = TestBed.inject(ToastService);
  });

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  describe('Computeds', () => {
    beforeEach(() => {
      patchState(unprotected(store), {
        pageSize: 1,
        currentPage: 1,
        tasksEntityMap: {
          1: {
            id: '1',
            title: 'Dummy Task 1',
            description: 'This is a dummy task',
            status: 'done',
            created_at: '2025-12-03T08:20:48.188Z',
            updated_at: '2025-12-04T05:38:41.546Z',
          },
          2: {
            id: '2',
            title: 'Dummy Task 2',
            description: 'This is a dummy task',
            status: 'done',
            created_at: '2025-12-03T08:20:48.188Z',
            updated_at: '2025-12-03T08:20:48.188Z',
          },
        },
        tasksIds: ['1', '2'],
      });
    });

    it('should return the correct number of items (without search)', () => {
      expect(store.totalItems()).toBe(2);
    });

    it('should return the correct number of items (with search)', () => {
      patchState(unprotected(store), { searchQuery: 'Task 2' });

      expect(store.totalItems()).toBe(1);

      patchState(unprotected(store), { searchQuery: 'non-existent' });

      expect(store.totalItems()).toBe(0);
    });

    it('should return the correct number pages', () => {
      expect(store.totalPages()).toBe(2);
    });

    it('should return the current page items', () => {
      let items = store.currentPageItems();

      expect(items.length).toBe(1);
      expect(items[0].id).toBe('1');

      patchState(unprotected(store), { currentPage: 2 });
      items = store.currentPageItems();

      expect(items.length).toBe(1);
      expect(items[0].id).toBe('2');
    });
  });

  describe('Methods', () => {
    it('should add a new task', () => {
      vi.spyOn(toastService, 'show');

      expect(store.totalItems()).toBe(0);

      store.addTask({
        title: 'Dummy Task 3',
        description: 'This is a dummy task',
        status: 'done',
      });

      expect(store.totalItems()).toBe(1);
      expect(taskHttp.addTask).toHaveBeenCalledOnce();
      expect(toastService.show).toHaveBeenCalledOnce();
    });

    it('should update an existing task', () => {
      vi.spyOn(toastService, 'show');
      patchState(unprotected(store), {
        tasksEntityMap: {
          1: {
            id: '1',
            title: 'Dummy Task 1',
            description: 'This is a dummy task',
            status: 'pending',
            created_at: '2025-12-03T08:20:48.188Z',
            updated_at: '2025-12-04T05:38:41.546Z',
          },
        },
        tasksIds: ['1'],
      });

      store.updateTask({
        id: '1',
        payload: {
          title: 'Dummy Task 1 (updated)',
          description: 'This is a dummy task ',
          status: 'done',
        },
      });

      expect(store.tasksEntityMap()['1'].title).toContain('updated');
      expect(store.tasksEntityMap()['1'].status).toContain('done');
      expect(taskHttp.updateTask).toHaveBeenCalledOnce();
      expect(toastService.show).toHaveBeenCalledOnce();
    });

    it('should delete a task', () => {
      const task: Task = {
        id: '1',
        title: 'Dummy Task 1',
        description: 'This is a dummy task',
        status: 'pending',
        created_at: '2025-12-03T08:20:48.188Z',
        updated_at: '2025-12-04T05:38:41.546Z',
      };

      vi.spyOn(toastService, 'show');
      patchState(unprotected(store), {
        tasksEntityMap: {
          1: task,
        },
        tasksIds: ['1'],
      });

      store.deleteTask(task);

      expect(store.tasksEntities().length).toBe(0);
      expect(taskHttp.deleteTask).toHaveBeenCalledOnce();
      expect(toastService.show).toHaveBeenCalledOnce();
    });
  });
});
