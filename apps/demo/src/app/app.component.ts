import {Component, OnDestroy, OnInit} from '@angular/core';

import {HopscotchService} from 'ngx-hopscotch';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private _hopscotchService: HopscotchService) {}

  public ngOnInit(): void {
    this._hopscotchService.configure([
      {
        stepIndex: 0,
        stepDef: {
          target: 'contact',
          placement: 'left',
          content: "Thank you for trying the ngx-hopscotch demo.",
          title: "Welcome to ngx-hopscotch demo!",
        }
      },
      {
        stepIndex: 1,
        stepDef: {
          target: '.list-group',
          placement: 'right',
          content: "This step was triggered from the prior step's onNext callback.",
          title: "Router Navigated Step"
        }
      },
      {
        stepIndex: 2,
        stepDef: {
          target: 'item',
          placement: 'right',
          content: "This step was triggered from the prior step's onNext callback.",
          title: "Auto Selected Item",
          xOffset: 80
        }
      }
    ]);
  }

  public ngOnDestroy(): void {
    this._hopscotchService.end();
  }
}
