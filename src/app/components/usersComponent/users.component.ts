import { Component, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../services/auth.service';
import { TripType, UserType } from '../../types';
import { StoreService } from '../../store.service';
import { ModalComponent } from '../madalComponent/modal.component';
import { ModalService } from '../../../services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeaderComponent, ModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  route = inject(Router);
  storeService = inject(StoreService);
  modalService = inject(ModalService);

  constructor(
    private auth: AuthService,
    private viewContainer: ViewContainerRef
    ){
    if(!this.storeService.users().length){
      this.storeService.setUsers();
    }
    if(!this.storeService.trips().length){
      this.storeService.setTrips();
    }

  }

  setUsers(){
    this.storeService.setUsers();
    // Also updating trips DATA
    this.storeService.setTrips();
  }

  onSignUp(): void {
    console.log('Login Click');
    this.auth.signUp('buzmakov.tim@gmail.com', '123456').then((res) => {
      if(res.data){
        console.log('res', res.data);
      }
      if(res.error){
        console.log('res', res.error);
      }
    }).catch((error) => {
      if(error){
        console.error('error', error);
      }
    });
  }

  onLogin(): void {
    console.log('Login Click');
    this.auth.signInWithEmail('buzmakov.tim@gmail.com', '123456').then((res) => {
      if(res.data){
        console.log('res', res.data);
      }
      if(res.error){
        console.log('res', res.error);
      }
    }).catch((error) => {
      if(error){
        console.error('error', error);
      }
    });
  }

  getUserByEmail(): void {
    this.auth.getUserByEmail('buzmakov1@gmail.com').then((data) => {
      if(data.data.length){
        console.log('Get user by email', data.data[0]);
      } else {
        console.log('Get user by email - No Data');
      }
    }).catch((error) => {
      console.error('Call user by email from User component', error);
    })
  }

  onLogOut(): void {
    this.auth.logOut().then((res) => {
      if(res.error){
        console.error('error', res.error);
      } else {
        console.log('You Signed OUT');
      }
    });

  }

  onCurrentUser():void {
    this.auth.currentUser.subscribe((user) => {
      console.log('Current User:', user);
    });
  }

  deleteUser(user: UserType): void {
    this.modalService.open(this.viewContainer, {title: 'Delete Confirmation', data: `Do you want to delete user: ${user.firstName} ${user.lastName}`}).then(res => {
      if(res === 'ok'){
        user.id && this.storeService.deleteUserById(user.id);
      }
    });
  }

  deleteTrip(trip: TripType): void {
    this.modalService.open(this.viewContainer, {title: 'Delete Confirmation', data: `Do you want to delete this trip: ${trip.id}`}).then(res => {
      if(res === 'ok'){
        this.storeService.deleteTripById(trip.id);
      }
    });
  }

  openTrip(trip: TripType): void {
    console.log('Opening trip ', trip.id);
    this.route.navigate([`trip/${trip.id}`]);
  }
}
