import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CookieService } from 'ngx-cookie-service';
import { ManagedataService } from '../managedata/managedata.service';
import { ConstantPool } from '@angular/compiler';
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

  LoginStatus() {
    this.cookieValue = this.cookieService.get('authtoken');
   return this.cookieValue
  }

  async sinUpUser(userdata:any) {
    console.log(userdata)
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
      this.managedataService.setAuthdata([...users, newUser]);
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

  async addContact(contactdata:any) {
   this.managedataService.setContactdata(contactdata);
   return this.managedataService.getContactData(this.LoginStatus());

  }

  async editContact(contactdata:any) {
    const data= this.managedataService.getAppdata().contacts||[];
    const editData = data.map((contact:any) => {
      if (contact.id === contactdata.id) {
        contact = contactdata;
      }
      return contact;
    });
   this.managedataService.editContactdata(editData);
   return this.managedataService.getContactData(this.LoginStatus());

  }

  async deleteContact(contactdata:any) {
    const data= this.managedataService.getAppdata().contacts||[];
    const deleteData = data.filter((contact:any)=> contact.id!==contactdata.id);
    console.log(deleteData);
   this.managedataService.deleteContactdata(deleteData);
   return this.managedataService.getContactData(this.LoginStatus());
  }
}
