import { Component, effect, inject, Signal, signal } from '@angular/core';
import { User } from '../../user.type';
import { HttpClient } from '@angular/common/http';
import { USERS_URL } from '../../../utils';

@Component({
  selector: 'home',
  imports: [],
  template: `
    <h3>Users</h3>

    <div>
      @for (item of users(); track $index) {
        <div>
          <p>{{item?.username}}</p>
          <p>{{item?.actived ? 'Actif' : 'Non actif'}}</p>
        </div>
      }
    </div>
  `
})
export class HomeComponent {
  #http = inject(HttpClient);
  users = signal<User[]>([]);

  constructor() {
    effect(() => {
      this.#http.get(USERS_URL).subscribe((data: any) => {
        this.users.set(data);
      });
    });
  }
}
