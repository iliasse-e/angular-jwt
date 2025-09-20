import { inject } from "@angular/core";
import { AuthenticationService } from "../service/auth.service";
import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthenticationService);
  const token = auth.token();

  if (!token) {
    return next(req)
  }

  const headers = new HttpHeaders({
    Authorization: "Bearer " + token
  })

  const newReq = req.clone({
    headers
  })

  return next(newReq)
}
