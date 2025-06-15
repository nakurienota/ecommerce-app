import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { Cart } from '@core/model/cart';
import type { CustomersResponse, ProductResponse, ResponseCustomerById, TokenResponse } from '@core/model/dto';
import type { Product } from '@core/model/product';
import { showNotification } from '@utils/html';
import { isNotNullable } from '@utils/not-nullable';
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

  public async addProductToCartButton(productId: string): Promise<boolean> {
    try {
      const customerId = localStorage.getItem(LocalStorageKeys.USER_ID_LOGGED_IN);
      const cartId = localStorage.getItem(LocalStorageKeys.USER_CART_ID);

      if (isNotNullable(customerId)) {
        if (isNotNullable(cartId)) {
          const cart = await this.addProductToCart(cartId, productId);
          console.log(cart);
        } else {
          const cartId = await this.createCart();
          localStorage.setItem(LocalStorageKeys.USER_CART_ID, cartId);
          const cart = await this.setCustomerIdForCart(cartId, customerId);
          console.log(cart);
          const data = await this.addProductToCart(cartId, productId);
          console.log(data);
        }
        showNotification('Товар добавлен в корзину');
        return true;
      } else {
        const anonymousCartId = localStorage.getItem(LocalStorageKeys.USER_CART_ID);
        if (isNotNullable(anonymousCartId)) {
          const data = await this.addProductToCart(anonymousCartId, productId);
          console.log(data);
        } else {
          const anonymousCartId = await this.createCart();
          localStorage.setItem(LocalStorageKeys.USER_CART_ID, anonymousCartId);
          const data = await this.addProductToCart(anonymousCartId, productId);
          console.log(data);
        }
        showNotification('Товар добавлен в корзину');
        return true;
      }
    } catch {
      return false;
    }
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

  public async getCartByCustomerId(customerId: string): Promise<Cart> {
    const tokenBearer: string = await this.getToken();
    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/carts/customer-id=${customerId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Something goes wrong: ${response.statusText}`);
    }

    const data: Cart = await response.json();
    console.log(data);
    return data;
  }

  public async getCartByCartId(cartId: string): Promise<Cart> {
    const tokenBearer: string = await this.getToken();
    const response: Response = await fetch(`${this.apiUrl}/${this.projectKey}/carts/${cartId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenBearer}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Something goes wrong: ${response.statusText}`);
    }

    const data: Cart = await response.json();
    console.log(data);
    return data;
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

  public async removeProductFromCart(productId: string): Promise<boolean> {
    try {
      const tokenBearer: string = await this.getToken();
      const cartId: string | null = localStorage.getItem(LocalStorageKeys.USER_CART_ID);
      if (!cartId) throw new Error('Something goes wrong');
      const currentVersion = await this.getCartVersion(cartId);
      console.log(currentVersion);

      const lineItemPropertys = await this.getCurrentLineItem(cartId, productId);

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
              action: 'removeLineItem',
              lineItemId: `${lineItemPropertys[0]}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Something goes wrong: ${response.statusText}`);
      }

      const data: Cart = await response.json();
      console.log(data);
      showNotification('Товар удален из корзины');
      return !!data;
    } catch {
      return false;
    }
  }

  public async removeProductByLineItem(cartId: string, lineItemId: string): Promise<boolean> {
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
              action: 'removeLineItem',
              lineItemId: lineItemId,
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

  public async changeLineItemQuantity(productId: string, currentQuantity: number): Promise<boolean> {
    try {
      const tokenBearer: string = await this.getToken();

      const cartId: string | null = localStorage.getItem(LocalStorageKeys.USER_CART_ID);
      if (!cartId) throw new Error('Something goes wrong');

      const currentVersion: number = await this.getCartVersion(cartId);
      console.log(currentVersion);

      const lineItemPropertys = await this.getCurrentLineItem(cartId, productId);
      console.log(lineItemPropertys);
      const quantity: number = currentQuantity;

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
              action: 'changeLineItemQuantity',
              lineItemId: `${lineItemPropertys[0]}`,
              quantity: quantity,
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

  public async clearCart(cartId: string): Promise<boolean> {
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
        throw new Error(`Something goes wrong: ${response.statusText}`);
      }

      const cartData: Cart = await response.json();
      const lineItems = cartData.lineItems;
      for (const item of lineItems) {
        try {
          await this.removeProductByLineItem(cartId, item.id);
          console.log(`Товар ${item.productId} удалён`);
        } catch (error) {
          console.error(`Ошибка удаления ${item.id}:`, error);
        }
      }
      return true;
    } catch {
      return false;
    }
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

  public async getCurrentLineItem(cartId: string, productId: string): Promise<(string | number)[]> {
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
        throw new Error(`Ошибка при определении количества: ${response.statusText}`);
      }

      const cartData: Cart = await response.json();
      const selectedItem = cartData.lineItems.find((item) => item.productId === productId);
      const lineItemProperties: (string | number)[] = [];
      if (selectedItem) {
        lineItemProperties.push(selectedItem.id, selectedItem.quantity);
        console.log(lineItemProperties);
      }
      return lineItemProperties;
    } catch {
      return [];
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
