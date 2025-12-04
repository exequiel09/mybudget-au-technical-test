import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  let component: StatusBadge;
  let fixture: ComponentFixture<StatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadge);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('status', 'in-progress');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect the correct status text', () => {
    expect(fixture.nativeElement.textContent).toContain('In Progress');
  });

  it('should reflect the correct class names on the host element', () => {
    expect(fixture.nativeElement.className).toContain('text-bg-warning');
    expect(fixture.nativeElement.className).toContain('text-warning-emphasis');
  });
});
