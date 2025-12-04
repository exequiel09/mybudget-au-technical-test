import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { TasksStore } from '@mbau/task-management-state';

import { TaskList } from './task-list';

@Component({
  selector: 'mbau-test-root',
  template: '<router-outlet />',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestRoot {}

describe('TaskList', () => {
  let component: TestRoot;
  let fixture: ComponentFixture<TestRoot>;
  let routerHarness: RouterTestingHarness;
  let store: TasksStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestRoot],
      providers: [
        provideRouter([
          {
            path: '',
            component: TaskList,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestRoot);
    component = fixture.componentInstance;
    routerHarness = await RouterTestingHarness.create();

    store = TestBed.inject(TasksStore);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should trigger loading of tasks', async () => {
    vi.spyOn(store, 'loadListing');

    await routerHarness.navigateByUrl('/');

    fixture.detectChanges();

    expect(store.loadListing).toHaveBeenCalledOnce();
    expect(store.loadListing).toHaveBeenCalledWith(1);
  });

  it('should trigger filtering of tasks', async () => {
    vi.spyOn(store, 'setSearch');

    await routerHarness.navigateByUrl('/?search=Anime');

    fixture.detectChanges();

    expect(store.setSearch).toHaveBeenCalledOnce();
    expect(store.setSearch).toHaveBeenCalledWith('Anime');
  });

  it('should trigger sorting of tasks', async () => {
    vi.spyOn(store, 'setSort');

    await routerHarness.navigateByUrl('/?sort=status');

    fixture.detectChanges();

    expect(store.setSort).toHaveBeenCalledOnce();
    expect(store.setSort).toHaveBeenCalledWith('status');
  });
});
