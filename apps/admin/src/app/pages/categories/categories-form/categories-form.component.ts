import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@lnzsoftware/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: []
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  form: FormGroup = this.formBuilder.group({});
  isSubmited = false;
  editmode = false;
  currentCategoryId: string;
  endsubs$: Subject<any> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.endsubs$.next;
    this.endsubs$.complete();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff', Validators.required]
    });

    this._checkEditMode();
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    this.isSubmited = true;
    if (this.form?.invalid) {
      return;
    }

    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value,
      color: this.categoryForm.color.value
    };

    if (this.editmode) {
      this._updateCategory(category);
    } else {
      this._createCategory(category);
    }
  }

  private _updateCategory(category: Category) {
    this.categoriesService
      .updateCategory(category)
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (category: Category) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Category ${category.name} is updated`
          });
          timer(2000)
            .toPromise()
            .then(() => {
              this.goBack();
            });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Category is not updated'
          });
        }
      });
  }

  private _createCategory(category: Category) {
    this.categoriesService
      .createCategory(category)
      .pipe(takeUntil(this.endsubs$))
      .subscribe({
        next: (category: Category) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Category ${category.name} is created`
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
            detail: 'Category is not created'
          });
        }
      });
  }

  get categoryForm() {
    return this.form?.controls;
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentCategoryId = params.id;
        this.categoriesService
          .getCategory(params.id)
          .pipe(takeUntil(this.endsubs$))
          .subscribe({
            next: (category) => {
              this.categoryForm.name.setValue(category.name);
              this.categoryForm.icon.setValue(category.icon);
              this.categoryForm.color.setValue(category.color);
            },
            error: () => {}
          });
      }
    });
  }
}
