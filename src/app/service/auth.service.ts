import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { LOGIN_URL } from "../../url";
import { tap } from "rxjs";

interface AuthResponse {
  "refresh-token": string,
  "access-token": string,
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  #http = inject(HttpClient);

  private _token = signal(null);

  token = this._token.asReadonly();

  login(username: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.#http.post(LOGIN_URL, body.toString(), { headers })
      .pipe(
        tap((res: any) => this._token.set(res["access-token"]))
      );
  }

}
