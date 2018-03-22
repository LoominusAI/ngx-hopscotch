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

Optionally, customize your tour steps with StepOptions callbacks. There's two ways in which you can add these callbacks to your tour steps.

The first way is with the HopscotchService.step() function and this way can be placed in any of the Angular component lifecycle hooks as appropriate for your app. 

```typescript
  this._hopscotchService.step(1, {
      onPrev: () => {
        this._router.navigate(['/site']);
      },
      onNext: () => {
        if (this.items) {
          this.selectItem(this.items[0]);
        }
      }
    });
```

The other way to add the callbacks is with the HopscotchService.configure() function, and this way should only be done in the ngOnInit hook.

```typescript
    this._hopscotchService.configure([
      {
        stepIndex: 0,
        stepDef: {
          onNext: () => {
            this._router.navigate(['./home'], { relativeTo: this._route });
          }
        }
      }
    ]);
```

Call HopscotchService.init() in your "main" component's ngAfterViewInit hook -- this component contains the target for your callout.

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

Call HopscotchService.end() in your "main" component's ngOnDestroy hook -- again this should be the component that contains the target for your callout.

```typescript
  public ngOnDestroy(): void {
    this._hopscotchService.end();
  }
```

### Considerations for Latent Targets

When configuring your tour steps, pay close attention to the steps with targets that aren't currently visible - such targets could be part of a lazy loaded component, 
a conditionally included template by way of the ngIf directive, etc. If such a step exists, then you must add the multipage property to the definition of its **previous** step. 
For example, consider steps 0 and 1 above - step 0 has its multipage property set because step 1's target appears at a different route, and step 1 has its multipage property set 
because step 2's target is conditioned on an ngIf.

In the ngAfterViewInit hook of the latent target's component, you'll need to call HopscotchService.step() with the appropriate index to resume the tour.

## HopscotchService API  

### TourStep

- **stepIndex: number** - Zero-based index step.

- **stepDef: any** - Technically, this can be anything understood by Hopscotch, but for ngx-hopscotch the only callbacks that are supported are onPrev and onNext.

### StepOptions

- **onPrev: () => void** - Handler for a step's Back button.

- **onNext: () => void** - Handler for a step's Next button.

### Functions

- **configure(steps:TourStep[])** - Call this function in your root AppComponent's ngOnInit hook to define all the steps of your tour. You can also use this function to add StepOptions 
callbacks to your tour steps in any one of your component's lifecycle hooks as appropriate for your app.

- **init()** - Call this function in the ngAfterViewInit hook of the component that contains the target for your callout. If you didn't specify a callout in NgxHopscotchModule.forRoot(), 
then this function will resume your tour at the current step.

- **step(index:number, options?:StepOptions)** - Call this function with an index of 0 to start the underlying Hopscotch tour. You'll only need to call this function again for any latent steps in your tour.

- **end()** - Stop the underlying Hopscotch tour and release resources.

