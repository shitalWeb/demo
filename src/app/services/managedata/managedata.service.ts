import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManagedataService {

  constructor() { }

  setAuthdata(data:any){
    localStorage.setItem('users', JSON.stringify(data));
  }
  
  getAuthdata(){
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
}
