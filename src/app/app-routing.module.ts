import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentGeneratorComponent } from './document-generator/document-generator.component';

const routes: Routes = [
  {
    path:'',redirectTo:'auto-doc-generator',pathMatch:'full'
  },
  {
    path:'auto-doc-generator',component:DocumentGeneratorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
