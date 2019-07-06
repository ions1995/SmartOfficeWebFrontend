import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticateService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Userdetails',
      url: '/userdetails',
      icon: 'person'
    },
    {
      title: 'Raumübersicht',
      url: '/home',
      icon: 'grid'
    },
    /*{
      title: 'Belegungsplan',
      url: '/list',
      icon: 'list'
    },*/
    {
      title: 'Meetings erstellen',
      url: '/create-meeting',
      icon: 'add'
    },
    /*{
      title: 'Details zu Meetings',
      url: '/meeting-details',
      icon: 'information-circle'
    }*/
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticateService,
    private navCtrl: NavController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /**
   * Firebase-Methode: loggt den User aus
   */
  logout() {
    this.authService.logoutUser()
    .then(res => {
      console.log(res);
      this.navCtrl.navigateBack('/login');
    })
    .catch(error => {
      console.log(error);
    });
  }
}
