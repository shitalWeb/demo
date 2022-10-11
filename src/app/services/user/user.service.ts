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
    let data= this.managedataService.getAppdata().contacts||[];
    const findData = data.findIndex((contact:any)=> contact.id===contactData.id);
    data[findData]=contactData;
   this.managedataService.editContactdata(data);
   return this.managedataService.getContactData(this.LoginStatus());
  }

  deleteContact(contactData:any) {
    let data= this.managedataService.getAppdata().contacts||[];
    const deleteData = data.findIndex((contact:any)=> contact.id===contactData.id);
    data.splice(deleteData,1);
   this.managedataService.deleteContactdata(data);
   return this.managedataService.getContactData(this.LoginStatus());
  }
}
