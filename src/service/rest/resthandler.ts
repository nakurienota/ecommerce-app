import type { TokenResponse } from '@core/model/dto';
import type { Product } from '@core/model/product';

export class Resthandler {
  private token: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(
    private readonly clientId: string | undefined = process.env.ECOMMERCE_ID,
    private readonly clientSecret: string | undefined = process.env.ECOMMERCE_SECRET,
    private readonly authUrl: string | undefined = process.env.ECOMMERCE_AUTH_URL,
    private readonly projectKey: string | undefined = process.env.PROJECT_KEY,
    private readonly apiUrl: string | undefined = process.env.ECOMMERCE_API_URL
  ) {}

  public async getToken(): Promise<string> {
    if (this.token && this.tokenExpiresAt > Date.now()) return this.token;
    console.log(this.clientId);
    if (!this.clientId || !this.clientSecret || !this.authUrl)
      throw new Error('Failed to get token, check credentials.');

    const credentials: string = btoa(`${this.clientId}:${this.clientSecret}`);

    const response: Response = await fetch(this.authUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) throw new Error(`Failed to get token: ${response.statusText}`);

    const data: TokenResponse = await response.json();
    this.token = data.access_token;
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
    if (!this.token) throw new Error('Something wrong with token');

    return this.token;
  }

  public async getProducts(): Promise<Product[]> {
    const url = `${this.apiUrl}/${this.projectKey}/products`;
    const response = await this.postWithToken(url);
    if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
    const data = await response.json();
    return data.results;
  }

  public logout(): void {
    this.token = null;
    this.tokenExpiresAt = 0;
  }

  private async postWithToken(url: string, init?: RequestInit): Promise<Response> {
    await this.getToken();
    return fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
