import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Task } from '@mbau/dtos';
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
}
