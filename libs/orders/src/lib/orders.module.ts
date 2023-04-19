import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { BadgeModule } from 'primeng/badge';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { Routes, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersModule } from '@lnzsoftware/users';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { TankYouComponent } from './components/tank-you/tank-you.component';
const route: Routes = [
  {
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent
  },
  {
    path: 'thankyou',
    component: TankYouComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    BadgeModule,
    RouterModule.forChild(route),
    ButtonModule,
    InputNumberModule,
    ToastModule,
    FormsModule,
    UsersModule,
    ReactiveFormsModule,
    DropdownModule,
    InputMaskModule,
    InputTextModule
  ],
  declarations: [
    CartIconComponent,
    CartPageComponent,
    OrderSummaryComponent,
    CheckoutPageComponent,
    TankYouComponent
  ],
  exports: [CartIconComponent, CartPageComponent]
})
export class OrdersModule {}
