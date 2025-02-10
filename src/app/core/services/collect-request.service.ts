import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class CollectRequestService {
  constructor(private indexedDbService: IndexedDbService) {}

  async addCollectRequest(request: any) {
    const db = await this.indexedDbService.getDB();
    const tx = db.transaction('collectRequests', 'readwrite');
    const store = tx.objectStore('collectRequests');
    await store.add({ ...request, actualWeight: request.actualWeight || null });
    await tx.done;
  }

  async getCollectRequestsByCity(city: string) {
    const db = await this.indexedDbService.getDB();
    const allRequests = await db.getAll('collectRequests');

    console.log('Toutes les demandes :', allRequests);

    for (const request of allRequests) {
      if (!request.wasteTypes || !Array.isArray(request.wasteTypes)) {
        request.wasteTypes = [request.wasteTypes];
        await db.put('collectRequests', request);
      }
    }

    return allRequests.filter((req) => req.city === city);
  }



  async getCollectRequests() {
    const db = await this.indexedDbService.getDB();
    return db.getAll('collectRequests');
  }

  async getPendingRequests(userId: string) {
    const db = await this.indexedDbService.getDB();
    const allRequests = await db.getAll('collectRequests');
    return allRequests.filter((req) => req.userId === userId && req.status === 'En attente');
  }

  async updateCollectRequest(id: number, data: any) {
    const db = await this.indexedDbService.getDB();
    const existingRequest = await db.get('collectRequests', id);
    if (!existingRequest) {
      console.error(`Impossible de mettre à jour : la requête avec l'ID ${id} n'existe pas.`);
      return;
    }
    const updatedRequest = { ...existingRequest, ...data };
    await db.put('collectRequests', updatedRequest);
  }

  async getUserRequests(userId: string) {
    const db = await this.indexedDbService.getDB();
    const allRequests = await db.getAll('collectRequests');
    return allRequests.filter((req) => req.userId === userId);
  }

  async deleteCollectRequest(id: number) {
    const db = await this.indexedDbService.getDB();
    return db.delete('collectRequests', id);
  }

  async getCollectRequest(id: number) {
    const db = await this.indexedDbService.getDB();
    return db.get('collectRequests', id);
  }

  async updateExistingRequests() {
    const db = await this.indexedDbService.getDB();
    const allRequests = await db.getAll('collectRequests');

    for (const request of allRequests) {
      if (!request.wasteTypes || !Array.isArray(request.wasteTypes)) {
        request.wasteTypes = [request.wasteTypes];
      }
      request.wasteTypes = request.wasteTypes.map(type => type.toLowerCase());
      await db.put('collectRequests', request);
    }
  }


  async updateCollectRequestStatus(id: number, status: 'Occupée' | 'En cours' | 'Validée' | 'Rejetée') {
    const db = await this.indexedDbService.getDB();
    const request = await db.get('collectRequests', id);
    if (request) {
      request.status = status;
      await db.put('collectRequests', request);
      return true;
    }
    console.error('La demande de collecte n\'a pas été trouvée');
    return false;
  }
}
