import { Directive, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { map, filter, take } from 'rxjs';

import { Navbar } from '../components/navbar/navbar';

@Directive({
  selector: '[mbauPrepopulateSearch]',
})
export class PrepopulateSearch {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _navbar = inject(Navbar);

  constructor() {
    const searchQuery = toSignal(
      this._activatedRoute.queryParams.pipe(
        map((params) => params['search'] ?? ''),

        filter((query) => query !== ''),

        take(1)
      ),
      {
        initialValue: '',
      }
    );

    effect(() => this._navbar.searchQuery.set(searchQuery()));
  }
}
