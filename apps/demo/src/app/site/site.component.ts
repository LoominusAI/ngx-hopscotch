import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { HopscotchService } from 'ngx-hopscotch';

@Component({
  selector: 'app-site',
  templateUrl: 'site.component.html',
  styleUrls: ['site.component.css']
})
export class SiteComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _hopscotchService: HopscotchService) { }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    this._hopscotchService.ready();
  }

  public ngOnDestroy(): void {
    this._hopscotchService.end();
  }

  public startTour(): void {
    // Hack to reload site by first navigating away from the desired route.
    this._router.navigateByUrl('/site/home').then(() => {
      this._router.navigateByUrl(`/site`)
        .then(() => {
          this._hopscotchService.ready({
            stepNum: 0,
            onNext: () => {
              this._router.navigate(['./home'], { relativeTo: this._route });
            }
          });
        })
    })
  }
}
