import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { User, UsersService } from '@lnzsoftware/products';
import * as countriesLib from 'i18n-iso-countries';
declare const require;
@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html'
})
export class UsersFormComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({});
  isSubmitted = false;
  editmode = false;
  currentUserId: string;
  countries = [];
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: ['']
    });
    this._getCounties();
    this._checkEditMode();
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form?.invalid) {
      return;
    }

    const user: User = {};

    Object.keys(this.userForm).map((key) => {
      user[key] = this.userForm[key].value;
    });
    user.id = this.currentUserId;
    user.country = this.userForm.country.value;
    if (this.editmode) {
      this._updateUser(user);
    } else {
      this._createUser(user);
    }
  }

  private _updateUser(user: User) {
    this.usersService.updateUser(user).subscribe({
      next: (category: User) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${category.name} is updated`
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.goBack();
          });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User is not updated'
        });
      }
    });
  }

  private _createUser(user: User) {
    this.usersService.createUser(user).subscribe({
      next: (user: User) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${user.name} is created`
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User is not created'
        });
      }
    });
  }

  get userForm() {
    return this.form?.controls;
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentUserId = params.id;
        this.usersService.getUser(params.id).subscribe({
          next: (user) => {
            Object.keys(this.userForm).map((key) => {
              this.userForm[key].setValue(user[key]);
            });
            this.userForm.password.setValidators([]);
            this.userForm.password.updateValueAndValidity();
          },
          error: () => {}
        });
      }
    });
  }
  private _getCounties() {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
    const countries = Object.entries(countriesLib.getNames('en')).map((country) => {
      return { id: country[0], name: country[1] };
    });
    this.countries = countries;
  }
}