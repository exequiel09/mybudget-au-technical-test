import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  type ElementRef,
  inject,
  Injector,
  input,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import type { Task } from '@mbau/dtos';
import { TasksStore } from '@mbau/task-management-state';
import { StatusBadge } from '@mbau/ui-kit';

@Component({
  selector: 'mbau-task-details',
  imports: [DatePipe, StatusBadge],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetails {
  readonly task = input.required<Task>();

  private readonly _injector = inject(Injector);
  private readonly _router = inject(Router);
  private readonly _tasksStore = inject(TasksStore);

  private readonly _confirmDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('confirmDialog');

  constructor() {
    // Task will never be undefined unless deleted so we check if the task is already removed from the entity store
    effect(() => {
      const task = this._tasksStore.tasksEntityMap()[this.task().id];

      if (typeof task === 'undefined') {
        this._router.navigate(['/']);
      }
    });
  }

  showConfirmationModal() {
    this._confirmDialog().nativeElement.showModal();
  }

  handleDelete() {
    this._tasksStore.deleteTask(this.task, { injector: this._injector });
  }
}
