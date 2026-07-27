export interface Agency {
  id: string;
  name: string;
  description?: string;
  siret: string;
  phone?: string;
  website?: string;
  address: string;
  city: string;
  postalCode: string;
  logo?: string;

  userId: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateAgencyDto {
  name: string;
  description?: string;
  siret: string;
  phone?: string;
  website?: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface UpdateAgencyDto {
  name?: string;
  description?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  logo?: string;
}
