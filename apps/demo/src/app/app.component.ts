import { Component, OnInit } from '@angular/core';

import {HopscotchService} from 'ngx-hopscotch';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _hopscotchService: HopscotchService) {}

  public ngOnInit(): void {
    this._hopscotchService.addSteps([
      {
        stepNum: 0,
        stepDef: {
          target: 'contact',
          placement: 'left',
          content: "Thank you for trying the ngx-hopscotch demo.",
          title: "Welcome to ngx-hopscotch demo!",
        }
      },
      {
        stepNum: 1,
        stepDef: {
          target: '.list-group',
          placement: 'right',
          content: "This step was triggered from the prior step's onNext callback.",
          title: "Router Navigated Step"
        }
      },
      {
        stepNum: 2,
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
}
