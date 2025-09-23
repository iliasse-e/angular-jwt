import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { computed, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { ACCESS_TOKEN, LOGIN_URL, PROFILE_URL, REFRESH_TOKEN, REFRESH_TOKEN_URL } from "../../utils";
import { switchMap, tap } from "rxjs";
import { User } from "../user.type";

interface AuthResponse {
  "refresh-token": string,
  "access-token": string,
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  #http = inject(HttpClient);

  private _user: WritableSignal<User | null> = signal(null);

  user = this._user.asReadonly();

  isAuthenticated = computed(()  => this._user() !== null);

  login(username: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.#http.post(LOGIN_URL, body.toString(), { headers })
      .pipe(
        tap((res: any) => {
          localStorage.setItem(ACCESS_TOKEN, res[ACCESS_TOKEN]);
        }),
        switchMap(() => this.#http.get<User>(PROFILE_URL)), // requête pour récupérer le user
        tap(user => this._user.set(user))
      )
  }

  refreshToken() {
    console.info('refresh token');
    return this.#http.get<AuthResponse>(REFRESH_TOKEN_URL, { withCredentials: true }).pipe(
      tap(res => {
        localStorage.setItem(ACCESS_TOKEN, res[ACCESS_TOKEN]);
      })
    );
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this._user.set(null);
  }




}
