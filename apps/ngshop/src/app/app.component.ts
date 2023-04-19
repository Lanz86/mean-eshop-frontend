import { Component, OnInit } from '@angular/core';
import { UsersService } from '@lnzsoftware/users';

@Component({
  selector: 'lnzsoftware-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private usersService: UsersService) {}
  ngOnInit(): void {
    this.usersService.initAppSession();
  }
  title = 'ngshop';
}
