export interface Jornada {
  id: number;
  nameLocation: string;
  startingDate: string;       
  finishingDate: string;    
  dateStarted: string | null; 
  dateFinished: string | null; 
  state: string;
  firstImgURL: string | null; 
  lastImgURL: string | null;  
  lat: number;
  long: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
