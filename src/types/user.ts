export interface User {
  id: string;
  prenom: string; 
  nom: string; 
  email: string;
  role: 'admin' | 'gestionnaire' | 'comptable' | 'agent';
  permissions: string[];
  status: 'actif' | 'inactif'; 
  dateCreation: string; 
  dateModification: string; 
}

export interface ProfileUpdateData {
  prenom: string;
  nom: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UserFormData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {}