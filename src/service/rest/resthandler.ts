import type { TokenResponse } from '@core/model/dto';

export class Resthandler {
  private static instance: Resthandler;

  constructor(
    private readonly authUrl: string | undefined = process.env.ECOMMERCE_AUTH_URL,
    private readonly projectKey: string | undefined = process.env.PROJECT_KEY,
    private readonly apiUrl: string | undefined = process.env.ECOMMERCE_API_URL
  ) {}

  public static getInstance(): Resthandler {
    if (!Resthandler.instance) Resthandler.instance = new Resthandler();
    return Resthandler.instance;
  }

  public async getToken(clientId: string, clientSecret: string): Promise<string> {
    const credentials: string = btoa(`${clientId}:${clientSecret}`);
    if (!this.authUrl) throw new Error('Failed to get token, check credentials.');

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

    return data.access_token;
  }
}
