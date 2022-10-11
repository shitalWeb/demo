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

  getLoginData(){
    const data=this.managedataService.getAuthdata().find((_:any)=>_.id == this.LoginStatus());
    return data
  }

  LoginStatus() {
    this.cookieValue = this.cookieService.get('authtoken');
   return this.cookieValue
  }
  logOut() {
    this.cookieValue = this.cookieService.delete('authtoken');
    this.cookieValue = this.cookieService.get('authtoken');
   return this.cookieValue
  }

   sinUpUser(userData:any) {
    const users = this.managedataService.getAuthdata();
    const user = users.find(
      (user: { email: string; password: string }) =>
        user.email.toLowerCase() === userData.email.trim()
    );
    if (user)  return false && user
    const newUser = {
      email: userData.email,
      password: userData.password,
      id: uuidv4(),
    };
    this.managedataService.setAuthdata([...users, newUser]);
    return true && newUser
  }

  logInUser(userData:any) {
    const users = this.managedataService.getAuthdata();
    const user = users.find(
      (user: { email: string; password: string }) =>
        user.email.toLowerCase() === userData.email &&
        user.password === userData.password
    );
     return !!user && user
  }

  addContact(contactData:any) {
   this.managedataService.setContactdata(contactData);
   return this.managedataService.getContactData(this.LoginStatus());

  }

  editContact(contactData:any) {
    const data= this.managedataService.getAppdata().contacts||[];
    const editData = data.map((contact:any) => {
      if (contact.id === contactData.id) {
        contact = contactData;
      }
      return contact;
    });
   this.managedataService.editContactdata(editData);
   return this.managedataService.getContactData(this.LoginStatus());

  }

  deleteContact(contactData:any) {
    const data= this.managedataService.getAppdata().contacts||[];
    const deleteData = data.filter((contact:any)=> contact.id!==contactData.id);
   this.managedataService.deleteContactdata(deleteData);
   return this.managedataService.getContactData(this.LoginStatus());
  }
}
