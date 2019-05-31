import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { LoginService } from './login/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private adminSub: Subscription;
  private previousAuthState = false;
  public isAdmin = false;
  constructor(
    private platform: Platform,
    private loginServise: LoginService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authSub = this.loginServise.userIsLogedIn.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/login');
      }
      this.previousAuthState = isAuth;
      this.adminSub = this.loginServise.adminIsLogedIn.subscribe(isAuth => {
        if (isAuth) {
          // console.log('admin');
          this.isAdmin = true;
        }
      });
    });
  }
  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }
  onLogout() {
    this.loginServise.logout();
    this.isAdmin = false;
  }
}
