import type { Product } from '@core/model/product';

export type ProductResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
};

export type TokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
  refresh_token: string;
};

export type CustomersResponse = {
  customer: Customer;
};

export type Customer = {
  addresses: [];
  email: string;
  firstName: string;
  id: string;
  isEmailVerified: boolean;
  lastName: string;
  password: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  authenticationMode: string;
  stores: [];
};
