import { CategoriesService } from 'src/shared/services/categories.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SideDialogComponent } from '../side-dialog/side-dialog.component';
import { MatTable } from '@angular/material/table';
import { Category } from 'src/shared/interfaces/category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from 'src/shared/services/SpinnerService.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @ViewChild(SideDialogComponent) sideDialog!: SideDialogComponent;
  @ViewChild(MatTable) table!: MatTable<any>;

  categories!: Category[];
  showSpinner!: boolean;
  displayedColumns = ['prc_id', 'prc_name', 'prc_tax', 'edit', 'delete'];
  isDialogOpen = false;
  currCategory: Category;

  constructor(
    private categoriesService: CategoriesService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) {
    this.currCategory = {
      categoryName: '',
      categoryTax: 0,
    };
  }

  ngOnInit(): void {
    this.categoriesService.categories$.subscribe((categories) => {
      this.categories = categories;
    });

    this.spinnerService.spinnerState$.subscribe((load: boolean) => {
      this.showSpinner = load;
    });
  }

  prepareAddCategory() {
    this.isDialogOpen = true;
  }

  saveCategory() {
    let category = { ...this.currCategory };

    if (category.categoryId) {
      this.categoriesService.updateCategory(this.currCategory).subscribe(
        () => {
          this.snackBar.open('Categoria editada com sucesso.', '', {
            duration: 3000,
          });
        },
        (error) => {
          this.snackBar.open(error, 'X', { duration: 5000 });
        }
      );
    } else {
      this.categoriesService.createCategory(this.currCategory).subscribe(
        () => {
          this.snackBar.open('Categoria criada com sucesso.', '', {
            duration: 3000,
          });
        },
        (error) => {
          this.snackBar.open(error, 'X', { duration: 5000 });
        }
      );
    }
    this.sideDialog.close();
  }

  editCategory(category: Category) {
    this.currCategory = { ...category };
    this.isDialogOpen = true;
  }

  deleteCategory(category: Category) {
    this.categoriesService.deleteCategory(category).subscribe(
      () => {
        this.snackBar.open('Categoria excluída com sucesso.', '', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open(error, 'X', { duration: 5000 });
      }
    );
  }

  onCloseSideDialog() {
    this.isDialogOpen = false;
    this.clearCurrCategory();
  }

  clearCurrCategory() {
    this.currCategory = {
      categoryName: '',
      categoryTax: 0,
    };
  }

  parsePercent(number: string): number {
    const parsedNumber = parseFloat(number);
    if (isNaN(parsedNumber)) {
      return 0;
    } else {
      return parsedNumber / 100;
    }
  }
}
