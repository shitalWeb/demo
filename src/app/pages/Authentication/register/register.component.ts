import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import Validation from '../../../utils/validation';
import { Router } from '@angular/router';
import { ToastInfo } from 'src/app/interface/toast';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  toasts: ToastInfo[] = [];
  submitted = false;
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {

        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
  }

  signIn() {
    this.router.navigate(['login'])
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    const result = this.userService.sinUpUser(this.registerForm.value)
    if (result) {
      this.router.navigate(['login']);
    }
    else {
      alert('Already exist user!')
    }

  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }
}
