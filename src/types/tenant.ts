export interface Tenant {
  id: string;
  prenom: string;
  nom: string;
  date_naissance: string;
  lieu_naissance: string;
  genre: string;
  situation_familiale: string;
  nombre_enfants: number;
  nationalite: string;
  telephone: string;
  email: string;
  adresse: string;
  profession :String;
  contact_urgence: string;
  cin: string;
  piece_identite: string;
  piece_jointe: string;
  commentaire: string;
  statut: string;
  date_creation: Date;
  date_mise_a_jour: Date;
}

export interface TenantFormData extends Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'> {}