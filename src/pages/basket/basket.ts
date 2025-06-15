import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { Cart, LineItem } from '@core/model/cart';
import type { CartResponse } from '@core/model/dto';
import type { Product, ProductData } from '@core/model/product';
import { Resthandler } from '@service/rest/resthandler';
import { formatCentAmountLineItem } from '@utils/formatters';
import HtmlCreator from '@utils/html';
import { AppRoutes, router } from '@utils/router';

export default class BasketPage {
  public container: HTMLElement;
  private readonly restHandler: Resthandler = Resthandler.getInstance();

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public async getHTMLAsync(): Promise<HTMLElement> {
    const basketWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket');
    const locale: string = navigator.language || 'ru';
    const lang: string = locale.split('-')[0];

    const customerID: string | null = localStorage.getItem(LocalStorageKeys.USER_ID_LOGGED_IN);
    if (!customerID) throw new Error('User not logged in');

    const basketTitle: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__title');
    basketTitle.textContent = 'Корзина';
    basketWrapper.append(basketTitle);

    const cart: CartResponse = await this.restHandler.getCartByCustomerId(customerID);
    const currentCart: Cart = cart.results.reduce((latest: Cart, current: Cart): Cart => {
      return new Date(current.lastModifiedAt) > new Date(latest.lastModifiedAt) ? current : latest;
    });
    const totalCost: LineItem[] = [];
    for (const item of currentCart.lineItems) {
      console.log(item);
      const response: Product = await this.restHandler.getProductById(item.productId);
      const currentData: ProductData = response.masterData.current;
      const basketLine: HTMLDivElement = HtmlCreator.create('div', item.productId, 'basket__line');
      const basketImageWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line-image-wrapper');
      const basketLineImage: HTMLImageElement = HtmlCreator.create('img', undefined, 'basket__line-image');
      basketLineImage.src = currentData.masterVariant.images[0].url;
      basketImageWrapper.append(basketLineImage);
      const basketLineName: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line-name');
      basketLineName.textContent = currentData.name[lang];
      const basketLinePrice: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line-price');
      basketLinePrice.textContent = formatCentAmountLineItem(item);
      totalCost.push(item);

      const basketLineQuantity: HTMLInputElement = HtmlCreator.create('input', undefined, 'basket__line-quantity');
      basketLineQuantity.type = 'number';
      basketLineQuantity.value = String(item.quantity);

      basketLine.append(basketImageWrapper, basketLineName, basketLinePrice, basketLineQuantity);
      basketWrapper.append(basketLine);
    }
    const basketTotalCost: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__total-cost');
    basketTotalCost.textContent = 'Всего: ' + totalCost ? formatCentAmountLineItem(...totalCost) : '0.00';
    basketWrapper.append(basketTotalCost);

    const basketClearAllButton: HTMLButtonElement = HtmlCreator.create(
      'button',
      undefined,
      'basket__clear-all-button',
      'default-submit-button'
    );
    basketClearAllButton.textContent = 'Очистить корзину';
    const cartId = localStorage.getItem(LocalStorageKeys.USER_CART_ID);
    basketClearAllButton.addEventListener('click', async () => {
      console.log('cardId ' + cartId);
      if (cartId) {
        console.log('Очищаем корзину...');
        await this.restHandler.clearCart(cartId);
        // const lines: NodeListOf<Element> = document.querySelectorAll('basket__line');
        // const promises = Array.from(lines).map((line) => this.restHandler.removeProductFromCart(cartId, line.id));
        // await Promise.all(promises);
        await router.navigate(AppRoutes.BASKET);
      }
    });
    basketWrapper.append(basketClearAllButton);

    this.container.append(basketWrapper);
    return this.container;
  }
}
