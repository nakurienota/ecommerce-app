import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { CustomersResponse, ProductResponse, TokenResponse } from '@core/model/dto';
import type { Product } from '@core/model/product';
import { userLoggedIn } from '@utils/security';

import { showSuccessPopup } from '../../pages/popup/popup';

export class Resthandler {
  private static instance: Resthandler;

  constructor(
    private readonly authUrl: string | undefined = process.env.ECOMMERCE_AUTH_URL,
    private readonly projectKey: string | undefined = process.env.PROJECT_KEY,
    private readonly apiUrl: string | undefined = process.env.ECOMMERCE_API_URL,
    private readonly clientId: string | undefined = process.env.ECOMMERCE_ID,
    private readonly clientSecret: string | undefined = process.env.ECOMMERCE_SECRET
  ) {}

  public static getInstance(): Resthandler {
    if (!Resthandler.instance) Resthandler.instance = new Resthandler();
    return Resthandler.instance;
  }

  public async getToken(): Promise<string> {
    const token: string | null = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
    const expiresAtString: string | null = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN_EXPIRES);

    if (token && expiresAtString) {
      const expiresAt = Number.parseInt(expiresAtString, 10);
      if (!Number.isNaN(expiresAt) && Date.now() < expiresAt) {
        return token;
      } else {
        localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN);
        localStorage.removeItem(LocalStorageKeys.ACCESS_TOKEN_EXPIRES);
      }
    }

    const parameters = new URLSearchParams();
    parameters.append('grant_type', 'client_credentials');

    const response: Response = await fetch(`${this.authUrl}/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(this.clientId + ':' + this.clientSecret)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: parameters.toString(),
    });
    if (!response.ok) throw new Error(`Token access failed: ${response.statusText}`);

    const result: TokenResponse = await response.json();
    localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, result.access_token);
    const expiresAt: number = Date.now() + result.expires_in * 1000;
    localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN_EXPIRES, expiresAt.toString());

    return result.access_token;
  }

  public async login(email: string, password: string): Promise<boolean> {
    if (userLoggedIn()) return true;

    const dataCustomer = {
      email: email,
      password: password,
    };
    const tokenBearer = await this.getToken();

    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/login`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataCustomer),
    });

    if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);

    const result: CustomersResponse = await response.json();
    if (result.customer?.id) localStorage.setItem(LocalStorageKeys.USER_ID_LOGGED_IN, result.customer.id);

    return !!result;
  }

  public async registration(email: string, password: string, firstName: string, lastname: string): Promise<boolean> {
    const dataCustomer = {
      email: email,
      firstName: firstName,
      lastName: lastname,
      password: password,
    };
    const tokenBearer = await this.getToken();

    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/customers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataCustomer),
    });

    if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);

    const result: CustomersResponse = await response.json();
    showSuccessPopup();

    return !!result;
  }

  public async getProductById(id: string): Promise<Product> {
    const tokenBearer: string = await this.getToken();

    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/products/` + id, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Something goes wrong: ${response.statusText}`);
    const result: Product = await response.json();
    return result;
  }

  public async getProductsAll(): Promise<Product[]> {
    const tokenBearer: string = await this.getToken();
    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/products`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Something goes wrong: ${response.statusText}`);
    }

    const data: ProductResponse = await response.json();
    const result: Product[] = data.results;

    return result;
  }
}
