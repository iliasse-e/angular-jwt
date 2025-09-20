import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
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

      <button type="submit" (click)="login()">Login</button>

    </form>
  `,
})
export class LoginComponent {
  #loginService = inject(AuthenticationService);
  #router = inject(Router);

  user = {
    username: null,
    password: null
  }

  login() {
    console.log("login", this.user);
    this.#loginService.login(this.user.username!, this.user.password!)
    .subscribe(() => this.#router.navigateByUrl("home"));
  }


}
