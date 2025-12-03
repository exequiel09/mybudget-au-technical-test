import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  type ElementRef,
  inject,
  Injector,
  model,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import type { RawTask, Task } from '@mbau/dtos';
import { TasksStore } from '@mbau/task-management-state';
import { StatusBadge, TaskForm } from '@mbau/ui-kit';

@Component({
  selector: 'mbau-task-details',
  imports: [DatePipe, StatusBadge, TaskForm],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetails {
  readonly task = model.required<Task>();

  private readonly _injector = inject(Injector);
  private readonly _router = inject(Router);
  private readonly _tasksStore = inject(TasksStore);

  private readonly _confirmDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('confirmDialog');
  private readonly _editTaskDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('editTaskDialog');

  constructor() {
    // Task will never be undefined unless deleted so we check if the task is already removed from the entity store
    effect(() => {
      const task = this._tasksStore.tasksEntityMap()[untracked(this.task).id];

      if (typeof task === 'undefined') {
        this._router.navigate(['/']);
        return;
      }

      this.task.set(task);
      this._editTaskDialog().nativeElement.close();
    });
  }

  showConfirmationModal() {
    this._confirmDialog().nativeElement.showModal();
  }

  handleDelete() {
    this._tasksStore.deleteTask(this.task, { injector: this._injector });
  }

  handleSubmitTask(task: RawTask) {
    this._tasksStore.updateTask(
      { id: this.task().id, payload: task },
      { injector: this._injector }
    );
  }
}
