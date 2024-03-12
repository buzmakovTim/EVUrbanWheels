import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InfoCards, TypeService } from '../../types';
import { HeaderComponent } from '../header/header.component';
import { ButtonComponent } from '../button/button.component';
import { ServiceComponent } from '../serviceComponent/service.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [HeaderComponent, ButtonComponent, ServiceComponent, CommonModule],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent {
  @Input() title?: string = '';
  @Input() section?: 'topSection' | 'servicesSection' | 'quote' | 'imageQuote' | 'infoCards';

  @Input() isBookingExpanded: boolean = false;
  @Input() services?: TypeService[];
  @Input() infoCards?: InfoCards[];
  @Input() quote?: string = '';
  @Input() image?: string = '';
  @Input() titleBig?: string = '';
  @Input() titleSmall?: string = '';
  @Output() bookHandler = new EventEmitter<boolean>();

  onBookHandler(){
    this.isBookingExpanded = true;
    this.bookHandler.emit(true);
  }
}
