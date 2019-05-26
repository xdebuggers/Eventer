import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _userIsLogedIn = true;
  private _userId = 'abc';

  get userIsLogedIn() {
    return this._userIsLogedIn;
  }
  get userId() {
    return this._userId;
  }

  constructor() { }

  login() {
    this._userIsLogedIn = true;
  }
  logout() {
    this._userIsLogedIn = false;
  }
}
