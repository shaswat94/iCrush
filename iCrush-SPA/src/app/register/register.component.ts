import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl, FormBuilder } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() registerModeFromHome: boolean;
  @Output() cancelRegister = new EventEmitter();
  hide = true;
  user: User;
  registerForm: FormGroup;
  gender = [
    {option: 'Male', value: 'male'},
    {option: 'Female', value: 'female'}
  ];
  countries: any = [];
  err_msg : any =[];
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(12),
        this.patternValidator(/\d/, {
          hasNumber: true
        }),
        this.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        this.patternValidator(/[a-z]/, {
          hasSmallCase: true
        }),
        this.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          })
      ])],
      confirmPassword: ['', Validators.required],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    }, { validator: this.passwordMatchValidator }
    );
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('Registeration successful');
        this.registerForm.reset();
      }, (error) => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(!this.registerModeFromHome);
  }

  passwordMatchValidator(g: FormGroup): any {
    return g.get('password').value === g.get('confirmPassword').value ? null : g.get('confirmPassword').setErrors({ 'mismatch': true });
  }
  
  /**Function which helps in displaying error message for different fields of the register page */
  getErrorMessage(formField : String){
    var hasErr = false;
    switch(formField){
      case 'username':
                      const username = this.registerForm.get('username');
                      if(username.hasError('required')){
                        this.err_msg[1] = "Username is required";
                        hasErr = true;
                      }
                      else{
                        hasErr = false;
                      }
                      return hasErr;
                      
      case 'knownAs':
                      const knownAs = this.registerForm.get('knownAs');
                      if(knownAs.hasError('required')){
                        this.err_msg[2] = "Known as is required";
                        hasErr = true;
                      }
                      else{
                        hasErr = false;
                      }
                      return hasErr;
                     
      case 'dateOfBirth':
                      const dateOfBirth = this.registerForm.get('dateOfBirth');
                      if( dateOfBirth.hasError('required')){
                        this.err_msg[3] = "Please enter your birthday";
                        hasErr = true;
                      }
                      else{
                        hasErr = false;
                      }
                      return hasErr;
                     
       case 'city':
                      const city = this.registerForm.get('city');
                      if( city.hasError('required')){
                        this.err_msg[4] = "City is required";
                        hasErr = true;
                      }
                      else{
                        hasErr = false;
                      }
                      return hasErr;
                     
       case 'country':
                      const country = this.registerForm.get('country');
                      if( country.hasError('required')){
                        this.err_msg[5] = "Country is required";
                        hasErr = true;
                      }
                      else{
                        hasErr = false;
                      }
                      return hasErr;
                     
        case 'password':
                      const password = this.registerForm.get('password');
                      if( password.hasError('required')){
                        this.err_msg[6] = "Password is required";
                        hasErr = true;
                      }
                      else if (password.hasError('minlength')){
                        this.err_msg[6] = "Password must have a minimum length of 4 characters";
                        hasErr = true;
                      }
                      else if (password.hasError('maxlength')){
                         this.err_msg[6] = "Password cannot exceed 8 characters";
                         hasErr = true;
                      }
                      else if (!password.hasError('minlength')){
                        this.err_msg[6] = "";
                            if(password.hasError('hasSpecialCharacters')){
                              this.err_msg[6] = " Password must have at least 1 special character.";
                              hasErr = true;
                            }
                            if(password.hasError('hasCapitalCase')){
                              this.err_msg[6] = this.err_msg[6] +" Password must have at least 1 in capital case.";
                              hasErr = true;
                            }
                            if(password.hasError('hasNumber')){
                              this.err_msg[6] = this.err_msg[6] + " Password must have at least 1 number.";
                              hasErr = true;
                            }
                          if(password.hasError('hasSmallCase'))
                              this.err_msg[6] = this.err_msg[6] + " Password must have at least 1 small case character.";
                              hasErr = true;
                      }
                      else{
                        hasErr = false;
                      }
                      return hasErr;
         case 'confirmPassword':
                      const confirmPassword = this.registerForm.get('confirmPassword');
                      if ( confirmPassword.hasError('required')){
                        this.err_msg[7] = "Confirm Password is required";
                        hasErr = true;
                      }
                      else if( confirmPassword.hasError('mismatch')){
                        this.err_msg[7] = "Passwords doesn't match";
                        hasErr = true;
                      }
                      else{
                        hasErr = false;
                      }
                      return hasErr;

        default: 
    }
  }

  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }
}
