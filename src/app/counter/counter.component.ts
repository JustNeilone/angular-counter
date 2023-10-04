// Angular imports
import { Component, OnDestroy, OnInit } from '@angular/core';

// Application imports
import { CounterService } from '../services/counter.service';
import { CounterSteps } from './counter.models';

// Third party imports
import { combineLatest, interval, of, Subject, takeUntil, takeWhile, scan, asyncScheduler, timer } from 'rxjs';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit, OnDestroy {
  private destroyTrigger: Subject<void> = new Subject<void>();
  private timerTrigger: Subject<void> = new Subject<void>();

  protected timeRemaining$ = this.counterService.timeRemaining.asObservable();
  protected isOneStepEnabled$ = this.counterService.isOneStepEnabled.asObservable();
  protected isTwoStepEnabled$ = this.counterService.isTwoStepEnabled.asObservable();
  protected isThreeStepEnabled$ = this.counterService.isThreeStepEnabled.asObservable();
  protected counterChanged$ = this.counterService.counterChanged.asObservable();

  private timeRemaining: number = 0;
  public counterTimeout: any = null;

  public counterSteps = CounterSteps;

  constructor(private counterService: CounterService) { }

  ngOnInit(): void {
    this.counterService.isOneStepEnabled.next(true);
    this.counterService.isTwoStepEnabled.next(true);
    this.counterService.isThreeStepEnabled.next(true);

    this.initializeListeners();
  }

  private initializeListeners(): void {
    combineLatest([
      this.timeRemaining$,
      this.isOneStepEnabled$,
      this.isTwoStepEnabled$,
      this.isThreeStepEnabled$,
      this.counterChanged$
    ])
    .pipe(takeUntil(this.destroyTrigger))
    .subscribe(([timeRemaining, isOneStepEnabled, isTwoStepEnabled, isThreeStepEnabled, counterChanged]) => {
      if (!isOneStepEnabled || !isTwoStepEnabled || !isThreeStepEnabled) {
        this.counterTimeout = 10;
      }

      if (timeRemaining && counterChanged) {
        this.timerTrigger.next();
        this.timerTrigger.complete();
        this.timerTrigger = new Subject<void>();
        this.timeRemaining = timeRemaining;
        this.runCounterDecreaseTimer();
        this.counterService.counterChanged.next(false);
      }
    })
  }

  private runCounterDecreaseTimer() {
    interval(1000)
      .pipe(takeUntil(this.timerTrigger))
      .subscribe(() => {
        if (this.counterTimeout !== 0) {
          this.counterTimeout = this.counterTimeout - 1;
        } else {
          
          const countdown = (dueTime = 0, intervalOrScheduler = 1000, maxTicks = 0, scheduler = asyncScheduler) => timer(dueTime, intervalOrScheduler)
            .pipe(
              takeUntil(this.timerTrigger),
              // start with the maxTicks value and decrease every emit
              scan(remainingTicks => --remainingTicks, maxTicks),
              // stop emitting when maxTicks reaches -1
              takeWhile(v => this.timeRemaining !== 0)
            );
          
          countdown(0, 1000, this.timeRemaining)
            .subscribe(() => { 
              this.counterService.timeRemaining.next(this.timeRemaining - 1);
              this.counterService.counterChanged.next(true);
            });
        }
      })
  }

  public incrementCounter(value: number): void {
    switch(value) {
      case CounterSteps.One: {
        this.counterService.timeRemaining.next(this.timeRemaining + CounterSteps.One);
        this.counterService.isOneStepEnabled.next(false);
        this.runButtonTimeout(CounterSteps.One);
        break;
      }
      case CounterSteps.Two: {
        this.counterService.timeRemaining.next(this.timeRemaining + CounterSteps.Two);
        this.counterService.isTwoStepEnabled.next(false);
        this.runButtonTimeout(CounterSteps.Two);
        break;
      }
      case CounterSteps.Three: {
        this.counterService.timeRemaining.next(this.timeRemaining + CounterSteps.Three);
        this.counterService.isThreeStepEnabled.next(false);
        this.runButtonTimeout(CounterSteps.Three);
        break;
      }
    }

    this.counterTimeout = null;
    this.timerTrigger.next();
    this.timerTrigger.complete();

    this.counterService.counterChanged.next(true);
  }

  private runButtonTimeout(btnStep: number): void {
    const timeout = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    of(btnStep).subscribe(async (val) => {
      await timeout(val * 1000);

      switch(btnStep) {
        case CounterSteps.One: {
          this.counterService.isOneStepEnabled.next(true);
          break;
        }
        case CounterSteps.Two: {
          this.counterService.isTwoStepEnabled.next(true);
          break;
        }
        case CounterSteps.Three: {
          this.counterService.isThreeStepEnabled.next(true);
          break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyTrigger.next();
    this.destroyTrigger.complete();
  }
}
