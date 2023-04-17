import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@lnzsoftware/orders';
import { ProductsService, UsersService } from '@lnzsoftware/products';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  statistics = [];
  constructor(
    private productService: ProductsService,
    private userService: UsersService,
    private orderService: OrdersService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.orderService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.orderService.getTotalSales()
    ]).subscribe({
      next: (values) => {
        this.statistics = values;
      }
    });
  }
}
