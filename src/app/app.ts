import { Component, signal } from '@angular/core';
import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Welcome to JWT app</h1>
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
  protected readonly title = signal('jwt');
}
