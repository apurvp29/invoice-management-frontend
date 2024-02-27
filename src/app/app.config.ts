import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  RouterModule,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(RouterModule.forChild(routes)),

    importProvidersFrom(HttpClientModule),
  ],
};
