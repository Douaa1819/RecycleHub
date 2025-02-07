import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';

interface MyDB extends DBSchema {
  users: {
    key: string;
    value: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      address: string;
      phone: string;
      birthDate: string;
      profilePhoto?: string;
      role: 'particulier' | 'collector';
    };
  };
  collectRequests: {
    key: number;
    value: {
      id: number;
      userId: string;
      wasteType: string[];
      photos?: string[];
      estimatedWeight: number;
      address: string;
      date: string;
      timeSlot: string;
      notes?: string;
      status: 'En attente' | 'Occupée' | 'En cours' | 'Validée' | 'Rejetée';
   };
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db!: IDBPDatabase<MyDB>;

  constructor() {
    this.initDB();
  }

  async initDB() {
    this.db = await openDB<MyDB>('RecycleHubDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'email' });
        }
        if (!db.objectStoreNames.contains('collectRequests')) {
          db.createObjectStore('collectRequests', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }

  async addUser(user: any) {
    user.role = user.role || 'user';
    return this.db.add('users', user);
  }
  async getUser(email: string) {
    return this.db.get('users', email);
  }


  async addCollectRequest(request: any) {
    return this.db.add('collectRequests', request);
  }

  async getCollectRequests() {
    return this.db.getAll('collectRequests');
  }

  async updateUser(user: any) {
    return this.db.put('users', user);
  }

  async deleteUser(email: string) {
    return this.db.delete('users', email);
  }

  async getPendingRequests(userId: string) {
    const allRequests = await this.db.getAll('collectRequests');
    return allRequests.filter((req) => req.userId === userId && req.status === 'En attente');
  }

  async updateCollectRequest(id: number, data: Partial<MyDB['collectRequests']['value']>) {
    console.log(`Mise à jour de la demande ID: ${id}`, data);
    if (!this.db) {
      await this.initDB();
    }
    const existingRequest = await this.db.get('collectRequests', id);
    if (!existingRequest) {
      console.error(`Impossible de mettre à jour : la requête avec l'ID ${id} n'existe pas.`);
      return;
    }

    // Fusionner les anciennes données avec les nouvelles
    const updatedRequest = { ...existingRequest, ...data };

    return this.db.put('collectRequests', updatedRequest);
  }



  async deleteCollectRequest(id: number) {
    return this.db.delete('collectRequests', id);
  }
  async getCollectRequest(id: number) {
    return this.db.get('collectRequests', id);
  }

  async getUserRequests(userId: string) {
    console.log('IndexedDB Instance:', this.db);
    if (!this.db) {
      console.error('IndexedDB n\'est pas initialisé !');
      await this.initDB();
      // return [];
    }

    const allRequests = await this.db.getAll('collectRequests');
    console.log('Toutes les requêtes:', allRequests);
    return allRequests.filter((req) => req.userId === userId);
  }


}
