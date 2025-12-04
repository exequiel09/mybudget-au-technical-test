import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Navbar } from '../components/navbar/navbar';
import { RouterBasedControl } from './router-based-control';

@Component({
  selector: 'mbau-test-navbar',
  template: '{{ visibleControl() }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestNavbar {
  readonly visibleControl = signal<string>('search');
}

@Component({
  selector: 'mbau-test-routed',
  template: '<span>routed</span>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestRouted {}

@Component({
  selector: 'mbau-test-root',
  template: '<mbau-test-navbar mbauRouterBasedControl /> <router-outlet />',
  imports: [RouterBasedControl, TestNavbar, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestRoot {}

describe('RouterBasedControl', () => {
  let component: TestRoot;
  let fixture: ComponentFixture<TestRoot>;
  let routerHarness: RouterTestingHarness;
  let navbarComponent: Navbar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestRoot],
      providers: [
        provideRouter([
          {
            path: '',
            component: TestRouted,
          },
          {
            path: 'demo',
            component: TestRouted,
            data: {
              navbarControl: 'back',
            },
          },
        ]),
        {
          provide: Navbar,
          useClass: TestNavbar,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestRoot);
    navbarComponent = TestBed.inject(Navbar);
    component = fixture.componentInstance;
    routerHarness = await RouterTestingHarness.create();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should default to search', async () => {
    await routerHarness.navigateByUrl('');

    fixture.detectChanges();

    expect(navbarComponent.visibleControl()).toContain('search');
    expect(fixture.nativeElement.textContent).toContain('search');
  });

  it('should set the navbar visible control the new route data property', async () => {
    expect(navbarComponent.visibleControl()).toContain('search');

    await routerHarness.navigateByUrl('/demo');

    fixture.detectChanges();

    expect(navbarComponent.visibleControl()).toContain('back');
  });
});
