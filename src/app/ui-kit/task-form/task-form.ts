import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { form, Field, required, minLength } from '@angular/forms/signals';

import type { RawTask, Task } from '@mbau/dtos';

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
    required(schemaPath.title, { message: 'Title is required' });
    minLength(schemaPath.title, 5, {
      message: 'Title should be minimum of 5 characters',
    });

    required(schemaPath.description, { message: 'Description is required' });
    minLength(schemaPath.description, 20, {
      message: 'Title should be minimum of 20 characters',
    });

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

  handleSubmit(event: Event) {
    event.preventDefault();

    this.formSubmit.emit(this.taskModel());
  }
}
