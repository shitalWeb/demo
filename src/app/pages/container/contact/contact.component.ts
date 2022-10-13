import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup,FormControl,Validators,FormArray,FormBuilder,AbstractControl} from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { ManagedataService } from 'src/app/services/managedata/managedata.service';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
})
export class PhonePipe {
  transform(rawNum: string) {
    rawNum = '+91' + rawNum;

    const countryCodeStr = rawNum.slice(0, 3);
    const areaCodeStr = rawNum.slice(3, 7);
    const midSectionStr = rawNum.slice(7, 10);
    const lastSectionStr = rawNum.slice(10);

    return `${countryCodeStr} (${areaCodeStr})${midSectionStr}-${lastSectionStr}`;
  }
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  @ViewChild('table')table:any= ElementRef;
  @ViewChild('inputFile') inputFile:any= ElementRef;
  closeResult = '';
  submitted=false;
  contactList:any=[];
  edit_id='';
  delete_id='';
  exportActive:boolean = false;
  spinnerEnabled = false;
  keys:any;
  dataSheet = new Subject();
  isExcelFile=false;
  contactForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phoneno: new FormControl(''),
    image: new FormControl('')
  });
  
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

  export()
  {
    this.exportActive = true;
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'contact.xlsx');
  }

  onChange(evt:any) {
    let data:any, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        data = XLSX.utils.sheet_to_json(ws);
      };
      reader.readAsBinaryString(target.files[0]);
      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data);
        for(var i=0;i<data.length;i++){
          const contactData={
            name:data[i].Name,
            email:data[i].Email,
            phoneno:data[i].PhoneNo,
            profileimg:'',
            id:uuidv4(),
            userid:this.userService.LoginStatus()
          }
          const result=this.userService.addContact(contactData);
          if(result){
            this.getContactData();
            this.closePopup();
          }
        }
        this.removeData()
      }
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }
  
  removeData() {
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = null;
  }

  onSubmit(){
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
    const result = this.userService.deleteContact({...this.contactForm.value,id:this.delete_id,userid:this.userService.LoginStatus()});
     if(result){
        this.getContactData();
        this.closeDeletePopup();
      }
   
  }

uploadImage(e: any) {
    const { files } = e.target;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
      this.contactForm.controls['profileimg'].setValue(reader.result as string);
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
