import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
      private router: Router,
      private http: HttpClient
  ) {
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
      return this.userSubject.value;
  }

  addUser(user: User) {
    return this.http.post(`${environment.apiUrl}/users/add`, user);
    }

  getAll() {
      return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: string) {
      return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id, params) {
      return this.http.put(`${environment.apiUrl}/users/${id}`, params)
          .pipe(map(x => {
              // update stored user if the logged in user updated their own record
              if (id == this.userValue.id) {
                  // update local storage
                  const user = { ...this.userValue, ...params };
                  localStorage.setItem('user', JSON.stringify(user));

                  // publish updated user to subscribers
                  this.userSubject.next(user);
              }
              return x;
          }));
  }

  delete(id: string) {
      return this.http.delete(`${environment.apiUrl}/users/${id}`)
          .pipe(map(x => {
              return x;
          }));
  }
}