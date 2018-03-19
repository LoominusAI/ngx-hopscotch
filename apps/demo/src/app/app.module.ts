import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import {RouterModule, Routes} from '@angular/router';

import { NgxHopscotchModule } from 'ngx-hopscotch';

const routes: Routes = [
  { path: '',       pathMatch: 'full', redirectTo: 'site' },
  { path: 'site',   loadChildren: './site#SiteModule' },
];

@NgModule({
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    NgxHopscotchModule.forRoot(
      {
        id: 'hello-demo',
        showPrevButton: true
      },
      {
        id: 'demo-callout',
        target: 'tour',
        placement: 'bottom',
        content: 'Hello, welcome to the ngx-hopscotch demo! Click the bus icon to start the tour.',
        title: 'Take the Tour'
      }
    )
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
