import { Injectable } from "@angular/core";
import { SupabaseClient, User, createClient } from "@supabase/supabase-js";
import { environment } from "../environments/environment";
import { BehaviorSubject } from "rxjs";
import { TripType, UserType } from "../app/types";


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
      if(res.error){
        console.error('AUTH ERROR', res.error);
      }
    }).catch((error) => {
      console.error('Error getUser', error);
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

  async addUser(user: UserType): Promise<any> {
    try {
      const data = await this.supabase
        .from('users')
        .insert([
          { email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone },
        ])
        .select();

      console.log('data', data);
      return data;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async addTrip(trip: TripType): Promise<any> {
    try {
      const data = await this.supabase
      .from('trips')
      .insert([
        { id: trip.id,
          userId: trip.userId,
          confirmationN: trip.confirmationN,
          status: trip.status,
          price: trip.price,
          pickupLocation: trip.pickupLocation,
          dropoffLocation: trip.dropoffLocation,
          duration: trip.duration,
          pickupTime: trip.pickupTime,
          pickupDate: trip.pickupDate,
          note: trip.note,
          dateOfCreation: trip.dateOfCreation,
          dateOfModifying: trip.dateOfModifying
        },
      ])
      .select()

        console.log('data', data);
        return data; // You can return data if needed
      } catch (error) {
        console.error('Error adding trip:', error);
        throw error; // Throw the error to handle it in the calling code
      };
  }

  async addUnavailableDate(trip: TripType): Promise<any> {
    try {
      const data = await this.supabase
        .from('unavailable-dates')
        .insert([
          { tripId: trip.id, date: trip.pickupDate },
        ])
        .select();

      console.log('data', data);
      return data;
    } catch (error) {
      console.error('Error adding date:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const data = this.supabase
        .from('users')
        .select("*")
        // Filters
        .eq('email', email);

      console.log('data', data);
      return data;
    } catch(error){
      console.error('Error look user by email:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async getTripById(id: string): Promise<any> {
    try {
      const data = this.supabase
        .from('trips')
        .select("*")
        // Filters
        .eq('id', id);

      console.log('data', data);
      return data;
    } catch(error){
      console.error('Error look Trip by id:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async isDataAvailable(date: string): Promise<boolean> {
    try {
        const data = await this.supabase
            .from('unavailable-dates')
            .select('*')
            .eq('date', date);

        return data && data.data?.[0]; // Return true if data exists
    } catch (error) {
        console.error('Error looking up Trip by id:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

  // addTrip(trip: TripType){
  //   return this.supabase
  //   .from('trips')
  //   .insert([
  //     { userId: trip.userId, pickupLocation: trip.pickupLocation, dropoffLocation: trip.dropoffLocation, note: trip.note },
  //   ])
  //   .select().then((data) => {
  //     console.log('data', data);
  //   })
  // }

  getTrips() {
    return this.supabase
      .from('trips')
      .select('*')
  }

  getUsers() {
    return this.supabase
      .from('users')
      .select('*')
  }

  //TODO: Later I need tu get only future dates. Past we don't need we will do check in the component not to show past dates
  getUnavailableDates() {
    return this.supabase
      .from('unavailable-dates')
      .select('*')
  }

  deleteUserById(id: number) {
    return this.supabase
      .from('users')
      .delete()
      .eq('id', id)
  }

  deleteTripById(id: string) {
    return this.supabase
      .from('trips')
      .delete()
      .eq('id', id)
  }

  get currentUser() {
    return this._currentUser.asObservable();
  }

}
