export interface Owner {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    numero_urgence?: string;
    adresse: string;
    identifiant_fiscal: string;
    rib: string;
    piece_jointe?: string;
    date_creation: string;
    date_mise_a_jour: string;
  }
  
  export interface OwnerFormData extends Omit<Owner, 'id' | 'date_creation' | 'date_mise_a_jour'> {}
  