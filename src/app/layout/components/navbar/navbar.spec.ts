import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the query parameter when the handleSearch is invoked', () => {
    vi.spyOn(router, 'navigate');

    const mockInput = document.createElement('input');
    mockInput.value = 'test query';

    const event = new KeyboardEvent('keyup', {
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: mockInput });

    component.handleSearch(event);

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { search: 'test query', page: 1 },
      })
    );
  });
});
