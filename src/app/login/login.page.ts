import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isLoading = false;
  isLogin = true;
  constructor(
    private loginServise: LoginService,
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
  }

  onLogin() {
    this.isLoading = true;
    this.loginServise.login();

    this.loadingCtrl.create({keyboardClose: true, message: 'Logging in..'})
    .then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/eventss');
      }, 1500);
    });
  }
  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    if(this.isLogin) {
      // Send a request to login servers
    } else {
      //Send a request to Signup servers
    }
  }
  onSwitchLoginMode() {
    this.isLogin = !this.isLogin;
  }


}
