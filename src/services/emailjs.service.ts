import { Injectable } from "@angular/core";
import emailjs from '@emailjs/browser';

const TEMPLATE_ID = 'template_3ju7709';
const SERVICE_ID = 'service_0ibk4k3';
const PUBLIC_KEY = '5lzHE73b_VNO0akPd';

export type TemplateParamsType = {
  from_name: string,
  to_name: string,
  message: string,
  trip_id: string,
  reply_to: string
}

@Injectable({
  providedIn: 'root'
})

export class EmailJsService {

  sendEmail(message: TemplateParamsType): void {
    emailjs
    .send(SERVICE_ID, TEMPLATE_ID, message, {
      publicKey: PUBLIC_KEY,
    })
    .then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
      },
      (err) => {
        console.log('FAILED...', err);
      },
    );
  }
};
