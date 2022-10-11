import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard', 
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {path: 'login', loadChildren: () => import('./pages/Authentication/login/login.module').then(m => m.LoginModule)},
      {path: 'register', loadChildren: () => import('../app/pages/Authentication/register/register.module').then(m => m.RegisterModule)},
    ]
  },
  {
    path: '',
    loadChildren: () => import('./pages/container/container.module').then(m => m.ContainerModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
