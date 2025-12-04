import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { form, Field, required, apply } from '@angular/forms/signals';

import type { RawTask, Task } from '@mbau/dtos';

import { taskDescriptionSchema, taskTitleSchema } from './validators';

@Component({
  selector: 'mbau-task-form',
  imports: [Field],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm {
  readonly task = input<Task>();
  readonly formCancel = output<void>();
  readonly formSubmit = output<RawTask>();

  readonly taskModel = signal<RawTask>({
    title: '',
    description: '',
    status: 'pending',
  });

  readonly form = form(this.taskModel, (schemaPath) => {
    apply(schemaPath.title, taskTitleSchema);
    apply(schemaPath.description, taskDescriptionSchema);

    required(schemaPath.status, { message: 'Status is required' });
  });

  readonly isTitleInvalid = computed(
    () => this.form.title().touched() && this.form.title().invalid()
  );
  readonly isDescriptionInvalid = computed(
    () => this.form.description().touched() && this.form.description().invalid()
  );
  readonly isStatusInvalid = computed(
    () => this.form.status().touched() && this.form.status().invalid()
  );

  constructor() {
    effect(() => {
      const task = this.task();
      if (typeof task !== 'undefined') {
        this.form().value.set({
          title: task.title,
          description: task.description,
          status: task.status,
        });
      }
    });
  }

  handleSubmit(event: Event) {
    event.preventDefault();

    this.formSubmit.emit(this.taskModel());
  }
}
