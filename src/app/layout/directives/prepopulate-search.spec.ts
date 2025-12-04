import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Navbar } from '../components/navbar/navbar';
import { PrepopulateSearch } from './prepopulate-search';

@Component({
  selector: 'mbau-test-navbar',
  template: '{{ searchQuery() }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestNavbar {
  readonly searchQuery = signal<string>('');
}

@Component({
  selector: 'mbau-test-routed',
  template: '<span>routed</span>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestRouted {}

@Component({
  selector: 'mbau-test-root',
  template: '<mbau-test-navbar mbauPrepopulateSearch /> <router-outlet />',
  imports: [PrepopulateSearch, TestNavbar, RouterOutlet],
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

  it('should populate the searchQuery signal', async () => {
    const searchValue = 'Anime';
    await routerHarness.navigateByUrl(`/?search=${searchValue}`);

    fixture.detectChanges();

    expect(navbarComponent.searchQuery()).toBe(searchValue);
  });
});
