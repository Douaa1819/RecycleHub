import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';
import { from, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private indexedDbService: IndexedDbService) {}

  addUser(user: any): Observable<any> {
    return from(this.indexedDbService.getDB().then(db => {
      user.role = user.role || 'particulier';
      return db.add('users', user);
    }));
  }

  async getUser(email: string) {
    const db = await this.indexedDbService.getDB();
    return db.get('users', email);
  }

  async updateUser(user: any) {
    const db = await this.indexedDbService.getDB();
    return db.put('users', user);
  }


  deleteUser(email: string): Observable<any> {
    return from(this.indexedDbService.getDB().then(db => db.delete('users', email)));
  }

}
