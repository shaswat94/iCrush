import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { SignalrService } from '../_services/signalr.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  hide = true;
  model: any = {};
  constructor(public authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router,
    private signalrService: SignalrService) { }
  photoUrl: string;

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login(form: NgForm) {
    this.authService.login(this.model)
      .subscribe(next => {
        this.signalrService.start()
            .then( () => console.log('connectred'))
            .catch(err => console.log(err));

        this.alertify.success('Logged in successfully');
        form.reset();
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.router.navigate(['/members']);
      });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logOut() {
    this.userService.setUserOnlineStatusOnLogout(this.authService.decodedToken.nameid, false)
      .subscribe(res => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.authService.decodedToken = null;
        this.authService.currentUser = null;
        this.alertify.message('Logged out');
        this.router.navigate(['/home']);
      }, err => {
        this.alertify.error(err);
      });
  }
}
