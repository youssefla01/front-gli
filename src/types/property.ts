export interface Property {
  id: string;
  type: 'apartment' | 'house' | 'commercial' | 'land';
  address: string;
  description: string;
  surface: number;
  rooms: number;
  condition: 'new' | 'good' | 'renovate' | 'poor';
  estimatedPrice: number;
  ownerId: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData extends Omit<Property, 'id' | 'createdAt' | 'updatedAt'> {}