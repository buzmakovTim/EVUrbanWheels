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

  deleteUserById(id: number): void {
    this.db.deleteUserById(id).then(data => {
      if(data){
        console.log('Trying to remove user');
        console.log(data);
        if(data.status === 204){
          // Status 204 no errors
          this.store.deleteUser(id);
          //Also delete trips for this user.
          const tripsToDelete = this.trips().filter(t => t.userId === id);
          if(tripsToDelete.length){
            tripsToDelete.forEach(trip => {
              if(trip.id){
                this.deleteTripById(trip.id);
              }
            })
          }
        }
        if(data.error){
          console.error('Error deleting user', data.error);
        }
      }
    })
  }

  deleteTripById(id: number):void {
    this.db.deleteTripById(id).then(data => {
      if(data){
        console.log('Removing trip');
        console.log(data);
        if(data.status === 204){
          // Status 204 no errors
          this.store.deleteTrip(id);
        }
        if(data.error){
          console.error('Error deleting trip', data.error);
        }
      }
    })
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

