import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { ACCESS_TOKEN, LOGIN_URL, REFRESH_TOKEN_URL } from "../../utils";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem(ACCESS_TOKEN);

  // Si on tente de login ou rafraichir le token, on n'envoie pas de Bearer token (sinon le serveur génère une 401)
  if (req.url.includes(LOGIN_URL) || req.url.includes(REFRESH_TOKEN_URL)) {
    return next(req)
  }

  if (!token) {
    return next(req)
  }

  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  })

  return next(newReq);
}
