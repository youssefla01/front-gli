export interface Property {
  id: string;
  type: 'apartment' | 'house' | 'commercial' | 'land';
  addresse: string;
  description: string;
  surface: number;
  nb_pieces: number;
  etat: 'new' | 'good' | 'renovate' | 'poor';
  prix: number;
  proprietaire_id: string;
  photos?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData extends Omit<Property, 'id' | 'createdAt' | 'updatedAt'> {}