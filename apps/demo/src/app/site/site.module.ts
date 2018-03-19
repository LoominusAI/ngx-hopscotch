import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import { SiteComponent } from './site.component';

const routes: Routes = [
  {
    path: '', component: SiteComponent, children: [
      { path: 'home', loadChildren: './home#HomeModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SiteComponent]
})
export class SiteModule { }
