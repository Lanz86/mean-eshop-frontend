import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'products-featured-products',
  templateUrl: './featured-products.component.html',
  styles: []
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  endsubs$: Subject<any> = new Subject();
  constructor(private productService: ProductsService) {}
  ngOnDestroy(): void {
    this.endsubs$.next;
    this.endsubs$.complete();
  }
  ngOnInit(): void {
    this._getFeaturedProducts();
  }

  private _getFeaturedProducts() {
    this.productService
      .getFeatureProducts(4)
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (products) => {
          this.products = products;
        }
      });
  }
}
