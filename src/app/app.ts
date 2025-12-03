import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar, RouterBasedControl } from '@mbau/layout';
import { ToastsContainer } from '@mbau/toast-notifications';

@Component({
  imports: [Navbar, RouterBasedControl, RouterOutlet, ToastsContainer],
  selector: 'mbau-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
