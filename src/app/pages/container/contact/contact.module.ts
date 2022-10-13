import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule } from '@angular/forms';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent ,PhonePipe} from './contact.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    ContactComponent,PhonePipe
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class ContactModule { }
