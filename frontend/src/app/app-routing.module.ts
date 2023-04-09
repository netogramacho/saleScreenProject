import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from 'src/shared/components/categories/categories.component';
import { NewSaleComponent } from 'src/shared/components/new-sale/new-sale.component';
import { ProductsComponent } from 'src/shared/components/products/products.component';
import { SalesComponent } from 'src/shared/components/sales/sales.component';

const routes: Routes = [
  {path: 'newsale', component: NewSaleComponent},
  {path: 'saleslist', component: SalesComponent},
  {path: 'productslist', component: ProductsComponent},
  {path: 'categorieslist', component: CategoriesComponent},
  { path: '', redirectTo: '/saleslist', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
