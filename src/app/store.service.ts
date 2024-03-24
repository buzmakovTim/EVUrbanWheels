import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from './store';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  route = inject(Router);
  store = inject(Store);
  db = inject(AuthService);

  isAuthenticated = this.store.isAuthenticated;
  users = this.store.users;
  trips = this.store.trips;

  init() {
    this.store.auth();
  }

  setUsers(){
    this.db.getUsers().then((data) => {
      if(data.data){
        console.log('GET ALL USERS');
        console.log(data);
        this.store.setUsers(data.data);
      }
    });
  }

  setTrips(){
    this.db.getTrips().then((data) => {
      if(data.data){
        console.log('GET ALL Trips');
        console.log(data);
        this.store.setTrips(data.data);
      }
    });
  }


}

