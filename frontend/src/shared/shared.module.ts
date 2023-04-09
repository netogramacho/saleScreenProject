import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';

import { ProductsComponent } from './components/products/products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SalesComponent } from './components/sales/sales.component';
import { MenuComponent } from './components/menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductApi } from './api/products-api';
import { CategoriesApi } from './api/categories-api';
import { SideDialogComponent } from './components/side-dialog/side-dialog.component';
import { FormsModule } from '@angular/forms';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { CartProductComponent } from './components/cart-product/cart-product.component';
import { DialogSearchComponent } from './components/dialog-search/dialog-search.component';
import { NewSaleComponent } from './components/new-sale/new-sale.component';
import { SalesListComponent } from './components/sales-list/sales-list.component';
import { FilterPipe } from './pipe/filter.pipe';

// MATERIAL
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SaleApi } from './api/sale-api';

@NgModule({
  declarations: [
    ProductsComponent,
    CategoriesComponent,
    SalesComponent,
    MenuComponent,
    SideDialogComponent,
    NewSaleComponent,
    SalesListComponent,
    DialogSearchComponent,
    FilterPipe,
    ProductSearchComponent,
    CartProductComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  exports: [ProductsComponent, CategoriesComponent, SalesComponent],
  providers: [ProductApi, CategoriesApi, SaleApi],
})
export class SharedModule {}
