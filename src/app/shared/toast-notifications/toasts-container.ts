import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap/toast';

import { ToastService } from './toast-service';

@Component({
  selector: 'mbau-toasts',
  imports: [NgbToastModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (toast of toastService.toasts(); track toast) {
    <ngb-toast
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      @if (toast.template) {
      <ng-template [ngTemplateOutlet]="toast.template"></ng-template>
      } @else {
      {{ toast.message ?? 'Unknown message' }}
      }
    </ngb-toast>
    }
  `,
  host: {
    class: 'toast-container position-fixed bottom-0 end-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastsContainer {
  readonly toastService = inject(ToastService);
}
