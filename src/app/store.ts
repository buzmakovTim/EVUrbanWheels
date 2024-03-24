import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export interface IStore {
  isAuthenticated: boolean
}

export const Store = signalStore(
  { providedIn: 'root'},
  withState<IStore>({
    isAuthenticated: false
  }),
  withMethods((store, auth = inject(AuthService)) => ({
    updateAuth(u: boolean){
      patchState(store, {isAuthenticated: u});
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
