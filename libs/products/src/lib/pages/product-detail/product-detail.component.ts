import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { CartService } from '@lnzsoftware/orders';
@Component({
  selector: 'products-product-page',
  templateUrl: './product-detail.component.html',
  styles: []
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  endsubs$: Subject<any> = new Subject();
  quantity = 1;
  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}
  ngOnDestroy(): void {
    this.endsubs$.next;
    this.endsubs$.complete();
  }
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe({
      next: (params) => {
        if (params.productid) {
          this._getProduct(params.productid);
        }
      }
    });
  }

  private _getProduct(productid: string) {
    this.productService
      .getProduct(productid)
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (product) => {
          this.product = product;
        }
      });
  }

  addProductToCart() {
    this.cartService.setCartItem({ productId: this.product?.id, quantity: this.quantity });
  }
}
