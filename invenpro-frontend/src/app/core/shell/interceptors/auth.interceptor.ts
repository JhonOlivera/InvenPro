import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const header = authService.authHeader;

  if (header) {
    req = req.clone({
      setHeaders: { Authorization: header }
    });
  }

  return next(req);
};