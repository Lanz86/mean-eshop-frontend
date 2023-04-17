import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@lnzsoftware/orders';
import { ProductsService, UsersService } from '@lnzsoftware/products';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics = [];
  constructor(
    private productService: ProductsService,
    private userService: UsersService,
    private orderService: OrdersService
  ) {}
  endsubs$: Subject<any> = new Subject();

  ngOnDestroy(): void {
    this.endsubs$.next;
    this.endsubs$.complete();
  }

  ngOnInit(): void {
    combineLatest([
      this.orderService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.orderService.getTotalSales()
    ])
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (values) => {
          this.statistics = values;
        }
      });
  }
}
