import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerRoutingModule } from './container-routing.module';
import { ContainerComponent } from './container.component';
import { ModalsModule } from 'src/app/modals/modals.module';

@NgModule({
  declarations: [
    ContainerComponent
  ],
  imports: [
    CommonModule,
    ContainerRoutingModule,
    ModalsModule
  ],
  
})
export class ContainerModule { }
