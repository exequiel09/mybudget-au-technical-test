import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  type Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, map, Subject, take, tap, throttleTime } from 'rxjs';

export type NavbarControl = 'search' | 'back';

@Component({
  selector: 'mbau-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  readonly searchQuery: Signal<string>;

  readonly visibleControl = input<NavbarControl>('search');

  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  private readonly _search$ = new Subject<string>();

  constructor() {
    this.searchQuery = toSignal(
      this._activatedRoute.queryParams.pipe(
        map((params) => params['search'] ?? ''),

        filter((query) => query !== ''),

        take(1)
      ),
      {
        initialValue: '',
      }
    );

    this._search$
      .asObservable()
      .pipe(
        throttleTime(50),

        tap((value) => {
          this._router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParamsHandling: 'merge',
            queryParams: {
              search: value,
            },
          });
        }),

        takeUntilDestroyed()
      )
      .subscribe();
  }

  handleSearch(event: KeyboardEvent) {
    this._search$.next((event.target as HTMLInputElement).value);
  }
}
