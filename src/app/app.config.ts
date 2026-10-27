import {
    ApplicationConfig,
    provideZonelessChangeDetection,
    isDevMode,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import {
    provideClientHydration,
    withEventReplay,
    withIncrementalHydration,
} from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { baseUrlInterceptor } from './shared/interceptors/auth.interceptor';
import { responseInterceptor } from './shared/interceptors/response.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes,
            withInMemoryScrolling({
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled'
        })
        ),
        provideClientHydration(withEventReplay(), withIncrementalHydration()),
        provideHttpClient(withInterceptors([baseUrlInterceptor, responseInterceptor])),
        // offline trips: caches the app shell and trip API responses (production builds only)
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
        provideRouter(routes, withComponentInputBinding()),
    ],
};
