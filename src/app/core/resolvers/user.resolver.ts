import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<any> {
  constructor(private userService: UserService) {}

  resolve(): any {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return this.userService.getUser(currentUser.email);
  }
}
