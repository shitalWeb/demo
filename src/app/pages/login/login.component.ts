import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators,FormArray,FormBuilder,AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 
  submitted = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder,private router:Router) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
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
      }
    );
  }

register(){
  this.router.navigate(['register'])
}

  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (user: { email: string; password: string }) =>
        user.email.toLowerCase() === this.loginForm.controls['email'].value.trim() &&
        user.password === this.loginForm.controls['password'].value
    );
    if (!user) return  alert('Please enter valid credentials')

    localStorage.setItem('authToken', user.id);
    return this.router.navigate(['/contact']);

  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
}
