// Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Application imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CounterComponent } from './counter/counter.component';
import { CounterService } from './services/counter.service';

// Angular Metarial imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    AppComponent,
    CounterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [
    CounterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
