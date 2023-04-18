import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: []
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  isCategoryPage = false;
  endsubs$: Subject<any> = new Subject();
  constructor(
    private productService: ProductsService,
    private categoriesService: CategoriesService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.endsubs$.next;
    this.endsubs$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.endsubs$)).subscribe({
      next: (params) => {
        params.categoryid ? this._getProducts([params.categoryid]) : this._getProducts();
        this.isCategoryPage = params.categoryid ? true : false;
      }
    });
    this._getCategories();
  }
  private _getProducts(categories?: string[]) {
    this.productService
      .getProducts(categories)
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (products) => {
          this.products = products;
        }
      });
  }

  private _getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        }
      });
  }

  categoryFilter() {
    const selectedCategories = this.categories
      .filter((category) => category.checked)
      .map((category) => category.id);

    this._getProducts(selectedCategories);
  }
}
