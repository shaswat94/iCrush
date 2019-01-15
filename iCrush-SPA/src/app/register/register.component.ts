import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { NgForm, FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() registerModeFromHome: boolean;
  @Output() cancelRegister = new EventEmitter();
  hide = true;
  model: any = {};
  registerForm: FormGroup;
  gender = ['Male', 'Female'];

  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8),
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

  register(form: NgForm) {
    // this.authService.register(this.model).subscribe(() => {
    //   this.alertify.success('registeration successful');
    //   form.reset();
    // }, (error) => {
    //   this.alertify.error(error);
    // });
    console.log(this.registerForm.value);
  }

  cancel() {
    this.cancelRegister.emit(!this.registerModeFromHome);
  }

  passwordMatchValidator(g: FormGroup): any {
    return g.get('password').value === g.get('confirmPassword').value ? null : g.get('confirmPassword').setErrors({ 'mismatch': true });
  }

  getErrorMessage() {
    const passwordField = this.registerForm.get('password');
    const username = this.registerForm.get('username');
    const confirmPassword = this.registerForm.get('confirmPassword');

    return username.hasError('required') ? 'Username is required' :
      passwordField.hasError('required') ? 'Password is required' :
        passwordField.hasError('minlength') ? 'Password must have a minimum length of 4 characters' :
          passwordField.hasError('maxlength') ? 'Password cannot exceed 8 characters' :
            passwordField.hasError('hasSpecialCharacters') ? 'Password must have at least 1 special character' :
              passwordField.hasError('hasCapitalCase') ? 'Password must have at least 1 in capital case' :
                passwordField.hasError('hasNumber') ? 'Password must have at least 1 number' :
                  confirmPassword.hasError('required') ? 'Confirm Password is required' :
                    confirmPassword.hasError('mismatch') ? 'Passwords doesnot match' : '';

    // if (username.hasError('required')) {
    //   return 'Please enter a username';
    // }

    // if (passwordField.hasError('required')) {
    //   return 'Please enter a password';
    // }

    // if (passwordField.hasError('minlength')) {
    //   return 'Password must have a minimum length of 4 characters';
    // }

    // if (passwordField.hasError('maxlength')) {
    //   return 'Password cannot exceed 8 characters';
    // }

    // if (passwordField.hasError('hasSpecialCharacters')) {
    //   return 'Password must have at least 1 special character';
    // }

    // if (passwordField.hasError('hasCapitalCase')) {
    //   return 'Password must have at least 1 in capital case';
    // }

    // if (passwordField.hasError('hasNumber')) {
    //   return 'Password must have at least 1 number';
    // }

    // if (confirmPassword.hasError('required')) {
    //   return 'Confirm password is required';
    // }

    // if (confirmPassword.hasError('mismatch')) {
    //   return 'Password must match';
    // }
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
