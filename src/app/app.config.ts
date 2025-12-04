import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';

import { DefaultTitleStrategy } from '@mbau/core';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withRouterConfig({ resolveNavigationPromiseOnError: true })
    ),
    {
      provide: TitleStrategy,
      useClass: DefaultTitleStrategy,
    },
  ],
};
