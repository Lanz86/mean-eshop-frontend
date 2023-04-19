import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';
import { enviroment } from '@env/enviroments';
import { User } from '../models/user';

import * as countriesLib from 'i18n-iso-countries';
import { UsersFacade } from '../state/users.facade';
declare const require;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, private userFacade: UsersFacade) {}
  apiUrl = `${enviroment.apiUrl}users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }

  getUsersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/get/count`).pipe(
      map((value: any) => {
        return value.userCount;
      })
    );
  }

  getCountries() {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
    const countries = Object.entries(countriesLib.getNames('en')).map((country) => {
      return { id: country[0], name: country[1] };
    });
    return countries;
  }

  initAppSession() {
    this.userFacade.buildUserSession();
  }

  observeCurrentUser() {
    return this.userFacade.currentUser$;
  }

  isCurrentUserAuth() {
    return this.userFacade.isAuth$;
  }
}
