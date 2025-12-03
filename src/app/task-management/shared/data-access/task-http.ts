import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { RawTask, Task } from '@mbau/dtos';

@Injectable({
  providedIn: 'root',
})
export class TaskHttp {
  private readonly _http = inject(HttpClient);

  getTasksEndpoint() {
    return `/api/tasks`;
  }

  getTaskDetailEndpoint(id: string) {
    return `/api/tasks/${id}`;
  }

  addTask(rawTask: RawTask) {
    const payload: Omit<Task, 'id'> = {
      ...rawTask,
      created_at: new Date().toISOString(),
      updated_at: null,
    };

    return this._http.post<Task>(`/api/tasks`, payload);
  }

  updateTask(id: string, rawTask: RawTask) {
    const payload: Omit<Task, 'id' | 'created_at'> = {
      ...rawTask,
      updated_at: new Date().toISOString(),
    };

    return this._http.patch<Task>(`/api/tasks/${id}`, payload);
  }

  deleteTask(id: string) {
    return this._http.delete(`/api/tasks/${id}`);
  }
}
