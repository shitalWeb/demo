import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/services/guards/auth.guard';
import { ContainerComponent } from './container.component';

const routes: Routes = [
  {
    path: '',
    component:ContainerComponent,
    children: [
      {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]},
      {path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule), canActivate: [AuthGuard]},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule { }
