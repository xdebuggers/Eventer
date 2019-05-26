import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _userIsLogedIn = false;

  get userIsLogedIn() {
    return this._userIsLogedIn;
  }
  constructor() { }

  login() {
    this._userIsLogedIn = true;
  }
  logout() {
    this._userIsLogedIn = false;
  }
}