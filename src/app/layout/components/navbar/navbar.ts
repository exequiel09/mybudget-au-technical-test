import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Subject, tap, throttleTime } from 'rxjs';

export type NavbarControl = 'search' | 'back';

@Component({
  selector: 'mbau-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  readonly searchQuery = model('');
  readonly visibleControl = model<NavbarControl>('search');

  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  private readonly _search$ = new Subject<string>();

  constructor() {
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
              page: 1,
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
