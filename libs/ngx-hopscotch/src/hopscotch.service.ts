import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import _ from 'lodash';
import hopscotch from 'hopscotch';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import {ReadyOptions, TourStep} from '../index';

@Injectable()
export class HopscotchService {
  private _tour: any = {
    id: 'hopscotch-tour'
  };
  private _callout: any = {
    id: 'hopscotch-callout'
  };
  private _distinctSteps = {};
  private _readySubject = new BehaviorSubject<ReadyOptions>({ stepNum: -1, onNext: null });
  private _unsubscribeSubject = new Subject<any>();
  private _mgr = hopscotch.getCalloutManager();

  constructor(@Inject('tour') private tour: any, @Inject('callout') private callout: any) {
    this._tour = Object.assign({}, tour);
    this._callout = Object.assign({}, callout);
  }

  public addSteps(steps: TourStep[]) {
    const stepNums = _.orderBy(steps, ['stepNum'], ['asc']).map(step => step.stepNum);
    _.reduce(
      steps,
      (result: any, obj: TourStep, index) => {
        result[obj.stepNum] = {
          stepDef: obj.stepDef
        };
        return result;
      },
      this._distinctSteps
    );
    // Order the steps by stepNum.
    const sortedPairs: any[] = _.chain(this._distinctSteps)
      .toPairs()
      .sortBy(0)
      .value();
    this._tour.steps = _.values(_.fromPairs(sortedPairs)).map(v => v.stepDef);
    this._readySubject
      .asObservable()
      .switchMap(options => Observable.of(options))
      .takeUntil(this._unsubscribeSubject)
      .subscribe((options: ReadyOptions) => {
        if (_.isNil(options) && !hopscotch.getState() && !this._mgr.getCallout(this._callout.id)) {
          this._mgr.createCallout(this._callout);
        } else {
          if (options && _.includes(stepNums, options.stepNum)) {
            if (options.onNext) {
              this._tour.steps[options.stepNum].multipage = true;
              this._tour.steps[options.stepNum].onNext = () => {
                options.onNext();
                hopscotch.showStep(options.stepNum + 1);
              };
            }
            if (options.onPrev) {
              this._tour.steps[options.stepNum].onPrev = () => {
                options.onPrev();
                // Reset the tour to the previous step.
                hopscotch.showStep(options.stepNum - 1);
              }
            }
            const requestedState = `${this._tour.id}:${options.stepNum}`;
            const state = hopscotch.getState();
            if (options.stepNum === 0) {
              if (hopscotch.isActive) {
                hopscotch.endTour();
              }
              this._mgr.removeCallout(this._callout.id);
              hopscotch.startTour(this._tour);
            } else if (state && state === requestedState) {
              hopscotch.startTour(this._tour, options.stepNum);
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

  public ready(options?: ReadyOptions): void {
    this._readySubject.next(options);
  }
}
