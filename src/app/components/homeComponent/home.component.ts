import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { InfoCards, TypeService } from '../../types';
import { SectionComponent } from '../section/section.component';
import { BookingComponent } from '../booking/booking.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StoreService } from '../../store.service';
import { FooterComponent } from '../footer/footer.component';
// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [HeaderComponent],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.scss'
// })
// export class HomeComponent {


// }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SectionComponent, BookingComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
        color: 'red',
        display: 'flex',
        height: '900px',
      })),
      state('closed', style({
        opacity: 0,
        display: 'none',
        height: '0'
      })),
      transition('open <=> closed', [
        animate('0.3s ease-in-out')
      ]),
    ])
  ]
})
export class HomeComponent {

  constructor(private storeService: StoreService){
    this.storeService.init();
  }

  isBookingExpanded: boolean = false;

  services: TypeService[] = [
    {
      title: 'City to City rides',
      description: 'Your stress-free solution for traveling between cities, with chauffeurs across the globe.',
      image: './../../../../assets/service1.jpeg'
    },
    {
      title: 'Chauffeur hailing',
      description: 'Enjoy the quality of a traditional chauffeur, with the convenience of riding within minutes of booking',
      image: './../../../../assets/service2.jpeg'
    },
    {
      title: 'Airport transfer',
      description: 'With additional wait time and flight tracking in case of delays, our service is optimized to make every airport transfer a breeze.',
      image: './../../../../assets/service3.jpeg'
    }
  ]

  infoCards: InfoCards[] = [
    {
      title: 'Safety First',
      description: 'Travel confidently knowing your safety is our #1 priority. Rigorous health and cleaning standards round out a best-in-class service',
      image: './../../../../assets/icont.png'
    },
    {
      title: 'Private travel solution',
      description: 'Discover you one-stop travel shop: long-distance rides, one way or return, by the hour, airport transfers, and more',
      image: './../../../../assets/icont.png'
    },
    {
      title: 'Sustainable travel',
      description: 'Breath easy knowing all ride emissions are offset, as part of our global carbon offset program - the industry\'s first',
      image: './../../../../assets/icont.png'
    },
  ]

  onCloseBookingHandler():void {
    this.isBookingExpanded = false;
  }
  onBookHandler(ev: boolean): void {
    this.isBookingExpanded = !this.isBookingExpanded;
  }
}
