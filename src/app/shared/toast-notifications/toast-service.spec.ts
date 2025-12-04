import { TestBed } from '@angular/core/testing';

import { ToastService, type Toast } from './toast-service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with empty toasts array', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('should add a toast to the signal when show() is called', () => {
    const toast: Toast = { message: 'Test message' };
    service.show(toast);
    expect(service.toasts()).toEqual([toast]);
  });

  it('should add multiple toasts to the signal', () => {
    const toast1: Toast = { message: 'First message' };
    const toast2: Toast = { message: 'Second message' };
    service.show(toast1);
    service.show(toast2);
    expect(service.toasts()).toEqual([toast1, toast2]);
  });

  it('should remove a specific toast from the signal', () => {
    const toast1: Toast = { message: 'First message' };
    const toast2: Toast = { message: 'Second message' };
    service.show(toast1);
    service.show(toast2);
    service.remove(toast1);
    expect(service.toasts()).toEqual([toast2]);
  });

  it('should clear all toasts from the signal', () => {
    service.show({ message: 'First message' });
    service.show({ message: 'Second message' });
    service.clear();
    expect(service.toasts()).toEqual([]);
  });

  it('should not modify signal if removing non-existent toast', () => {
    const toast1: Toast = { message: 'First message' };
    const toast2: Toast = { message: 'Second message' };
    service.show(toast1);
    service.remove(toast2);
    expect(service.toasts()).toEqual([toast1]);
  });
});
