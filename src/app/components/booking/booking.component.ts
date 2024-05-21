import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IBookingForm, TripType, UserType } from '../../types';
import { formatDate, formatTime, getUUID, getWeekdaysForNextMonths } from '../../../helpers/helpers';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../../services/auth.service';
import { StoreService } from '../../store.service';
import { MapService, RouteType } from '../../../services/map.service';

// Radius for what I can go max. From Vancouver
const LIMIT_DISTANCE = 300;

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  imports: [ButtonComponent, CommonModule, MatNativeDateModule, GoogleMapsModule, MatSelectModule, MatInputModule, ReactiveFormsModule, MatDatepickerModule, MatTabsModule],
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() closeBooking = new EventEmitter();

  @ViewChild('picker') picker!: MatDatepicker<any>; // Import ViewChild

  @ViewChild('pickUpLocationInputField')
  pickUpLocationInputField!: ElementRef;

  @ViewChild('dropOffLocationInputField')
  dropOffLocationInputField!: ElementRef;

  isDropOffLocation: boolean = true;
  displayBookingForm: boolean = true;
  displayBookingConfirmation: boolean = false;
  displayBookingFailing: boolean = false;
  isOneWay: boolean = true;
  dateValue = null;
  isByTheHour: boolean = false;
  isLoading: boolean = false;
  isShowDateNotAvailable: boolean = false;
  bookingConfirmation = 'Your booking is submitted! Please confirm your booking by clicking on the link in your email.'
  bookingErrorConfirmation = 'Oops... Something went wrong. Please try again'
  numbersArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  hoursArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  minutesArray = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  amPm = ['AM', 'PM'];
  distance = signal(0);
  travelTime = signal(0);
  isCalculating = false;

  private formattedPickUpLocation: string | undefined;
  private formattedDropOffLocation: string | undefined;
  private route: RouteType = {
    origin: {
      lat: 0,
      lng: 0
    },
    destination: {
      lat: 0,
      lng: 0
    }
  };

  formGroup: FormGroup | undefined = undefined;

  private auth = inject(AuthService);
  private store = inject(StoreService)
  private mapService = inject(MapService)

  daysNotAvailable = [...getWeekdaysForNextMonths(1).map(day => new Date(day))];

  timeAndDistance = computed<{distance: string, duration: string}>(() => {
    const calculated = {distance: '', duration: ''}
    if (this.distance() !== 0){
      calculated.distance = (this.distance()/1000).toFixed(1)
    }

    return calculated;
  });

  distanceMessage = computed<{message: string, isValid: boolean}>(() => {
    this.pickUpLocationInputField?.nativeElement?.classList.add('invalid');
    const obj = {
      message: `Distance: ${this.timeAndDistance().distance || 0}`,
      isValid: true
    }
    if(this.pickUpRadiusDistance() > LIMIT_DISTANCE || this.dropOffRadiusDistance() > LIMIT_DISTANCE){
      obj.isValid = false;
      obj.message = this.pickUpRadiusDistance() > LIMIT_DISTANCE ?
      `Pick up location outside of the limit ${LIMIT_DISTANCE}km` :
      `Drop off location outside of the limit ${LIMIT_DISTANCE}km`;


    }

    return obj;
  });

  pickUpRadiusDistance = signal(0);
  dropOffRadiusDistance = signal(0);

  daysNotAvailableSignal = computed(() => {
    // const date = this.store.unavailableDates()
    const unavailableFromBE: Date[] = this.store.unavailableDates().map(d => new Date(d.date))
    return [...getWeekdaysForNextMonths(1).map(day => new Date(day)), ...unavailableFromBE]
  });

  unavailableDays = (d: Date | null): boolean => {
    const time=d?.getTime();
    return !this.daysNotAvailableSignal().find(x=>x.getTime()==time);
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnDestroy(): void {
    console.log('Destroy Booking Component');
  }


  ngOnInit(): void {
    this.store.setUnavailableDates();
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
          {
              componentRestrictions: { country: 'CA' }
          });

          dropOffLocationInput.addListener('place_changed', () => {
          const place = dropOffLocationInput?.getPlace();
          if(place.geometry?.location?.lat() && place.geometry?.location?.lng()){
            this.route.destination.lat = place.geometry?.location?.lat();
            this.route.destination.lng = place.geometry?.location?.lng();
          }
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
          if(place.geometry?.location?.lat() && place.geometry?.location?.lng()){
            this.route.origin.lat = place.geometry?.location?.lat();
            this.route.origin.lng = place.geometry?.location?.lng();
          }
          this.formattedPickUpLocation = place.formatted_address;
        });
    }, 500);
  }



  // Method to clear the selected date
  clearSelectedDate() {
    this.picker.select(null); // Set selected date to null
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

  public test() {
    this.dateValue = null;
    this.isShowDateNotAvailable = !this.isShowDateNotAvailable
    this.picker.select(null); // Set selected date to null
  }

  dateSelected(): void {
    console.log('Date selected');
    this.isShowDateNotAvailable = false;
  }

  // When user switched One Way and By the hour
  bookingTypeChanged(event: any) {
    this.isDropOffLocation = event === 0;
    this.prepareForm();
    this.getPlaceAutocomplete();
  }

  // When change location (show loading and calculating distance)
  onChangeAddressHandler(): void {
    if(this.formattedPickUpLocation || this.formattedDropOffLocation){
      this.isCalculating = true;
    }

    setTimeout(() => {
      if(this.route.origin.lat && this.route.origin.lng && this.route.destination.lat && this.route.destination.lng){
        this.mapService.getDistance(this.route).then(data => {
          this.isCalculating = false;
          if(data.data){
            const {distance, duration} = data.data.rows[0].elements[0];
            this.distance.set(distance.value);
            this.travelTime.set(duration.value);
          }
        });
        //TODO: Also calculate radius around Vancouver
        this.setRadiusDistances()
      }
    }, 700);
  }

  setRadiusDistances(): void {
    this.mapService.getGetRadiusFromPickUp(this.route).then(data => {
      if(data.data){
        const {distance} = data.data.rows[0].elements[0];
        this.pickUpRadiusDistance.set(Math.ceil(distance.value/1000));
      }
    });
    this.mapService.getGetRadiusFromDropOff(this.route).then(data => {
      if(data.data){
        const {distance} = data.data.rows[0].elements[0];
        this.dropOffRadiusDistance.set(Math.ceil(distance.value/1000))
      }
    });
  }

  onSubmitForm(): void {

    this.isShowDateNotAvailable = false;
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

        //TODO:
        // 1 Check if User Exist in DB if yes Get Returned User ID and Updated
        // 2 If User not Exist Create user and update Trip object with newly created used ID

        this.auth.getUserByEmail(formData.email).then((data) => {
          if(data.data.length){
            const user: UserType = data.data[0];
            // 1 User with this email already exist
            // 2 Add Trip
            const trip: TripType = this.prepareTip(user.id as number, formData)
            this.addingTrip(trip);

          } else {
            // first create user and then create a trip
            // TODO: ADD USER and then create a trip
            const newUser = this.prepareUser(formData);
            this.auth.addUser(newUser).then((data) => {
              if(data.data.length){
                // 1 User Created
                // 2 Add Trip
                const user = data.data[0];
                console.log(data);
                const trip: TripType = this.prepareTip(user.id as number, formData)
                this.addingTrip(trip);
              }
            })
          }
        })

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

  prepareUser(formData: IBookingForm): UserType {
    return {
      firstName: formData.firstName || undefined,
      lastName: formData.lastName || undefined,
      email: formData.email,
      phone: undefined
    }
  }

  addingTrip(trip: TripType): void {

    //TODO: Check of Data already Exist in BD

    trip.pickupDate && this.auth.isDataAvailable(trip.pickupDate).then((res) => {

      //DATE AVAILABLE
      if(!res){
        // Data Available Can add to DB
        console.log('Data Available!');


        // Adding Trip to DB
        this.auth.addTrip(trip).then((data) => {
          if(data.data.length){
            console.log('BOOKING', data);
            //BOOKED

            // Adding booked date to DB
            this.auth.addUnavailableDate(trip).then((data) => {
              if(data.data.length){
                console.log('Adding Unavailable Date', data);
                this.clearingDataAfterBooking()
              } else {
                console.log('Something went wrong')
                this.bookingFailedClearData();
                //TODO: Date not been added need to remove the trip!!!!
              }
            }).catch((error) => {
              console.error('Adding unavailable date ERROR', error);
              this.bookingFailedClearData();
              //TODO: Date not been added need to remove the trip!!!!
            });


            // this.clearingDataAfterBooking();
          } else {
            this.bookingFailedClearData();
          }
        }).catch((error) => {
          console.error('Booking Error', error);
          this.bookingFailedClearData();
        });



      //DATE NOT AVAILABLE...
      } else {
        console.log('Data not Available any more');
        this.clearSelectedDate();
        this.isShowDateNotAvailable = true;
        this.store.setUnavailableDates();
        this.isLoading = false;

        //TODO:
        // Stop Loading and notify User that date not Available.
      }
    });

  }

  prepareTip(_userId: number, formData: IBookingForm): TripType {
    const today = formatDate(new Date)
    return {
      id: getUUID(),
      userId: _userId,
      confirmationN: '',
      status: 'B',
      price: 600,
      pickupLocation: formData.pickupLocation || 'N/a',
      dropoffLocation: formData.dropoffLocation || 'N/a',
      distance: this.distance(),
      travelTime: this.travelTime(),
      duration: formData.duration || 0,
      pickupTime: formatTime(formData.hour || 0, formData.minute || 0, formData.amPm),
      pickupDate: formData?.date ? formatDate(formData.date?.toString()) : '',
      note: formData.note || 'N/a',
      dateOfCreation: today,
      dateOfModifying: today
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
      this.distance.set(0);
      this.travelTime.set(0);
      this.pickUpRadiusDistance.set(0);
      this.dropOffRadiusDistance.set(0);
    }, 2000);
  }



}
