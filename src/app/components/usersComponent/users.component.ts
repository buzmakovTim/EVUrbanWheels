import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../services/auth.service';
import { UserType } from '../../types';
import { StoreService } from '../../store.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  storeService = inject(StoreService);

  constructor(private auth: AuthService){
    if(!this.storeService.users().length){
      this.storeService.setUsers();
    }

  }

  setUsers(){
    this.storeService.setUsers();
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

  addUser():void {

    const newUser: UserType = {
      firstName: 'Timofey',
      lastName: 'Buzmakov',
      email: 'buzmakov2@gmail.com',
      phone: '+17786836161'
    }

    this.auth.addUser(newUser).then((res) => {
      if(res){
        console.log('!!!! USER ADDED')
        console.log(res)
        this.setUsers();
      }
    });
  }
}
