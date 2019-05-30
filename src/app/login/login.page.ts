import { Component, OnInit } from '@angular/core';
import { LoginService, AuthResponseData } from './login.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(
    private loginServise: LoginService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in..' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.loginServise.login(email, password);
        } else {
          authObs = this.loginServise.signup(email, password);
        }
        authObs.subscribe(
          resData => {
            // console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            if (resData.localId === '0WPo8AytyqcfUkZq5jgYMXjTD4o1') {
              this.router.navigateByUrl('/admin/tabs/user-events');
            } else {
              this.router.navigateByUrl('/events/tabs/discover');
            }
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = errRes.error.error.message;
            if (code === 'EMAIL_EXISTS') {
              message = 'This email already exists!';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'This email dose not existed! Singup Now';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct';
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
    form.reset();
  }
  onSwitchLoginMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['OK']
      })
      .then(alertEl => {
        alertEl.present();
      });
  }
}
