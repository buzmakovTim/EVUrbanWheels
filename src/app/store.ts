import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { TripType, UserType } from "./types";

export interface IStore {
  isAuthenticated: boolean
  users: UserType[]
  trips: TripType[]
}

export const Store = signalStore(
  { providedIn: 'root'},
  withState<IStore>({
    isAuthenticated: false,
    users: [],
    trips: []
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
    auth() {
      auth.currentUser.subscribe((user) => {
        if(user){
          patchState(store, {isAuthenticated: true})
        }
      });
    }
  }))
);
