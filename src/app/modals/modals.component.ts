import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbOffcanvas, OffcanvasDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user/user.service';
@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.scss']
})
export class ModalsComponent implements OnInit {
  closeResult = '';
  userName="";
  constructor(private offCanvasService: NgbOffcanvas,private router:Router,private userService: UserService) { }

  ngOnInit(): void {
    this.userName=this.userService.getLoginData().email;
  }

  open(content:any) {
      this.offCanvasService.open(content, { backdrop: false,backdropClass:'custome' });
  }

  logOut(){
    const loginData=this.userService.logOut();
    if (!loginData) this.router.navigate(['login'])
  }

  navigation(data:string){
    this.router.navigate([data]);
    this.offCanvasService.dismiss('Cross click')
  }

  private getDismissReason(reason: any): string {
    if (reason === OffcanvasDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on the backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
