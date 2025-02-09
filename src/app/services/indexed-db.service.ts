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
    const tx = db.transaction('collectRequests', 'readwrite');
    const store = tx.objectStore('collectRequests');
    await store.add({ ...request, actualWeight: request.actualWeight || null });
    await tx.done;
  }

  async getCollectRequests() {
    const db = await this.getDB();
    return db.getAll('collectRequests');
  }


  calculatePoints(wasteTypes: string[], estimatedWeight: number, actualWeight: number): number {
    const wastePoints: { [key: string]: number } = {
      'plastique': 2,
      'verre': 1,
      'papier': 1,
      'métal': 5
    };

    let totalPoints = 0;
    wasteTypes.forEach(type => {
      if (wastePoints[type]) {
        totalPoints += wastePoints[type] * (actualWeight / 1000);  // Conversion des grammes en kilogrammes
      }
    });

    if (wasteTypes.length > 1) {
      totalPoints /= wasteTypes.length;
    }

    const weightDifference = Math.abs(estimatedWeight - actualWeight);
    totalPoints -= weightDifference / 10;

    if (totalPoints < 0) {
      totalPoints = 0;
    }

    return totalPoints;
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

  async updateCollectorPoints(collectorId: string, points: number) {
    const db = await this.getDB();
    const collector = await db.get('users', collectorId);

    if (!collector || collector.role !== 'collector') {
      console.error('Collecteur non trouvé ou rôle incorrect');
      return;
    }

    collector.convertiblePoints = collector.convertiblePoints || 0;
    collector.convertiblePoints += points;

    let voucher = '';
    if (collector.convertiblePoints >= 500) {
      voucher = '350 Dh';
      collector.convertiblePoints -= 500;  
    } else if (collector.convertiblePoints >= 200) {
      voucher = '120 Dh';
      collector.convertiblePoints -= 200;
    } else if (collector.convertiblePoints >= 100) {
      voucher = '50 Dh';
      collector.convertiblePoints -= 100;
    }

    await db.put('users', collector);

    if (voucher) {
      console.log(`Bon d'achat attribué : ${voucher}`);
    }
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
      if (!request.wasteTypes || !Array.isArray(request.wasteTypes)) {
        request.wasteTypes = [];
        await db.put('collectRequests', request);
      }
    }

    const filteredRequests = allRequests.filter((req) => {
      console.log('City:', city, 'Request City:', req.city);
      return req.city === city;
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
      if (!request.wasteTypes || !Array.isArray(request.wasteTypes)) {
        request.wasteTypes = [];
        await db.put('collectRequests', request);
      }
    }
  }
}
