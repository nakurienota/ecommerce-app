import type { TokenResponse } from '@core/model/dto';

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
    if (this.isTokenValid()) return true;
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
      this.accessToken = result;
      return true;
    }
    return false;
  }

  public isTokenValid(): boolean {
    return (
      !!this.accessToken?.access_token &&
      !!this.accessToken.expires_in &&
      Date.now() < Date.now() + this.accessToken.expires_in * 1000
    );
  }
}
