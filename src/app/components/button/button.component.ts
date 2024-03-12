import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() title: string = '';
  @Input() disabled?: boolean = false;
  @Input() isLoading?: boolean = false;
  @Input() class: 'primary' | 'secondary' = 'primary'
  @Output() clickEvent = new EventEmitter();

  onClickHandler(): void {
    !this.disabled && this.clickEvent.emit();
  }

}
