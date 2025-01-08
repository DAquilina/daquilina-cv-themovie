import { Component } from '@angular/core';
import { SomethingInterestingComponent } from './something-interesting.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SomethingInterestingComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
