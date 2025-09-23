import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from './service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>{{ authService.user() !== null ? 'Bonjour ' + authService.user()?.username : 'Veuillez vous identifier' }}</h1>
    <nav>
      <ul>
        <li><a routerLink="home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a></li>
        <li><a routerLink="login" routerLinkActive="active">Login</a></li>
        <li><a routerLink="register" routerLinkActive="active">Register</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class App {
  authService = inject(AuthenticationService);
}
