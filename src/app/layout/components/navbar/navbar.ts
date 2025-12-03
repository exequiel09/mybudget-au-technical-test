import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NavbarControl = 'search' | 'back';

@Component({
  selector: 'mbau-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  readonly visibleControl = input<NavbarControl>('search');
}
