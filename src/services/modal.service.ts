import { Injectable, TemplateRef, ViewContainerRef } from "@angular/core";
import { ModalComponent, ModalType } from "../app/components/madalComponent/modal.component";


@Injectable({
  providedIn: 'root'
})

export class ModalService {

  open(viewContainer: ViewContainerRef, options?: ModalType): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const modal = viewContainer.createComponent(ModalComponent);
      if (options) {
        modal.instance.modalData = options;
      }

      modal.instance.modalResult.subscribe((result: string) => {
        modal.destroy(); // Clean up the modal component
        resolve(result); // Resolve the promise with the button choice
      });
    });
  }
}
