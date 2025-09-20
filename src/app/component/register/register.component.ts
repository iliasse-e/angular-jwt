import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { USERS_URL } from '../../../url';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  imports: [FormsModule],
  template: `
    <form>
      <div>
        <label for="username">Username</label>
        <input type="text" id="username" [(ngModel)]="user.username" name="username">
      </div>

      <div>
        <label for="password">Password</label>
        <input type="password" id="password" [(ngModel)]="user.password" name="password">
      </div>

      <div>
        <label for="confirmed-password">Confirmed Password</label>
        <input type="password" id="confirmed-password" [(ngModel)]="user.confirmedPassword" name="confirmed-password">
      </div>

      <button type="submit" (click)="register()">Register</button>
    </form>
  `
})
export class RegisterComponent {
  #http = inject(HttpClient);
  #router = inject(Router);

  user = {
    username: null,
    password: null,
    confirmedPassword: null
  }

  register() {
    this.#http.post(USERS_URL, {
      username: this.user.username,
      password: this.user.password,
      confirmedPassword: this.user.confirmedPassword
    })
    .subscribe(() => this.#router.navigateByUrl("home"));
  }
}
