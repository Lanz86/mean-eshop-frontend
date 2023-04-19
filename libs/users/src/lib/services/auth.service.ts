import { Injectable } from '@angular/core';
import { enviroment } from '@env/enviroments';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalstorageService } from './localstorage.service';
import { Router } from '@angular/router';
import { AuthUser } from '../models/auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = `${enviroment.apiUrl}users`;
  constructor(
    private http: HttpClient,
    private localStorageService: LocalstorageService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, { email: email, password: password });
  }

  logout() {
    this.localStorageService.removeToken();
    this.router.navigate(['/login']);
  }
}
