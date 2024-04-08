import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { TripType, UnavailableDatesType, UserType } from "./types";

export interface IStore {
  isAuthenticated: boolean
  users: UserType[]
  trips: TripType[]
  unavailableDates: UnavailableDatesType[]
}

export const Store = signalStore(
  { providedIn: 'root'},
  withState<IStore>({
    isAuthenticated: false,
    users: [],
    trips: [],
    unavailableDates: []
  }),
  withMethods((store, auth = inject(AuthService)) => ({
    updateAuth(u: boolean){
      patchState(store, {isAuthenticated: u});
    },
    setUsers(users: UserType[]){
      patchState(store, {users});
    },
    setTrips(trips: TripType[]){
      patchState(store, {trips});
    },
    setUnavailableDates(unavailableDates: UnavailableDatesType[]){
      patchState(store, {unavailableDates});
    },
    deleteUser(id: number){
      patchState(store, {users: store.users().filter(u => u.id !== id)});
    },
    deleteTrip(id: string){
      patchState(store, {trips: store.trips().filter(u => u.id !== id)});
    },
    auth() {
      auth.currentUser.subscribe((user) => {
        if(user){
          patchState(store, {isAuthenticated: true})
        }
      });
    }
  }))
);
