import { Injectable, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from './store';
import { AuthService } from '../services/auth.service';
import { TripType } from './types';

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


  tripsComputed = computed(() => {
  // Initialize a Map to store trips for each user
  const tripsMap = new Map<number, TripType[]>();

  // Assuming tripsData is an array of TripType objects
  for (const trip of this.trips()) {
    if (!tripsMap.has(trip.userId)) {
      // If the user is not in the map yet, initialize an empty array for their trips
      tripsMap.set(trip.userId, []);
    }
    // Push the trip into the array for the corresponding user
    const userTrips = tripsMap.get(trip.userId);
    if (userTrips) {
      userTrips.push(trip);
    }
  }
  return tripsMap;
});

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

  deleteTripById(id: string):void {
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


}

