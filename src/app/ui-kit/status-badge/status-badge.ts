import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Task } from '@mbau/dtos';

@Component({
  selector: 'mbau-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'badge',
    '[class.text-bg-warning]': "status() === 'in-progress'",
    '[class.text-warning-emphasis]': "status() === 'in-progress'",
    '[class.text-bg-secondary]': "status() === 'pending'",
    '[class.text-secondary-emphasis]': "status() === 'pending'",
    '[class.text-bg-success]': "status() === 'done'",
    '[class.text-success-emphasis]': "status() === 'done'",
  },
})
export class StatusBadge {
  readonly status = input.required<Task['status']>();
}
