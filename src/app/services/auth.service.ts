import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {User} from "../models/user";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public isAuthenticated() : Boolean {
    let userData = localStorage.getItem('user') || '{}'

    if (JSON.parse(userData) && userData != '{}') {
      return true;
    }

    return false;
  }

  public setUserInfo(user: User){
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(user: User) {
    return this.http.post<User>(`${environment.apiUrl}/login`, user, {withCredentials: true})
  }

  logout(user: User) {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.http.post<User>(`${environment.apiUrl}/logout`, user, {withCredentials: true})
    // @ts-ignore
    this.currentUserSubject.next(null);
    this.router.navigate(['/'])
  }
}
