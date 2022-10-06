import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators,FormArray,FormBuilder,AbstractControl} from '@angular/forms';
import Validation from '../../utils/validation';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { ToastInfo } from 'src/app/interface/toast';
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
  constructor(private formBuilder: FormBuilder,private router:Router) {}
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

  signIn(){
    this.router.navigate(['login'])
  }
  onSubmit(){
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (user: { email: string; password: string }) =>
        user.email.toLowerCase() === this.registerForm.controls['email'].value.trim()
    );
    if (user)
      return alert('Already dxist')
      // this.toasts.show( 'User alrady exist!', 'Eror' ,1000);
    const newUser = {
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value,
      id: uuidv4(),
    };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('authToken', newUser.id);
    return this.router.navigate(['contact']);
  }
  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }
}
