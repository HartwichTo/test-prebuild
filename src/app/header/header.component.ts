import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable, timer } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  clock$ = new Observable<Date>();

  ngOnInit(): void {
    this.clock$ = timer(0, 500).pipe(map(() => new Date()));
  }
}
