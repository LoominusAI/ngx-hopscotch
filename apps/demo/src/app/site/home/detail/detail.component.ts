import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {HopscotchService} from 'ngx-hopscotch';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewInit {

  @Input() public item;

  constructor(private _router: Router,
              private _hopscotchService: HopscotchService) { }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    this._hopscotchService.step(2, {
      onPrev: () => {
        this._router.navigateByUrl('/site')
          .then(() => this._router.navigateByUrl('/site/home'));
      }
    });
  }
}
