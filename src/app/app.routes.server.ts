import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'login', renderMode: RenderMode.Server },
  { path: 'signup', renderMode: RenderMode.Server },
  { path: 'forgot-password', renderMode: RenderMode.Server },
  { path: 'reset-password', renderMode: RenderMode.Server },
  { path: 'shared/trips/:shareToken', renderMode: RenderMode.Server },
  { path: 'app/**', renderMode: RenderMode.Client },
];
