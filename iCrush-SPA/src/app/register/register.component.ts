import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { NgForm, FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, AbstractControl, FormBuilder } from '@angular/forms';
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
  gender = ['Male', 'Female'];
  countries: any = [];
  err_msg : any = [];
  err_msg_icon : {icon:String,icon_colr: String}[];
  clickedPasswordField : boolean = false;
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
      gender: ['Male'],
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
                       /*To hide the PasswordField error if not clicked on password field */
                       if(!this.clickedPasswordField){
                          return false;
                        }
                      const password = this.registerForm.get('password');
                      this.err_msg_icon=[{'icon':'cancel', 'icon_colr':'#f44336'}];
                      
                      if( password.hasError('required') || password.hasError('minlength') ||
                          password.hasError('maxlength') || password.hasError(' hasSpecialCharacters') ||
                          password.hasError('hasCapitalCase') || password.hasError('hasNumber') || 
                          password.hasError('hasSmallCase'))
                        {
                          for(let i=0;i<7;i++){
                            this.err_msg_icon.push({'icon':'cancel', 'icon_colr':'#f44336'});
                          }
                         
                          this.err_msg[6] = " Password is required \
                                            \n Password must have a minimum length of 4 characters \
                                            \n Password cannot exceed 12 characters \
                                            \n Password must have at least 1 special character. \
                                            \n Password must have at least 1 in capital case. \
                                            \n Password must have at least 1 small case character\
                                            \n Password must have at least 1 number. ";
                          hasErr = true;
                          /* Password Required check */
                          if(!password.hasError('required'))
                          {
                            this.err_msg_icon[0].icon = 'check_circle';
                            this.err_msg_icon[0].icon_colr = '#45A163';
                                
                                  /*Password minlength check */
                                  if(!password.hasError('minlength')){
                                    this.err_msg_icon[1].icon = 'check_circle';
                                    this.err_msg_icon[1].icon_colr = '#45A163';
                                     /*Password maxlength check */
                                      if(!password.hasError('maxlength')){
                                        this.err_msg_icon[2].icon = 'check_circle';
                                        this.err_msg_icon[2].icon_colr = '#45A163';
                                      } 
                                      else{
                                        this.err_msg_icon[2].icon = 'cancel';
                                        this.err_msg_icon[2].icon_colr = '#f44336';
                                      }
                                     } 
                                    else{
                                      this.err_msg_icon[1].icon = 'cancel';
                                      this.err_msg_icon[1].icon_colr = '#f44336';
                                    }
                                    
                                   /*Password Special Character check */
                                  if(!password.hasError('hasSpecialCharacters')){
                                      this.err_msg_icon[3].icon = 'check_circle';
                                      this.err_msg_icon[3].icon_colr = '#45A163';
                                    }
                                  else{
                                      this.err_msg_icon[3].icon = 'cancel';
                                      this.err_msg_icon[3].icon_colr = '#f44336';
                                  }
                                  /*Password Capital Case check */
                                  if(!password.hasError('hasCapitalCase')){
                                    this.err_msg_icon[4].icon = 'check_circle';
                                    this.err_msg_icon[4].icon_colr = '#45A163';
                                  }
                                  else{
                                      this.err_msg_icon[4].icon = 'cancel';
                                      this.err_msg_icon[4].icon_colr = '#f44336';
                                  }
                                 
                                   /*Password SmallCase check */
                                   if(!password.hasError('hasSmallCase')){
                                    this.err_msg_icon[5].icon = 'check_circle';
                                    this.err_msg_icon[5].icon_colr = '#45A163';
                                  }
                                  else{
                                      this.err_msg_icon[5].icon = 'cancel';
                                      this.err_msg_icon[5].icon_colr = '#f44336';
                                  }
                                  //  /*Password Number check */
                                  if(!password.hasError('hasNumber')){
                                    this.err_msg_icon[6].icon = 'check_circle';
                                    this.err_msg_icon[6].icon_colr = '#45A163';
                                  }
                                  else{
                                      this.err_msg_icon[6].icon = 'cancel';
                                      this.err_msg_icon[6].icon_colr = '#f44336';
                                  }
                          }
                          else{
                            this.err_msg_icon[0].icon = 'cancel';
                            this.err_msg_icon[0].icon_colr = '#f44336';
                          } 
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
