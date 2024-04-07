import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

export type ModalType = {
  content?: TemplateRef<any>
  title?: string,
  data?: string
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="min-w-full min-h-full bg-black bg-opacity-40 absolute top-0 flex justify-center items-center">
        <!-- Dialog -->
      <div class="w-80 h-48 bg-gray-50 rounded-xl flex flex-col justify-between">
          <div class="text-base p-2 rounded-t-xl bg-primary-color text-white">Confirmation</div>

          <div class="m-2">
            @if (modalData && modalData.content) {
              <ng-container *ngTemplateOutlet="modalData.content"></ng-container>
            }

            @if (modalData && modalData.data) {
              <div>{{modalData.data}}</div>
            }
          </div>

          <div class="flex justify-end border-t p-1">
            <button  class="bg-primary-color border text-white rounded p-1 m-1 w-16" (click)="okClicked()">Ok</button>
            <button class="border rounded p-1 m-1 w-16" (click)="cancelClicked()">Cancel</button>
          </div>

          <!-- <div>Modal Footer</div> -->
        </div>
    </div>
  `,
  styles: `
  `
})

export class ModalComponent {
  @Input() modalData?: ModalType;
  @Output() modalResult: EventEmitter<string> = new EventEmitter<string>();

  okClicked() {
    this.modalResult.emit('ok');
  }

  cancelClicked() {
    this.modalResult.emit('cancel');
  }
}
