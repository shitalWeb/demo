import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManagedataService {

  constructor() { }

  getAppdata() {
    return JSON.parse(localStorage.getItem('appData') || '{}');
  }

  getAuthdata() {
    return this.getAppdata().users || [];
  }

  getContactData(userId: string) {
    return (this.getAppdata().contacts || []).filter((contact: any) => {
      return contact.userid === userId
    })
  }

  setAuthdata(data: any) {
    const appData = this.getAppdata();
    localStorage.setItem('appData', JSON.stringify({ ...appData, users: data }));
  }
  
  setContactdata(contactData: any) {
    try {
    const appData = this.getAppdata();
    localStorage.setItem('appData', JSON.stringify({ ...appData, contacts: [...(appData.contacts || []), contactData] }));
    } catch (error) {
    }
  }

  editContactdata(contactData: any) {
    const appData = this.getAppdata();
    localStorage.setItem('appData', JSON.stringify({ ...appData, contacts: contactData }));
  }

  deleteContactdata(contactData: any) {
    const appData = this.getAppdata();
    localStorage.setItem('appData', JSON.stringify({ ...appData, contacts: contactData }));
  }

}
