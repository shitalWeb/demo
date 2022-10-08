import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
const routes: Routes = [
  
  {
    path: '',
    redirectTo: '/login', 
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {path: 'login', loadChildren: () => import('../app/pages/login/login.module').then(m => m.LoginModule)},
      {path: 'register', loadChildren: () => import('../app/pages/register/register.module').then(m => m.RegisterModule)},
    ]
  },
  {
    path: 'contact',
    loadChildren: () => import('../app/pages/contact/contact.module').then(m => m.ContactModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../app/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
