import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID } from '@angular/core';

// Minimal typing for Cloudflare's global object
export interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

export interface Turnstile {
  render(element: HTMLElement, options: TurnstileRenderOptions): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

@Injectable({ providedIn: 'root' })
export class TurnstileLoaderService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private loadPromise?: Promise<Turnstile>;

  load(): Promise<Turnstile> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Server: never resolve, so the widget is never rendered during SSR
    if (!isPlatformBrowser(this.platformId)) {
      this.loadPromise = new Promise<Turnstile>(() => {});
      return this.loadPromise;
    }

    this.loadPromise = new Promise<Turnstile>((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        const ts = this.document.defaultView?.turnstile;
        ts ? resolve(ts) : reject(new Error('Turnstile loaded but not available'));
      };

      script.onerror = () => {
        this.loadPromise = undefined; // allow a retry on the next load() call
        script.remove();
        reject(new Error('Failed to load Turnstile'));
      };

      this.document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}