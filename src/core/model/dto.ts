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
};
