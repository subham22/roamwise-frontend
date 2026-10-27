import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 outside the auth endpoints = token missing/expired: end the session and send to login
      if (error.status === 401 && !req.url.includes('/auth/') && authService.token()) {
        authService.logout();
        toastService.error('Your session has expired. Please log in again.');
        router.navigate(['/login']);
        return throwError(() => error);
      }
      const message = error.error?.message ?? 'Something went wrong. Please try again.';
      toastService.error(message);
      return throwError(() => error);
    })
  );
};