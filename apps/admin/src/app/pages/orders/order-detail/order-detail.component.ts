import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@lnzsoftware/orders';
import { ORDER_STATUS } from '../order.constants';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'admin-order-detail',
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit {
  order: Order;
  orderStatues = [];
  selectedStatus: any;
  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this._getOrder();
    this._populateOrderStatues();
  }

  _populateOrderStatues() {
    this.orderStatues = Object.keys(ORDER_STATUS).map((key) => {
      return { name: ORDER_STATUS[key].label, id: key };
    });
  }

  private _getOrder() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.orderService.getOrder(params.id).subscribe({
          next: (order) => {
            this.order = order;
            this.selectedStatus = this.order.status;
          }
        });
      }
    });
  }

  onStatusChange(event) {
    this.orderService.updateOrderStatus({ status: event.value }, this.order.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Order is updated`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Order is not updated`
        });
      }
    });
  }
}
