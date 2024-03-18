import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environment';
import { provideLottieOptions } from 'ngx-lottie';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(
      AuthModule.forRoot({
        ...environment.auth,
        httpInterceptor: {
          allowedList: [
            'http://localhost:8000/api',
            'http://localhost:8000/api/*',
            {
              uri: 'http://localhost:8000/api/*',
              tokenOptions: {
                authorizationParams: {
                  audience: 'http://localhost:8000/api',
                },
              },
            },
          ],
        },
      })
    ),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
    importProvidersFrom(HttpClientModule),
  ],
};
