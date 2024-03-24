import { Injectable } from "@angular/core";
import { SupabaseClient, User, createClient } from "@supabase/supabase-js";
import { environment } from "../environments/environment";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private supabase: SupabaseClient;
  private _currentUser: BehaviorSubject<boolean | User | any> = new BehaviorSubject(null);

  constructor(){
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.supabase.auth.getUser().then(res => {
      console.log('user', res.data.user);
      if(res.data.user){
        this._currentUser.next(res.data.user);
      }else{
        this._currentUser.next(false);
      }
    });


    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event);
      console.log('session', session);

      if(event === 'SIGNED_IN'){
        this._currentUser.next(session?.user);
      } else {
        this._currentUser.next(false);
      }

    })
  }

  signInWithEmail(email: string, password: string){
    return this.supabase.auth.signInWithPassword({email, password})
  }

  signUp(email: string, password: string){
    return this.supabase.auth.signUp({email, password})
  }

  logOut(){
    return this.supabase.auth.signOut()
  }

  get currentUser() {
    return this._currentUser.asObservable();
  }

}
