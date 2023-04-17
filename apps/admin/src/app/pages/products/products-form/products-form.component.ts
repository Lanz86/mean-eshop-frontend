import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Product, ProductsService } from '@lnzsoftware/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html'
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  editmode = false;
  form: FormGroup = this.formBuilder.group({});
  isSubmited = false;
  categories = [];
  imageDisplay: string | ArrayBuffer;
  currentProductId: string;
  endsubs$: Subject<any> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private categoriesServices: CategoriesService,
    private productServices: ProductsService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }
  ngOnDestroy(): void {
    this.endsubs$.next;
    this.endsubs$.complete();
  }
  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    });

    this._checkEditMode();
  }
  private _getCategories() {
    this.categoriesServices
      .getCategories()
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        }
      });
  }
  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentProductId = params.id;
        this.productServices
          .getProduct(params.id)
          .pipe(takeUntil(this.endsubs$))
          .subscribe({
            next: (product) => {
              Object.keys(this.productForm).map((key) => {
                this.productForm[key].setValue(product[key]);
              });
              this.imageDisplay = product.image;
              this.productForm.category.setValue(product.category.id);
              this.productForm.image.setValidators([]);
              this.productForm.image.updateValueAndValidity();
            }
          });
      }
    });
  }

  onSubmit() {
    this.isSubmited = true;
    if (this.form.invalid) {
      return;
    }

    const productFormData = new FormData();

    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });
    if (this.editmode) {
      this._editProduct(productFormData);
    } else {
      this._addProduct(productFormData);
    }
  }

  private _addProduct(productFormData: FormData) {
    this.productServices
      .createProduct(productFormData)
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (product: Product) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${product.name} is created`
          });
          timer(2000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not created'
          });
        }
      });
  }

  private _editProduct(productFormData: FormData) {
    this.productServices
      .updateProduct(productFormData, this.currentProductId)
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (product: Product) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${product.name} is updated`
          });
          timer(2000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not updated'
          });
        }
      });
  }

  onCancel() {
    this.goBack();
  }

  goBack() {
    this.location.back();
  }

  onImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image').updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };
      fileReader.readAsDataURL(file);
    }
  }

  get productForm() {
    return this.form?.controls;
  }
}
