import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Cart } from '../models/cart';
import { BehaviorSubject } from 'rxjs';

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());
  constructor() {}

  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const initialCart = {
        items: []
      };
      const initialCartJson = JSON.stringify(initialCart);
      localStorage.setItem(CART_KEY, initialCartJson);
    } else {
      this.cart$.next(cart);
    }
  }

  getCart(): Cart {
    const cart: string = localStorage.getItem(CART_KEY);
    return JSON.parse(cart);
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart = this.getCart();
    const cartItemExist = cart.items?.find((item) => item.productId === cartItem.productId);
    if (cartItemExist) {
      cart.items?.map((item) => {
        if (item.productId === cartItemExist.productId) {
          if (updateCartItem) {
            item.quantity = cartItem.quantity;
          } else {
            item.quantity = item.quantity + cartItem.quantity;
          }
        }
      });
    } else {
      cart.items?.push(cartItem);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: string): Cart {
    const cart = this.getCart();
    const newCartItems = cart.items?.filter((item) => item.productId !== productId);
    cart.items = newCartItems;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.cart$.next(cart);
    return cart;
  }

  emptyCart() {
    const initialCart: Cart = {
      items: []
    };
    localStorage.setItem(CART_KEY, JSON.stringify(initialCart));
    this.cart$.next(initialCart);
  }
}
