import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class PointsService {
  constructor(private indexedDbService: IndexedDbService) {}

  calculatePoints(wasteTypes: string | string[], estimatedWeight: number, actualWeight?: number): number {
    const wastePoints: { [key: string]: number } = {
      plastique: 2,
      verre: 1,
      papier: 1,
      métal: 5,
    };

    const wasteTypeArray = Array.isArray(wasteTypes) ? wasteTypes : [wasteTypes];
    const weightToUse = actualWeight || estimatedWeight;

    if (!weightToUse || weightToUse <= 0) {
      console.log('Poids invalide:', weightToUse);
      return 0;
    }

    const weightInKg = weightToUse / 1000;
    let totalPoints = 0;

    wasteTypeArray.forEach((type) => {
      const normalizedType = type.toLowerCase();
      if (wastePoints[normalizedType]) {
        totalPoints += wastePoints[normalizedType] * weightInKg;
      } else {
        console.log(`Type de déchet inconnu : ${type}`);
      }
    });

    return Math.max(0, Math.floor(totalPoints));
  }

  async updateCollectorPoints(collectorId: string, points: number) {
    const db = await this.indexedDbService.getDB();
    const collector = await db.get('users', collectorId);

    if (!collector) {
      console.error('Collecteur non trouvé dans la base de données');
      return;
    }

    collector.convertiblePoints = collector.convertiblePoints || 0;
    collector.convertiblePoints += points;

    await db.put('users', collector);
  }
}
