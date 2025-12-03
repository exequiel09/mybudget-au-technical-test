import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Task } from '@mbau/dtos';
import { StatusBadge } from '@mbau/ui-kit';

@Component({
  selector: 'mbau-task-card',
  imports: [RouterLink, StatusBadge],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
  readonly task = input.required<Task>();
}
