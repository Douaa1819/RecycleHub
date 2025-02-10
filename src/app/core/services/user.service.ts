import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private indexedDbService: IndexedDbService) {}

  async addUser(user: any) {
    const db = await this.indexedDbService.getDB();
    user.role = user.role || 'particulier';
    return db.add('users', user);
  }

  async getUser(email: string) {
    const db = await this.indexedDbService.getDB();
    return db.get('users', email);
  }

  async updateUser(user: any) {
    const db = await this.indexedDbService.getDB();
    return db.put('users', user);
  }

  async deleteUser(email: string) {
    const db = await this.indexedDbService.getDB();
    return db.delete('users', email);
  }


  


}
