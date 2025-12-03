import { computed, Directive, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  type Data,
  NavigationEnd,
  Router,
} from '@angular/router';

import { filter, map } from 'rxjs';

import { Navbar, type NavbarControl } from '../components/navbar/navbar';

@Directive({
  selector: '[mbauRouterBasedControl]',
})
export class RouterBasedControl {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _navbar = inject(Navbar);

  constructor() {
    const routerData = toSignal(
      this._router.events.pipe(
        filter((event) => event instanceof NavigationEnd),

        map(() => {
          let child = this._activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (child.snapshot.data) {
              return child.snapshot.data;
            } else {
              return null;
            }
          }
          return null;
        })
      ),
      {
        initialValue: <Data>{},
      }
    );

    const visibleControl = computed(() => {
      const data = routerData();

      if (data === null) {
        return 'search';
      }

      return <NavbarControl>(data['navbarControl'] ?? 'search');
    });

    effect(() => this._navbar.visibleControl.set(visibleControl()));
  }
}
