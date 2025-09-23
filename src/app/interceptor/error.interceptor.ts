import { HttpErrorResponse } from '@angular/common/http';
import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthenticationService } from '../service/auth.service';
import { ACCESS_TOKEN, REFRESH_TOKEN_URL } from '../../utils';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthenticationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Évite les boucles infinies
      if (req.url.includes(REFRESH_TOKEN_URL)) {
        return throwError(() => error);
      }

      // Si 401 et utilisateur authentifié
      if (error.status === 401 && authService.isAuthenticated()) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = localStorage.getItem(ACCESS_TOKEN);
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              },
              withCredentials: true
            });
            return next(newReq);
          }),
          catchError(refreshError => {
            authService.logout(); // Optionnel : déconnexion si le refresh échoue
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
}

