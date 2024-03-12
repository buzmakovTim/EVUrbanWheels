import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TripType, UserType } from "../app/types";

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  apiUrlUsers = 'http://localhost:3000/api/v1/users/';
  apiUrlTrips = 'http://localhost:3000/api/v1/trips/';

  constructor(private http:HttpClient){}

  getAllUsers():Observable<any>{
    return this.http.get(`${this.apiUrlUsers}`)
  }

  createUser(user: UserType):Observable<any>{
    return this.http.post(`${this.apiUrlUsers}`, user);
  }

  getUserByEmail(email: string):Observable<any>{
    return this.http.get(`${this.apiUrlUsers}email/${email}`);
  }

  deleteUser(id: number):Observable<any>{
    return this.http.delete(`${this.apiUrlUsers}${id}`);
  }

  createTrip(trip: TripType):Observable<any>{
    return this.http.post(`${this.apiUrlTrips}`, trip);
  }

  getTripsByUserId(userId: number):Observable<any>{
    return this.http.get(`${this.apiUrlTrips}${userId}`)
  }

  deleteTripById(tripId: number):Observable<any>{
    return this.http.delete(`${this.apiUrlTrips}${tripId}`)
  }
}
