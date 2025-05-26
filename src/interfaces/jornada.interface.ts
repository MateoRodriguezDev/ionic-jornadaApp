export interface Jornada {
  id: number;
  nameLocation: string;
  date: string;       // ISO date string
  state: string;
  imgURL: string | null;
  lat: number;
  long: number;
  userId: number;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  deletedAt: string | null;
}
