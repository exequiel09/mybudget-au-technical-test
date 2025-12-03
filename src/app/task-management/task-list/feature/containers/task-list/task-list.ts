import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, type Params, Router } from '@angular/router';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap/pagination';
import { tap } from 'rxjs';

import { type SortOptionKey, TasksStore } from '@mbau/task-management-state';

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

  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  constructor() {
    this._activatedRoute.queryParams
      .pipe(
        tap((queryParams) => {
          const page = +(queryParams['page'] ?? '1');

          this.tasksStore.loadListing(page);

          if (typeof queryParams['sort'] !== 'undefined') {
            this.tasksStore.setSort(queryParams['sort']);
          }

          if (typeof queryParams['search'] !== 'undefined') {
            const trimmed = queryParams['search'].trim();

            this.tasksStore.setSearch(trimmed.length > 0 ? trimmed : null);
          }
        }),

        takeUntilDestroyed()
      )
      .subscribe();
  }

  handlePageChange(page: number) {
    this._updateQueryParams({
      page,
    });
  }

  handleSortChange(sortBy: SortOptionKey) {
    this._updateQueryParams({
      sort: sortBy,
    });
  }

  private _updateQueryParams(params: Params) {
    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: params,
    });
  }
}
