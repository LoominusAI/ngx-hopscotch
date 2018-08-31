import {Inject, Injectable} from '@angular/core';
import {switchMap, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, of, Subject} from 'rxjs';
import _ from 'lodash';
import hopscotch from 'hopscotch';

import {StepOptions, TourStep} from '../index';

declare interface ReadyOptions {
  stepIndex: number;
  stepOptions: StepOptions;
}

@Injectable()
export class HopscotchService {

  private _tour: any = {
    id: 'ngx-hopscotch-tour'
  };
  private _callout: any = {
    id: 'ngx-hopscotch-callout'
  };
  private _distinctSteps = {};
  private _readySubject = new BehaviorSubject<ReadyOptions>({ stepIndex: -1, stepOptions: null });
  private _unsubscribeSubject = new Subject<any>();
  private _mgr = hopscotch.getCalloutManager();

  constructor(@Inject('tour') private _tour0: any, @Inject('callout') private _callout0: any) {
    this._tour = _.cloneDeep(_tour0);
    this._callout = _.cloneDeep(_callout0);
  }

  public configure(steps: TourStep[]) {
    const stepIndexes = _.orderBy(steps, ['stepIndex'], ['asc']).map(step => step.stepIndex);
    _.reduce(
      steps,
      (result: any, obj: TourStep, index) => {
        const original = result[obj.stepIndex];
        result[obj.stepIndex] = {
          stepDef: _.cloneDeep(original ? Object.assign({}, original.stepDef, obj.stepDef) : obj.stepDef)
        };
        return result;
      },
      this._distinctSteps
    );
    // Order the steps by stepIndex.
    const sortedPairs: any[] = _.chain(this._distinctSteps)
      .toPairs()
      .sortBy(0)
      .value();
    this._tour.steps = _.values(_.fromPairs(sortedPairs)).map(v => v.stepDef);
    this._readySubject
      .asObservable().pipe(
       switchMap(options => of(options))
      , takeUntil(this._unsubscribeSubject))
      .subscribe((options: ReadyOptions) => {
        if (options && _.includes(stepIndexes, options.stepIndex)) {
          if (options.stepOptions && options.stepOptions.onNext) {
            this._tour.steps[options.stepIndex].onNext = () => {
              options.stepOptions.onNext();
              hopscotch.showStep(options.stepIndex + 1);
            };
          }
          if (options.stepOptions && options.stepOptions.onPrev) {
            this._tour.steps[options.stepIndex].onPrev = () => {
              options.stepOptions.onPrev();
              // Reset the tour to the previous step.
              hopscotch.showStep(options.stepIndex - 1);
            }
          }
          const requestedState = `${this._tour.id}:${options.stepIndex}`;
          const state = hopscotch.getState();
          if (options.stepIndex === 0 || state === requestedState) {
            hopscotch.startTour(this._tour, options.stepIndex);
            if (this._callout && this._mgr.getCallout(this._callout.id)) {
              this._mgr.removeCallout(this._callout.id);
            }
          }
        }
      });
  }

  public end(): void {
    this._unsubscribeSubject.next();
    this._unsubscribeSubject.complete();
    this._mgr.removeCallout(this._callout.id);
    if (hopscotch.isActive) {
      hopscotch.endTour();
    }
  }

  public init(): void {
    if (this._tourStarted()) {
      hopscotch.startTour(this._tour);
    } else if (this._callout && !this._mgr.getCallout(this._callout.id)) {
      this._mgr.createCallout(this._callout);
    }
  }

  public step(index: number, options?: StepOptions): void {
    this._readySubject.next({ stepIndex: index, stepOptions: options });
  }

  private _tourStarted(): boolean {
    const state = hopscotch.getState();
    return state && state.indexOf(`${this._tour.id}:`) === 0;
  }
}
