import { Injectable } from '@angular/core';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class FirebaseStorageService {
  constructor(private storage: Storage) {}


  //Me trae la url de la imagen que necesito
  async getDownloadUrl(filePath: string): Promise<string> {
    const fileRef = ref(this.storage, filePath);
    return await getDownloadURL(fileRef);
  }
}
