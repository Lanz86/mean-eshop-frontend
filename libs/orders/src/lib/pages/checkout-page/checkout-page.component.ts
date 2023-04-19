import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderItem } from '../../models/order-item';
import { UsersService } from '@lnzsoftware/users';
import { Order } from '../../models/order';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { OrdersService } from '../../services/orders.service';
import { ORDER_STATUS } from '../../order.constants';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrdersService
  ) {}

  endsub$: Subject<any> = new Subject();
  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId = '643fc836e69e7a23882dd845';
  countries = [];

  ngOnDestroy(): void {
    this.endsub$.next;
    this.endsub$.complete();
  }

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems();
    this._autoFillForm();
    this._getCountries();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm.street.value,
      shippingAddress2: this.checkoutForm.apartment.value,
      city: this.checkoutForm.city.value,
      zip: this.checkoutForm.zip.value,
      country: this.checkoutForm.country.value,
      phone: this.checkoutForm.phone.value,
      status: Object.keys(ORDER_STATUS)[0],
      user: this.userId,
      dateOrdered: `${Date.now()}`
    };
    console.log(order);
    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.cartService.emptyCart();
        this.router.navigate(['/thankyou']);
      },
      error: () => {
        //display error message user
      }
    });
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }

  _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items?.map((item) => {
      return {
        product: item.productId,
        quantity: item.quantity
      };
    });
    console.log(this.orderItems);
  }

  private _autoFillForm() {
    this.usersService
      .observeCurrentUser()
      .pipe(takeUntil(this.endsub$))
      .subscribe({
        next: (user) => {
          console.log(user);
          if (user) {
            this.userId = user.id;
            this.checkoutForm.name.setValue(user.name);
            this.checkoutForm.email.setValue(user.email);
            this.checkoutForm.street.setValue(user.street);
            this.checkoutForm.apartment.setValue(user.apartment);
            this.checkoutForm.city.setValue(user.city);
            this.checkoutForm.zip.setValue(user.zip);
            this.checkoutForm.country.setValue(user.country);
            this.checkoutForm.phone.setValue(user.phone);
          }
        }
      });
  }
}
