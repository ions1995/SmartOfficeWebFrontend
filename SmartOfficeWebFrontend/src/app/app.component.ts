import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Raumübersicht',
      url: '/home',
      icon: 'grid'
    },
    {
      title: 'Belegungsplan',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Meetings erstellen',
      url: '/create-meeting',
      icon: 'add'
    },
    {
      title: 'Details zu Meetings',
      url: '/meeting-details',
      icon: 'information-circle'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
