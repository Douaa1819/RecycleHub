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
      wasteType: string[];
      photos?: string[];
      estimatedWeight: number;
      address: string;
      city: string;
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

  async addUser(user: any) {
    const db = await this.getDB();
    user.role = user.role || 'particulier';
    return db.add('users', user);
  }

  async getUser(email: string) {
    const db = await this.getDB();
    return db.get('users', email);
  }

  async addCollectRequest(request: any) {
    const db = await this.getDB();
    return db.add('collectRequests', request);
  }

  async getCollectRequests() {
    const db = await this.getDB();
    return db.getAll('collectRequests');
  }

  async updateUser(user: any) {
    const db = await this.getDB();
    return db.put('users', user);
  }

  async deleteUser(email: string) {
    const db = await this.getDB();
    return db.delete('users', email);
  }

  async getPendingRequests(userId: string) {
    const db = await this.getDB();
    const allRequests = await db.getAll('collectRequests');
    return allRequests.filter((req) => req.userId === userId && req.status === 'En attente');
  }

  async updateCollectRequest(id: number, data: Partial<MyDB['collectRequests']['value']>) {
    const db = await this.getDB();
    const existingRequest = await db.get('collectRequests', id);
    if (!existingRequest) {
      console.error(`Impossible de mettre à jour : la requête avec l'ID ${id} n'existe pas.`);
      return;
    }

    const updatedRequest = { ...existingRequest, ...data };
    return db.put('collectRequests', updatedRequest);
  }

  async deleteCollectRequest(id: number) {
    const db = await this.getDB();
    return db.delete('collectRequests', id);
  }

  async getCollectRequest(id: number) {
    const db = await this.getDB();
    return db.get('collectRequests', id);
  }

  async getUserRequests(userId: string) {
    const db = await this.getDB();
    const allRequests = await db.getAll('collectRequests');
    return allRequests.filter((req) => req.userId === userId);
  }


  async getCollectRequestsByCity(city: string) {
    const db = await this.getDB();
    const allRequests = await db.getAll('collectRequests');
    console.log('Toutes les demandes :', allRequests);

    for (const request of allRequests) {
      if (!request.wasteType || !Array.isArray(request.wasteType)) {
        request.wasteType = [];
        await db.put('collectRequests', request);
      }
    }

    const filteredRequests = allRequests.filter((req) => {
      console.log('City:', city, 'Request City:', req.city);
      return req.city === city && req.status === 'En attente';
    });

    console.log('Demandes filtrées:', filteredRequests);
    return filteredRequests;
  }

  async updateCollectRequestStatus(id: number, status: 'Occupée' | 'En cours' | 'Validée' | 'Rejetée') {
    const db = await this.getDB();
    const request = await db.get('collectRequests', id);
    if (request) {
      request.status = status;
      await db.put('collectRequests', request);
      return true;
    }
    console.error('La demande de collecte n\'a pas été trouvée');
    return false;
  }


  async updateExistingRequests() {
    const db = await this.getDB();
    const allRequests = await db.getAll('collectRequests');

    for (const request of allRequests) {
      if (!request.wasteType || !Array.isArray(request.wasteType)) {
        request.wasteType = [];
        await db.put('collectRequests', request);
      }
    }
  }
}
