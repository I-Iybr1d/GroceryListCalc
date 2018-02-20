import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { GroceryListComponent } from './grocery-list/grocery-list.component';
import { ListPickModal } from './list-picker/list-picker-modal';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LanguageController } from './language/language-controller';
import { File } from '@ionic-native/file';


@NgModule({
  declarations: [
    MyApp,
    GroceryListComponent,
    ListPickModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GroceryListComponent,
    ListPickModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LanguageController,
    File
  ]
})
export class AppModule {}
