import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { HopscotchService } from './hopscotch.service';

@NgModule({
  imports: [CommonModule],
  exports: []
})
export class NgxHopscotchModule {
  public static forRoot(tour?: any, callout?: any): ModuleWithProviders {
    return {
      ngModule: NgxHopscotchModule,
      providers: [
        HopscotchService,
        {
          provide: 'tour',
          useValue: tour
        },
        {
          provide: 'callout',
          useValue: callout
        }
      ]
    };
  }
}
