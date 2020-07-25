import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { ListUserComponent } from './list/list-user.component';

const routes: Routes = [
  {path: '', component: ListUserComponent},
  {path: 'add', component: AddUserComponent},
  { path: 'edit/:id', component: AddUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
