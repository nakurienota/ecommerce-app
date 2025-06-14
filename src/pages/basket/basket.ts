import HtmlCreator from '@utils/html';

import { Resthandler } from '@service/rest/resthandler';
import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import { Cart, LineItem } from '@core/model/cart';
import { CartResponse } from '@core/model/dto';
import { Price, Product, type ProductData } from '@core/model/product';
import { formatCentAmount } from '@utils/formatters';

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
    const totalCost: Price[] = [];
    for (const item of currentCart.lineItems) {
      const response: Product = await this.restHandler.getProductById(item.productId);
      const currentData: ProductData = response.masterData.current;
      console.log(currentData);
      const basketLine: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line');
      const basketImageWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line-image-wrapper');
      const basketLineImage: HTMLImageElement = HtmlCreator.create('img', undefined, 'basket__line-image');
      basketLineImage.src = currentData.masterVariant.images[0].url;
      basketImageWrapper.append(basketLineImage);
      const basketLineName: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line-name');
      basketLineName.textContent = currentData.name[lang];
      const basketLinePrice: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line-price');
      basketLinePrice.textContent = formatCentAmount(currentData.masterVariant.prices[0]);
      totalCost.push(currentData.masterVariant.prices[0]);
      basketLine.append(basketImageWrapper, basketLineName, basketLinePrice);
      basketWrapper.append(basketLine);
    }
    const basketTotalCost: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__total-cost');
    basketTotalCost.textContent = `Всего: ` + formatCentAmount(...totalCost);
    basketWrapper.append(basketTotalCost);

    this.container.append(basketWrapper);
    return this.container;
  }
}
