import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { Cart } from '@core/model/cart';
import type {
  CartResponse,
  CustomersResponse,
  ProductResponse,
  ResponseCustomerById,
  TokenResponse,
} from '@core/model/dto';
import type { Product } from '@core/model/product';
import { userLoggedIn } from '@utils/security';

import { showSuccessPopup } from '../../pages/popup/popup';

export class Resthandler {
  private static instance: Resthandler;
  private currentVersion: number | undefined = Number.parseInt(
    localStorage.getItem(LocalStorageKeys.USER_VERSION)!,
    10
  );

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
    if (result.customer.version) localStorage.setItem(LocalStorageKeys.USER_VERSION, `${result.customer.version}`);
    if (result.customer.version) this.currentVersion = result.customer.version;

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

  public async getCustomer(id: string): Promise<ResponseCustomerById> {
    const tokenBearer = await this.getToken();
    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/customers/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
      },
    });

    if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);

    const result = await response.json();

    return result;
  }

  public async updateCustomer(
    email: string,
    firstname: string,
    lastname: string,
    date: string,
    id: string
  ): Promise<boolean> {
    const version =
      this.getCurrentVersion() ?? Number.parseInt(localStorage.getItem(LocalStorageKeys.USER_VERSION)!, 10);

    const dataCustomer: DataCostumer = {
      version: version,
      actions: [
        { action: 'changeEmail', email: email },
        { action: 'setFirstName', firstName: firstname },
        { action: 'setLastName', lastName: lastname },
        { action: 'setDateOfBirth', dateOfBirth: date },
      ],
    };

    const tokenBearer = await this.getToken();

    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/customers/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataCustomer),
    });

    if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);

    const result: ResponseCustomerById = await response.json();
    this.currentVersion = result.version;
    localStorage.setItem(LocalStorageKeys.USER_VERSION, `${result.version}`);

    return !!result;
  }

  public getCurrentVersion(): number {
    return this.currentVersion!;
  }

  public async createCart(): Promise<string> {
    try {
      const tokenBearer: string = await this.getToken();

      const response = await fetch(`${this.apiUrl}/${this.projectKey}/carts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenBearer}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: 'RUB',
        }),
      });

      if (!response.ok) {
        throw new Error(`Не удалось создать корзину: ${response.status} ${response.statusText}`);
      }

      const data: Cart = await response.json();
      console.log('Создана корзина для пользователя:', data);
      console.log(data.id);
      return data.id;
    } catch (error) {
      console.error('Ошибка при создании корзины:', error);
      return '';
    }
  }

  public async getCartByCustomerId(customerId: string): Promise<CartResponse> {
    const tokenBearer: string = await this.getToken();
    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/carts?where=customerId="${customerId}"`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Something goes wrong: ${response.statusText}`);
    return await response.json();
  }

  public async setCustomerIdForCart(cartId: string, customerId: string): Promise<number> {
    try {
      const tokenBearer: string = await this.getToken();

      const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/carts/${cartId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenBearer}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 1,
          actions: [
            {
              action: 'setCustomerId',
              customerId: customerId,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Something goes wrong: ${response.status} ${response.statusText}`);
      }

      const data: Cart = await response.json();
      console.log(data);

      return data.version;
    } catch (error) {
      console.error('Ошибка при получении корзины:', error);
      return 0;
    }
  }

  public async addProductToCart(cartId: string, productId: string): Promise<boolean> {
    try {
      const tokenBearer: string = await this.getToken();

      const currentVersion = await this.getCartVersion(cartId);
      console.log(currentVersion);

      const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/carts/${cartId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenBearer}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: currentVersion,
          actions: [
            {
              action: 'addLineItem',
              productId: `${productId}`,
              variantId: 1,
              quantity: 1,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Something goes wrong: ${response.statusText}`);
      }

      const data: Cart = await response.json();
      console.log(data);

      return !!data;
    } catch {
      return false;
    }
  }

  public async removeProductFromCart(cartId: string, productId: string): Promise<boolean> {
    const tokenBearer: string = await this.getToken();
    console.log('removing id ' + productId);

    const currentVersion = await this.getCartVersion(cartId);
    console.log(currentVersion);

    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/carts/{$cartId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: currentVersion,
        action: [
          {
            action: 'removeLineItem',
            lineItemId: productId,
            quantity: 1,
          },
        ],
      }),
    });
    return response.ok;
  }

  public async getCartVersion(cartId: string): Promise<number> {
    try {
      const tokenBearer: string = await this.getToken();

      const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/carts/${cartId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenBearer}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Ошибка при определении версии: ${response.statusText}`);
      }

      const cartData: Cart = await response.json();
      const currentVersion = cartData.version;
      return currentVersion;
    } catch {
      return 0;
    }
  }
}

export type UpdateCustomerAccount = {
  date: string;
  firstname: string;
  lastname: string;
};

export type DataCostumer = {
  version: number;
  actions: Actions[];
};

export type Actions = {
  [key: string]: string;
};
