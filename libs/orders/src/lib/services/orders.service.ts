import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { enviroment } from '@env/enviroments';
import { Order } from '../models/order';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) {}
  apiUrl = `${enviroment.apiUrl}orders`;
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`);
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}`, order);
  }

  updateOrderStatus(status: { status: string }, orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, status);
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${orderId}`);
  }

  getOrdersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/get/count`).pipe(
      map((value: any) => {
        return value.orderCount;
      })
    );
  }

  getTotalSales(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/get/totalsales`).pipe(
      map((value: any) => {
        return value.totalSales;
      })
    );
  }

  getProduct(productId: string): Observable<any> {
    return this.http.get<any>(`${enviroment.apiUrl}products/${productId}`);
  }
}
