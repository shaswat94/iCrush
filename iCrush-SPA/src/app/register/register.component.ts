import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() registerModeFromHome: boolean;
  @Output() cancelRegister = new EventEmitter();
  hide = true;
  model: any = {};
  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register(form: NgForm) {
    this.authService.register(this.model).subscribe(() => {
      this.alertify.success('registeration successful');
      form.reset();
    }, (error) => {
      this.alertify.error(error);
    });
  }

  cancel() {
    this.cancelRegister.emit(!this.registerModeFromHome);
  }

}
