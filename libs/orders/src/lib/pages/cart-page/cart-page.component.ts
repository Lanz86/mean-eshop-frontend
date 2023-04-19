import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { CartItemDetailed } from '../../models/cart-item-detail';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: []
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartItemsDetailed: CartItemDetailed[] = [];
  cartCount = 0;
  endsub$: Subject<any> = new Subject();
  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersServices: OrdersService
  ) {}
  ngOnDestroy(): void {
    this.endsub$.next;
    this.endsub$.complete();
  }
  ngOnInit(): void {
    this._getCartDetails();
  }

  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endsub$)).subscribe({
      next: (cart) => {
        cart.items?.forEach((cartItem) => {
          this.cartItemsDetailed = [];
          this.cartCount = cart.items?.length ?? 0;
          if (cartItem.productId) {
            this.ordersServices.getProduct(cartItem.productId).subscribe({
              next: (product) => {
                this.cartItemsDetailed.push({ product: product, quantity: cartItem.quantity });
              }
            });
          }
        });
      }
    });
  }

  backToShop() {
    this.router.navigate(['/products']);
  }
  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.product.id);
  }

  updateCartItemQuantity(event: any, cartItem: CartItemDetailed) {
    this.cartService.setCartItem({ productId: cartItem.product.id, quantity: event.value }, true);
  }
}
