import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from './store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  route = inject(Router);
  store = inject(Store);

  isAuthenticated = this.store.isAuthenticated;

  init() {
    this.store.auth();
  }


}

