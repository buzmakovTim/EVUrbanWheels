import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IBookingForm, TripType, UserType } from '../../types';
import { formatTime, getWeekdaysForNextMonths } from '../../../helpers/helpers';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  imports: [ButtonComponent, CommonModule, MatNativeDateModule, GoogleMapsModule, MatSelectModule, MatInputModule, ReactiveFormsModule, MatDatepickerModule, MatTabsModule],
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() closeBooking = new EventEmitter();

  @ViewChild('pickUpLocationInputField')
  pickUpLocationInputField!: ElementRef;

  @ViewChild('dropOffLocationInputField')
  dropOffLocationInputField!: ElementRef;

  isDropOffLocation: boolean = true;
  displayBookingForm: boolean = true;
  displayBookingConfirmation: boolean = false;
  displayBookingFailing: boolean = false;
  isOneWay: boolean = true;
  isByTheHour: boolean = false;
  isLoading: boolean = false;
  bookingConfirmation = 'Your booking is submitted! Please confirm your booking by clicking on the link in your email.'
  bookingErrorConfirmation = 'Oops... Something went wrong. Please try again'
  numbersArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  hoursArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  minutesArray = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  amPm = ['AM', 'PM'];

  private formattedPickUpLocation: string | undefined;
  private formattedDropOffLocation: string | undefined;

  formGroup: FormGroup | undefined = undefined;

  daysNotAvailable = [...getWeekdaysForNextMonths(1).map(day => new Date(day))];

  unavailableDays = (d: Date | null): boolean => {
    const time=d?.getTime();
    return !this.daysNotAvailable.find(x=>x.getTime()==time);
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnDestroy(): void {
    console.log('DESTROY CALLED!!!');
  }


  ngOnInit(): void {
    this.prepareForm();
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  onCloseHandler(): void {
    this.closeBooking.emit()
  }

  prepareForm(): void {
    this.formGroup = this.formBuilder.group({
      firstName: [undefined, [Validators.required, Validators.minLength(3)]],
      lastName: [undefined, [Validators.required, Validators.minLength(3)]],
      email: [undefined, [Validators.required, Validators.email]],
      pickupLocation: [undefined, Validators.required],
      dropoffLocation: this.isDropOffLocation ? [undefined, Validators.required] : undefined,
      duration: !this.isDropOffLocation ? [undefined, Validators.required] : undefined,
      date: [undefined, Validators.required],
      hour: [undefined, Validators.required],
      minute: [undefined, Validators.required],
      amPm: [undefined, Validators.required],
      note: undefined
    });
  }

  //TODO: Might don't need it
  // onChange(test: any): void {
  //   console.log(test.target.value)
  //   // const dropOffLocationInput = new google.maps.places.Autocomplete()
  //   this.getPlaceAutocomplete();
  // }

  private getPlaceAutocomplete() {
    setTimeout(() => {
      if(this.isDropOffLocation){
        const dropOffLocationInput = new google.maps.places.Autocomplete(this.dropOffLocationInputField.nativeElement,
          // TODO: Add restriction to Vancouver Area
          {
              componentRestrictions: { country: 'CA' }
          });

          dropOffLocationInput.addListener('place_changed', () => {
          const place = dropOffLocationInput?.getPlace();
          this.formattedDropOffLocation = place.formatted_address;
          //TODO: Here we can recalculate distance and Price if we will do this
        });
      }
        const pickUpLocationInput = new google.maps.places.Autocomplete(this.pickUpLocationInputField.nativeElement,
          // TODO: Add restriction to Vancouver Area
          {
              componentRestrictions: { country: 'CA' }
          });

          pickUpLocationInput.addListener('place_changed', () => {
          const place = pickUpLocationInput?.getPlace();
          this.formattedPickUpLocation = place.formatted_address;
          //TODO: Here we can recalculate distance and Price if we will do this
        });
    }, 500);
  }

  //Function to highlight Invalid fields when Submit clicked
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  // When user switched One Way and By the hour
  bookingTypeChanged(event: any) {
    this.isDropOffLocation = event === 0;
    this.prepareForm();
    this.getPlaceAutocomplete();
  }

  onSubmitForm(): void {
    if(this.formGroup){
      const formData: IBookingForm = this.formGroup.value;
      formData.pickupLocation = this.formattedPickUpLocation;
      formData.dropoffLocation = this.formattedDropOffLocation

      console.log(this.formGroup.value)

      if(this.formGroup.valid){
        formData.email = formData.email.toLocaleLowerCase();
        this.isLoading = true;
        console.log(formData);

        //TODO: Form is valid Trying to book. Here will be calling back end and check if everything is ok and we can make a booking
        const isBooked = false;
        if(isBooked){
          this.clearingDataAfterBooking();
        } else {
          this.bookingFailedClearData();
        }
      } else {
        // highlight Invalid fields when Submit
        this.validateAllFormFields(this.formGroup)
      }
    }
  }

  onBookAnotherDay(): void {
    this.displayBookingForm = true;
    this.displayBookingConfirmation = false;
    this.displayBookingFailing = false;

    this.getPlaceAutocomplete();
  }

  prepareTip(_userId: number, formData: IBookingForm): TripType {
    return {
      userId: _userId,
      confirmationN: '',
      status: 'B',
      price: 600,
      pickupLocation: formData.pickupLocation || 'N/a',
      dropoffLocation: formData.dropoffLocation || 'N/a',
      duration: formData.duration || 0,
      pickupTime: formatTime(formData.hour || 0, formData.minute || 0, formData.amPm),
      pickupDate: formData.date,
      note: formData.note || 'N/a'
    }
  }

  // Call after Failed booking (when something went wrong)
  bookingFailedClearData(): void {
    setTimeout(() => {
      this.displayBookingFailing = true;
      this.displayBookingForm = false;
      this.isLoading = false;
      this.formGroup?.reset();
    }, 3000);
  }

  // Call after Success booking
  clearingDataAfterBooking(): void {
    //SetTimeout so loading not switch to fast to already booked confirmation
    setTimeout(() => {
      this.isLoading = false;
      this.displayBookingForm = false;
      this.displayBookingConfirmation = true;
      this.formGroup?.reset();
    }, 2000);
  }

  // Create User
  // userCreating(newUser: UserType): Observable<number | undefined> {
  //   return this.api.createUser(newUser).pipe(
  //     map((res: any) => {
  //       if (res && res.id) {
  //         // console.log('User Created!!! With id: ' + res.id);
  //         return res.id;
  //       } else {
  //         return undefined;
  //       }
  //     }),
  //     catchError((error: any) => {
  //       console.error('Error creating user:', error);
  //       return of(undefined);
  //     })
  //   );
  // }

  // Check if user exist
  // findUserByEmail(email: string): Observable<number | undefined>{
  //   return this.api.getUserByEmail(email).pipe(
  //     map((res: any) => {
  //       if (res && res.length) {
  //         // console.log(`User with email: ${email} already exist`);
  //         return res[0].id;
  //       } else {
  //         // console.log(`User with email: ${email} NOT exist`);
  //         return undefined;
  //       }
  //     }),
  //     catchError((error: any) => {
  //       console.error('Error checking email:', error);
  //       return of(undefined);
  //     })
  //   );
  // }

  // Check if user exist
  // makeBooking(trip: TripType): Observable<boolean>{
  //   return this.api.createTrip(trip).pipe(
  //     map((res: any) => {
  //       if (res) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }),
  //     catchError((error: any) => {
  //       console.error('Error trip creation:', error);
  //       return of(false);
  //     })
  //   );
  // }

}
