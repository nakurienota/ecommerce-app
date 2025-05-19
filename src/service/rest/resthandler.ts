import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { TokenResponse } from '@core/model/dto';
import { validTokeExists } from '@utils/security';

export class Resthandler {
  private static instance: Resthandler;
  private accessToken: TokenResponse | undefined;

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

  public async login(username: string, password: string): Promise<boolean> {
    if (validTokeExists()) return true;
    const parameters = new URLSearchParams();
    parameters.append('grant_type', 'password');
    parameters.append('username', username);
    parameters.append('password', password);

    const response: Response = await fetch(`${this.authUrl}/${this.projectKey}/customers/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(this.clientId + ':' + this.clientSecret)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: parameters.toString(),
    });

    if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);

    const result: TokenResponse = await response.json();
    if (result) {
      localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN, result.access_token);
      const expiresAt: number = Date.now() + result.expires_in * 1000;
      localStorage.setItem(LocalStorageKeys.ACCESS_TOKEN_EXPIRES, expiresAt.toString());
      return true;
    }
    return false;
  }
}
