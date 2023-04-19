import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '@lnzsoftware/orders';

@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: []
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  addProductToCart() {
    this.cartService.setCartItem({ productId: this.product?.id, quantity: 1 });
  }
}
