import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor(private auth: AuthService){

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
}
