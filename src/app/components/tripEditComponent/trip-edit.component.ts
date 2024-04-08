import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TripType } from "../../types";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [],
  template: `
    <div>Trip Edit Component</div>

  @if(!isLoading){
    @if(trip){
      <div>Trip ID: {{trip.id}}</div>
      <div>Trip pickupLocation: {{trip.pickupLocation}}</div>
      <div>Trip dropoffLocation: {{trip.dropoffLocation}}</div>
      <div>Trip Note: {{trip.note}}</div>
      <div>Trip UserId: {{trip.userId}}</div>
      <div>Trip STATUS: {{trip.status}}</div>
      <div>Trip Price: {{trip.price}}</div>
      <div>Trip Duration: {{trip.duration}}</div>
      <div>Trip PickUp Time: {{trip.pickupTime}}</div>
      <div>Trip PickUp Date: {{trip.pickupDate}}</div>
    } @else {
      <div>Trip not Found</div>
    }
  } @else {
    <!-- Loading add Loader Component -->
    <div>Loading...</div>
  }

    <div>
      <button class="bg-primary-color text-white rounded m-1 p-1" (click)="exit()">Exit</button>
    </div>
  `,
  styles: `
  `
})

export class TripEditComponent implements OnInit {

  db = inject(AuthService);
  router = inject(Router);

  trip?: TripType
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log('Hey!!! This is ID: ', id);
        // Make your backend call using the ID
        this.db.getTripById(id).then(data => {
          if(data && data.data[0]){
            this.trip = data.data[0] as TripType
          }
        }).finally(() => {
          this.isLoading = false;
        })
      }
    });
  }

  exit(): void {
    this.router.navigate(['']);
  }
}
