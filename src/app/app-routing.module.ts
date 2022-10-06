import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './pages/contact/contact.component';
import { AuthGuard } from './services/guards/services/auth.guard';
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
    component: ContactComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
