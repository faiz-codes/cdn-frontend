import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeveloperProfileComponent } from './component/developer-profile/developer-profile.component';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "developer-profile"},
  {path: "developer-profile", component: DeveloperProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
