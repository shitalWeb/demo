import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators,FormArray,FormBuilder,AbstractControl} from '@angular/forms';
import Validation from '../../utils/validation';
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
  constructor(private formBuilder: FormBuilder,private router:Router,private userService:UserService) {}
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
    
    
    this.userService.sinUpUser(this.registerForm.value).then((result:any) => {
        if(result){
          this.userService.setLoginStatus(result.id);
          this.router.navigate(['/contact']);
        }
        else{
          alert('Already exist user!')
        }
      })
      .catch((error:any) => {
      })
  }
  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }
}
