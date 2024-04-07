import { Routes } from '@angular/router';
import { UsersComponent } from './components/usersComponent/users.component';
import { HomeComponent } from './components/homeComponent/home.component';
import { TripEditComponent } from './components/tripEditComponent/trip-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'trip/:id',
    component: TripEditComponent
  }
];
