import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CookieService } from 'ngx-cookie-service';
import { ManagedataService } from '../managedata/managedata.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  cookieValue:any;
  constructor(private cookieService: CookieService,private managedataService:ManagedataService) {   
  }

  setLoginStatus(value:string) {
    this.cookieService.set('authtoken', value);
  }

  get LoginStatus() {
    this.cookieValue = this.cookieService.get('authtoken');
   return this.cookieValue
  }

  async sinUpUser(userdata:any) {
    const users = this.managedataService.getAuthdata();
    const user = users.find(
      (user: { email: string; password: string }) =>
        user.email.toLowerCase() === userdata.email.trim()
    );
    if (user)  return false && user
    const newUser = {
      email: userdata.email,
      password: userdata.password,
      id: uuidv4(),
    };
    const updatedUsers = [...users, newUser];
    this.managedataService.setAuthdata(updatedUsers)
    return true && newUser
  }

  async logInUser(userdata:any) {
    const users = this.managedataService.getAuthdata();
    const user = users.find(
      (user: { email: string; password: string }) =>
        user.email.toLowerCase() === userdata.email &&
        user.password === userdata.password
    );
     return !!user && user
  }
}
