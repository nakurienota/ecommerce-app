import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { Cart, LineItem } from '@core/model/cart';
import type { Product, ProductData } from '@core/model/product';
import { Resthandler } from '@service/rest/resthandler';
import { formatCentAmountLineItem, formatCartDiscount } from '@utils/formatters';
import HtmlCreator, { showNotification } from '@utils/html';
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

    const basketTitle: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__title');
    basketTitle.textContent = 'Корзина';
    basketWrapper.append(basketTitle);

    let currentCartId: string | null = localStorage.getItem(LocalStorageKeys.USER_CART_ID);

    if (!currentCartId) {
      currentCartId = await this.restHandler.createCart();
      localStorage.setItem(LocalStorageKeys.USER_CART_ID, currentCartId);
    }

    const currentCart: Cart = await this.restHandler.getCartByCartId(currentCartId);

    const totalCost: LineItem[] = [];
    for (const item of currentCart.lineItems) {
      const response: Product = await this.restHandler.getProductById(item.productId);
      const currentData: ProductData = response.masterData.current;
      const basketLine: HTMLDivElement = HtmlCreator.create('div', item.productId, 'basket__line');
      const basketImageWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line-image-wrapper');
      const basketLineImage: HTMLImageElement = HtmlCreator.create('img', undefined, 'basket__line-image');
      basketLineImage.src = currentData.masterVariant.images[0].url;
      basketLineImage.alt = currentData.name[lang];
      basketImageWrapper.append(basketLineImage);
      const basketLineName: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line-name');
      basketLineName.textContent = currentData.name[lang];
      const basketLinePrice: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line-price');
      basketLinePrice.textContent = formatCentAmountLineItem(item);
      totalCost.push(item);

      const basketLineQuantity: HTMLInputElement = HtmlCreator.create('input', undefined, 'basket__line-quantity');
      basketLineQuantity.type = 'number';
      basketLineQuantity.value = String(item.quantity);
      let previousValue: number = item.quantity;
      basketLineQuantity.addEventListener('input', async (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
          const currentValue: number = Number(event.target.value);
          if (currentValue !== previousValue) {
            previousValue = currentValue;
            await this.restHandler.changeLineItemQuantity(item.productId, currentValue);
            await router.navigate(AppRoutes.BASKET);
          }
        }
      });

      const basketRemoveButton: HTMLButtonElement = HtmlCreator.create(
        'button',
        undefined,
        'basket__line-remove-button',
        'default-submit-button'
      );
      basketRemoveButton.textContent = 'x';

      basketRemoveButton.addEventListener('click', async () => {
        await this.restHandler.removeProductFromCart(item.productId);
        await router.navigate(AppRoutes.BASKET);
        basketLine.remove();
      });

      basketLine.append(basketImageWrapper, basketLineName, basketLinePrice, basketLineQuantity, basketRemoveButton);
      basketWrapper.append(basketLine);
    }

    if (currentCart.lineItems.length === 0) {
      const basketLine: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__line');
      basketLine.textContent = 'Корзина пуста';
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
    const cartId: string | null = localStorage.getItem(LocalStorageKeys.USER_CART_ID);
    basketClearAllButton.addEventListener('click', async () => {
      if (cartId) {
        await this.restHandler.clearCart(cartId);
        await router.navigate(AppRoutes.BASKET);
        showNotification('Корзина очищена');
      }
    });

    const basketContinueShoppingButton: HTMLButtonElement = HtmlCreator.create(
      'button',
      undefined,
      'default-submit-button'
    );
    basketContinueShoppingButton.textContent = 'Продолжить покупки';
    basketContinueShoppingButton.addEventListener('click', () => {
      router.navigate(AppRoutes.CATALOG);
    });

    const basketPromoWrap: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__promo');
    const basketPromoContent: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__promo-content');
    const basketPromoInput: HTMLInputElement = HtmlCreator.create('input', undefined, 'basket__promo-input');
    basketPromoInput.type = 'text';
    const basketPromoButton: HTMLButtonElement = HtmlCreator.create('button', undefined, 'basket__promo-button');
    basketPromoButton.textContent = 'Применить промокод';
    const basketPromoPrice: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__promo-price');
    const basketPromoNewPrice: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__promo-new-price');
    const basketPromoDiscount: HTMLDivElement = HtmlCreator.create('div', undefined, 'basket__promo-discount');

    basketPromoButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const promoCode = basketPromoInput.value.trim();
      if (promoCode.toLocaleLowerCase() === 'rsschool') {
        const discountedCart = await this.restHandler.addPromoCodeToCart(currentCart.id);
        basketTotalCost.classList.add('discounted');
        basketPromoNewPrice.textContent = `${formatCartDiscount(discountedCart.totalPrice)} ${discountedCart.totalPrice.currencyCode}`;
        basketPromoDiscount.textContent = ` Скидка: ${formatCartDiscount(discountedCart.discountOnTotalPrice.discountedAmount)} ${discountedCart.discountOnTotalPrice.discountedAmount.currencyCode}`;
      }
    });
    basketPromoContent.append(basketPromoInput, basketPromoButton);
    basketPromoPrice.append(basketPromoNewPrice, basketPromoDiscount);
    basketPromoWrap.append(basketPromoContent, basketPromoPrice);

    if (currentCart.lineItems.length === 0) {
      basketWrapper.append(basketContinueShoppingButton);
    } else {
      basketWrapper.append(basketClearAllButton, basketPromoWrap);
    }

    this.container.append(basketWrapper);
    return this.container;
  }
}
