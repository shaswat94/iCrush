import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  confirm(confirmTitle: string, message: string, okCallback: () => any, errorCallback: () => any) {
    alertify.confirm(confirmTitle, message, (e) => {
      if (e) {
        okCallback();
      }
    },
    {
      if (e) {
        errorCallback();
      }
    }
    );
  }
  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }
}
