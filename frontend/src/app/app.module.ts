import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeroComponent } from './components/hero/hero.component';
import { TilesComponent } from './components/tiles/tiles.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HeroComponent,
    TilesComponent,
    HistoryTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
