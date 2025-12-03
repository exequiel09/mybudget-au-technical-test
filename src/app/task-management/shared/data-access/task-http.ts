import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskHttp {
  private readonly _http = inject(HttpClient);

  getTasksEndpoint(page: number, pageSize: number) {
    return `/api/tasks?_page=${page}&_per_page=${pageSize}`;
  }

  getTaskDetailEndpoint(id: string) {
    return `/api/tasks/${id}`;
  }

  deleteTask(id: string) {
    return this._http.delete(`/api/tasks/${id}`);
  }
}
