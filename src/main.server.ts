import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (bootstrapContext: BootstrapContext) => bootstrapApplication(AppComponent, {...config, providers: [ ...config.providers]}, bootstrapContext);

export default bootstrap;
