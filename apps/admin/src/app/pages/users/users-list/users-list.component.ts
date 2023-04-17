import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UsersService } from '@lnzsoftware/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import * as countriesLib from 'i18n-iso-countries';
declare const require;
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  endsubs$: Subject<any> = new Subject();
  constructor(
    private userServices: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getUsers();
  }
  ngOnDestroy(): void {
    this.endsubs$.next;
    this.endsubs$.complete();
  }

  private _getUsers() {
    this.userServices
      .getUsers()
      .pipe(takeUntil(this.endsubs$))
      .subscribe((users) => {
        this.users = users;
      });
  }

  deleteCategory(userId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this category?',
      header: 'Delete category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userServices
          .deleteUser(userId)
          .pipe(takeUntil(this.endsubs$))
          .subscribe({
            next: () => {
              this._getUsers();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User is deleted'
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'User is not deleted'
              });
            }
          });
      }
    });
  }

  updateUser(userid: string) {
    this.router.navigateByUrl(`users/form/${userid}`);
  }

  countryName(id: string) {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
    return countriesLib.getName(id, 'en');
  }
}
