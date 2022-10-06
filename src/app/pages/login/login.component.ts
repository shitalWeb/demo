import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators,FormArray,FormBuilder,AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
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

  constructor(private formBuilder: FormBuilder,private router:Router,public userService:UserService) {}

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
    
    this.userService.logInUser(this.loginForm.value).then((result:any) => {
        if(result){
          this.userService.setLoginStatus(result.id);
          this.router.navigate(['/contact']);
        }
        else{
          alert('Username or password incorrect!')
        }
      })
      .catch((error:any) => {
       
      })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
}
