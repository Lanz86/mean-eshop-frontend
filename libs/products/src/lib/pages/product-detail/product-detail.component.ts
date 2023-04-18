import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
@Component({
  selector: 'products-product-page',
  templateUrl: './product-detail.component.html',
  styles: []
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  endsubs$: Subject<any> = new Subject();
  quantity: number;
  constructor(private productService: ProductsService, private route: ActivatedRoute) {}
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

  addProductToCart() {}
}
