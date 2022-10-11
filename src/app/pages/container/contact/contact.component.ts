import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup,FormControl,Validators,FormArray,FormBuilder,AbstractControl} from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { ManagedataService } from 'src/app/services/managedata/managedata.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  closeResult = '';
  submitted=false;
  contactList:any=[];
  contactForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phoneno: new FormControl(''),
    image: new FormControl('')
  });
  edit_id='';
  delete_id='';
  
  constructor(private modalService: NgbModal,private formBuilder: FormBuilder,private userService:UserService,private manageDataService:ManagedataService) { }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneno:['',   [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],],
        profileimg: [''] 
      }
    );
    this.getContactData()
  }

  onSubmit(){
    // console.log(this.contactForm.controls['profileimg'].value)
    // console.log(this.contactForm.value.profileimg)
    // return
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }
    this.contactForm.value.profileimg=this.contactForm.controls['profileimg'].value;
    if(this.edit_id!==""){
      const result=this.userService.editContact({...this.contactForm.value,id:this.edit_id,userid:this.userService.LoginStatus()});
        if(result){
          this.getContactData();
          this.closePopup();
        }
    }
    else{
      const result=this.userService.addContact({...this.contactForm.value,id:uuidv4(),userid:this.userService.LoginStatus()});
          if(result){
            this.getContactData();
            this.closePopup();
      }
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.contactForm.controls;
  }

  getContactData(){
    this.contactList = this.manageDataService.getContactData(this.userService.LoginStatus());
    console.log(this.contactList)
  }

  editData(contactData:any,modelContent:any){
    this.contactForm.patchValue({
      name:contactData.name ,
      email:contactData.email,
      phoneno:contactData.phoneno,
      profileimg:contactData.profileimg
    });
    this.open(modelContent);
    this.edit_id=contactData.id;
  }

  deleteData(contactData:any,modelContent:any){
    this.delete_id=contactData.id;
    this.open(modelContent);
  }

  deleteContact(){
    this.userService.deleteContact({...this.contactForm.value,id:this.delete_id,userid:this.userService.LoginStatus()}).then((result:any) => {
      if(result){
        this.getContactData();
        this.closeDeletePopup();
      }
    })
    .catch((error:any) => {
    })
  }

uploadImage(e: any) {
    const { files } = e.target;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
      // this.contactForm.patchValue({profileimg:reader.result as string});
      console.log(reader.result)
      // this.contactForm.setValue({profileimg:reader.result as string});
      this.contactForm.controls['profileimg'].setValue(reader.result as string);
      console.log(this.contactForm.value)
      };
      reader.readAsDataURL(file);
    }
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  closePopup(){
    this.modalService.dismissAll('Cross click');
    this.contactForm.reset();
    this.submitted=false;
    this.edit_id='';
  }

  closeDeletePopup(){
    this.modalService.dismissAll('Cross click');
    this.delete_id='';
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
