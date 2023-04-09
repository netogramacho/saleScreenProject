import { Category } from '../interfaces/category';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class CategoriesApi {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  get(): Observable<Category[]> {
    return this.http
      .get<any>(environment.categoryApi)
      .pipe(retry(1), catchError(this.handleError));
  }

  post(category: Category) {
    return this.http
      .post<Category>(environment.categoryApi, category, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  put(category: Category) {
    return this.http
      .put<Category>(environment.categoryApi + category.categoryId, category)
      .pipe(retry(1), catchError(this.handleError));
  }

  delete(categoryId: any) {
    return this.http
      .delete(environment.categoryApi + categoryId)
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(exception: ErrorEvent) {
    return throwError(exception.error.message);
  }
}
