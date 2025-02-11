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
      convertiblePoints?: number;
      address: string;
      phone: string;
      city: string;
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
      wasteTypes: string[];
      photos?: string[];
      actualWeight?: number;
      estimatedWeight: number;
      address: string;
      city: string;
      date: string;
      timeSlot: string;
      points: number;
      notes?: string;
      status: 'En attente' | 'Occupée' | 'En cours' | 'Validée' | 'Rejetée';
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  async initDB(): Promise<IDBPDatabase<MyDB>> {
    return openDB<MyDB>('RecycleHubDB', 1, {
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

  async getDB(): Promise<IDBPDatabase<MyDB>> {
    return this.dbPromise;
  }
}
