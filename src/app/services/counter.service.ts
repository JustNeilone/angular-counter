// Angular imports
import { Injectable } from '@angular/core';

// Third party imports
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  public timeRemaining: BehaviorSubject<number> = new BehaviorSubject(0);
  public isOneStepEnabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isTwoStepEnabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public isThreeStepEnabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public counterChanged: BehaviorSubject<boolean> = new BehaviorSubject(false);
}
