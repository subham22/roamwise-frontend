import { Component, DestroyRef, ElementRef, afterNextRender, inject, output, viewChild } from '@angular/core';
import { Turnstile, TurnstileLoaderService } from '../../services/turnstile.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-turnstile',
  imports: [],
  template: `<div #box class="turnstile-box"></div>`,
})
export class TurnstileComponent {
  private loader = inject(TurnstileLoaderService);
  private box = viewChild.required<ElementRef<HTMLElement>>('box');

  /** Emits a fresh token, or null when it expires or errors. */
  token = output<string | null>();

  private turnstile?: Turnstile;
  private widgetId?: string;

  constructor() {
    // Runs once, after the view is in the DOM, and only in the browser
    afterNextRender(() => {
      this.loader.load().then(ts => {
        this.turnstile = ts;
        this.widgetId = ts.render(this.box().nativeElement, {
          sitekey: environment.turnstileSiteKey,
          callback: t => this.token.emit(t),
          'expired-callback': () => this.token.emit(null),
          'error-callback': () => this.token.emit(null),
          theme: 'light'
        });
      });
    });

    inject(DestroyRef).onDestroy(() => {
      if (this.turnstile && this.widgetId) {
        this.turnstile.remove(this.widgetId);
      }
    });
  }

  /** Call after a failed submit: tokens are single-use. */
  reset(): void {
    if (this.turnstile && this.widgetId) {
      this.token.emit(null);
      this.turnstile.reset(this.widgetId);
    }
  }
}