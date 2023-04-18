import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, map } from 'rxjs';
import { enviroment } from '@env/enviroments';
import { Product } from '../models/product';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) {}
  apiUrl = `${enviroment.apiUrl}products`;
  getProducts(categories?: string[]): Observable<Product[]> {
    let params = new HttpParams();
    if (categories) {
      params = params.append('categories', categories.join(','));
    }
    return this.http.get<Product[]>(`${this.apiUrl}`, { params });
  }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, productData);
  }

  updateProduct(productData: FormData, productId: string): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, productData);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`);
  }

  getProductsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/get/count`).pipe(
      map((value: any) => {
        return value.productCount;
      })
    );
  }

  getFeatureProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/get/featured/${count}`);
  }
}
