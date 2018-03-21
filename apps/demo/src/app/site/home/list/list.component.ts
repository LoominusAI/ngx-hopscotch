import {Component, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';

import {HopscotchService} from 'ngx-hopscotch';

@Component({
  selector: 'app-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit {

  @Output() public itemEvent = new EventEmitter<string>();
  public items: string[];
  public selectedItem: string;

  constructor(private _router: Router,
              private _hopscotchService: HopscotchService) { }

  public ngOnInit(): void {
    this.items = Array(10).fill(null).map((x, i) => `Item ${i + 1}`);
  }

  public ngAfterViewInit(): void {
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
  }

  public selectItem(item: string): void {
    this.selectedItem = item;
    this.itemEvent.emit(item);
  }
}
