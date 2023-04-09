import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinnerState = new BehaviorSubject<boolean>(false);

  get spinnerState$() {
    return this.spinnerState.asObservable();
  }

  show() {
    this.spinnerState.next(true);
  }

  hide() {
    this.spinnerState.next(false);
  }
}
