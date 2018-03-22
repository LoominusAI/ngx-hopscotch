# ngx-hopscotch

An injectable Angular service that provides an opinionated abstraction of [Hopscotch](https://github.com/linkedin/hopscotch) for adding product 
tours to Angular apps. ngx-hopscotch was built with [Angular CLI](https://github.com/angular/angular-cli) and [Nrwl Schematics](https://github.com/nrwl/nx) 
and packaged by [ng-packagr](https://github.com/dherges/ng-packagr).

[![npm package](https://img.shields.io/npm/v/ngx-hopscotch.svg?style=flat-square)](https://www.npmjs.com/package/ngx-hopscotch)

## Installation

```
npm install ngx-hopscotch --save
```

## Usage

Import NgxHopscotchModule.forRoot() in your AppModule and optionally provide initial properties for the tour and callout.

```typescript
import { NgxHopscotchModule } from 'ngx-hopscotch';

@NgModule({
  imports: [
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
  ]
})
export class AppModule {}
```

Configure your tour steps in your root AppComponent.

```typescript
import {Component, OnDestroy, OnInit} from '@angular/core';

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
```

Call HopscotchService.init() in your "home" component's ngAfterViewInit hook - this component contains the target for your callout.

```typescript
  public ngAfterViewInit(): void {
    this._hopscotchService.init();
  }
```

Create a handler for your "Start Tour" button which calls the step() function to start the tour.

```typescript
  public startTour(): void {
    // Hack to reload site by first navigating away from the desired route.
    this._router.navigateByUrl('/site/home').then(() => {
      this._router.navigateByUrl(`/site`)
        .then(() => {
          this._hopscotchService.step(0);
        })
    })
  }
```


