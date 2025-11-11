import { Injectable } from '@angular/core';
import { getStorage, ref, getDownloadURL } from '@angular/fire/storage';
import { getApps, initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class StorageService {
   constructor() {
    if (!getApps().length) {
      initializeApp(environment.firebase);
      console.log('Firebase inicializado manualmente en StorageService');
    }
  }

  async getImage(imagePath: string): Promise<string> {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);
    return url;
  }
}


