import {
    ApplicationConfig,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import {
    provideClientHydration,
    withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
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
        provideClientHydration(withEventReplay()),
        provideHttpClient(withInterceptors([baseUrlInterceptor, responseInterceptor])),
        provideRouter(routes, withComponentInputBinding()),
    ],
};
