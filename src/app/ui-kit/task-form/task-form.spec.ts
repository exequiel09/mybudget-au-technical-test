import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskForm } from './task-form';

describe('TaskForm', () => {
  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;
  let host: HTMLElement;

  // helper to focus+blur an element so the field becomes "touched"
  async function touch(element: HTMLElement) {
    element.focus();
    element.dispatchEvent(new Event('focus'));
    element.blur();
    element.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  describe('Title Control', () => {
    let titleGroup: HTMLElement;
    let titleInput: HTMLInputElement;

    beforeEach(() => {
      titleGroup = host.querySelector<HTMLElement>(
        '[data-testid="task-form_title__control"]'
      );

      titleInput = titleGroup.querySelector<HTMLInputElement>(
        '#mbau_task-title_txt'
      );
    });

    it('should show invalid-feedback and adds is-invalid class for title when touched and invalid', async () => {
      expect(titleInput).toBeTruthy();

      // initial value is empty; touching should mark it touched and validators should make it invalid
      await touch(titleInput);

      // class should be present
      expect(titleInput.classList.contains('is-invalid')).toBe(true);

      // invalid-feedback for the title is inside the first title control group
      const feedback =
        titleGroup.querySelector<HTMLElement>('.invalid-feedback');
      expect(feedback).not.toBeNull();
      expect(feedback.textContent.trim().length).toBeGreaterThan(0);
    });

    it('should not show invalid-feedback and is-invalid when a valid value is entered', async () => {
      expect(titleInput).toBeTruthy();

      // enter a valid value
      titleInput.value = 'A valid title';
      titleInput.dispatchEvent(new Event('input'));
      await touch(titleInput); // touch after input to trigger touched state and re-validation

      // class should NOT be present now
      expect(titleInput.classList.contains('is-invalid')).toBe(false);

      const feedback =
        titleGroup.querySelector<HTMLElement>('.invalid-feedback');

      expect(feedback).toBeNull();
    });
  });

  it('should show invalid-feedback and adds is-invalid class for description when touched and invalid', async () => {
    const descGroup = host.querySelector<HTMLElement>(
      '[data-testid="task-form_description__control"]'
    );
    const descriptionTextarea = descGroup.querySelector<HTMLTextAreaElement>(
      '#mbau_task-description_ta'
    );
    expect(descriptionTextarea).toBeTruthy();

    await touch(descriptionTextarea);

    expect(descriptionTextarea.classList.contains('is-invalid')).toBe(true);

    // invalid-feedback for the description is inside the second description control group
    const feedback = descGroup.querySelector<HTMLElement>('.invalid-feedback');
    expect(feedback).not.toBeNull();
    expect(feedback.textContent.trim().length).toBeGreaterThan(0);
  });
});
