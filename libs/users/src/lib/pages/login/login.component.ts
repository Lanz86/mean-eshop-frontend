import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalstorageService,
    private router: Router
  ) {}
  isSubmitted = false;
  authError = false;
  form: FormGroup;
  authMessage = 'Email or password are wrong';
  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get loginForm() {
    return this.form.controls;
  }

  login() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const loginData = {
        email: this.loginForm.email.value,
        password: this.loginForm.password.value
      };
      this.authService.login(loginData.email, loginData.password).subscribe({
        next: (user) => {
          this.authError = false;
          this.localStorageService.setToken(user.token);
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          this.authError = true;
          if (error.status !== 400) {
            this.authMessage = 'Error in the server, please try again later!';
          }
        }
      });
    }
  }
}
