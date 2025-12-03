import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination';

import { TasksStore } from '@mbau/task-management-state';

import { SortControl } from '../../components/sort-control/sort-control';
import { TaskCard } from '../../components/task-card/task-card';

@Component({
  selector: 'mbau-task-list',
  imports: [NgbPaginationModule, SortControl, TaskCard],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskList {
  readonly tasksStore = inject(TasksStore);

  constructor() {
    this.tasksStore.loadListing();
  }
}
