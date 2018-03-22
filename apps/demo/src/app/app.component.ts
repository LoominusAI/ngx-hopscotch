import {Component, OnInit} from '@angular/core';

import {HopscotchService} from 'ngx-hopscotch';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _hopscotchService: HopscotchService) {}

  public ngOnInit(): void {
    this._hopscotchService.configure([
      {
        stepIndex: 0,
        stepDef: {
          target: 'contact',
          placement: 'left',
          content: "Thank you for trying the ngx-hopscotch demo. The next step's target doesn't exist yet until you click the Next button.",
          title: "Welcome to ngx-hopscotch demo!",
          multipage: true
        }
      },
      {
        stepIndex: 1,
        stepDef: {
          target: '.list-group',
          placement: 'right',
          content: "This step was triggered from the prior step's onNext callback. The next step's target doesn't exist yet until you click the Next button.",
          title: "Router Navigated Step",
          multipage: true
        }
      },
      {
        stepIndex: 2,
        stepDef: {
          target: 'item',
          placement: 'right',
          content: "This step was triggered from the prior step's onNext callback. This is the last step, but you can click the Back button to return to the previous step.",
          title: "Auto Selected Item",
          xOffset: 80
        }
      }
    ]);
  }
}
