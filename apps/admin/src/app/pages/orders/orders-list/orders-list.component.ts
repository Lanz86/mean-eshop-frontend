import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@lnzsoftware/orders';
import { ORDER_STATUS } from '../order.constants';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  orderStatus = ORDER_STATUS;
  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this._getOrders();
  }

  private _getOrders() {
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      }
    });
  }

  showOrder(orderId: string) {
    this.router.navigateByUrl(`/orders/${orderId}`);
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this order?',
      header: 'Delete order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(orderId).subscribe({
          next: () => {
            this._getOrders();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Order is deleted'
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Order is not deleted'
            });
          }
        });
      }
    });
  }
}
