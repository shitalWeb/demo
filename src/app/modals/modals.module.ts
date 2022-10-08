import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalsComponent } from './../modals/modals.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ModalsComponent,
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [
    ModalsComponent,
  ]
})
export class ModalsModule { }
