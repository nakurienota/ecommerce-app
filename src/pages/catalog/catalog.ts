import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { Cart, LineItem } from '@core/model/cart';
import type { Product, ProductData } from '@core/model/product';
import { Resthandler } from '@service/rest/resthandler';
import { formatCentAmount, formatDiscount } from '@utils/formatters';
import HtmlCreator from '@utils/html';
import { isNotNullable } from '@utils/not-nullable';
import { AppRoutes, router } from '@utils/router';

export default class CatalogPage {
  public container: HTMLElement;
  private readonly restHandler: Resthandler = Resthandler.getInstance();
  private readonly catalogWrapper: HTMLElement;
  private readonly filters: HTMLElement;
  private readonly catalog: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
    const catalogWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'catalog-wrapper');
    this.catalogWrapper = catalogWrapper;
    this.filters = HtmlCreator.create('section', undefined, 'section', 'filters');
    this.catalog = HtmlCreator.create('section', undefined, 'section', 'catalog');
    catalogWrapper.append(this.filters, this.catalog);
  }

  public async getHTMLAsync(): Promise<HTMLElement> {
    await this.getCatalog();
    this.getFilters();
    this.container.append(this.catalogWrapper);
    return this.container;
  }

  private getFilters(): void {
    const filters: HTMLElement = HtmlCreator.create('div', undefined, 'filters__wrapper');
    filters.textContent = 'Над фильтрацией идет работа';
    const categoriesFilter: HTMLDivElement = HtmlCreator.create(
      'div',
      undefined,
      'filters__category-filter',
      'filters__option'
    );
    const categoriesFilterName: HTMLDivElement = HtmlCreator.create('div', undefined, 'filters__category-filter-name');
    categoriesFilterName.textContent = 'Категории';
    const categoriesMenu: HTMLDivElement = HtmlCreator.create('div', undefined, 'filters__category-menu');

    ['фентези', 'научпоп', 'роман', 'детские'].forEach((cat) => {
      const option: HTMLDivElement = HtmlCreator.create('div', undefined, 'filters__category-menu-item');
      option.textContent = cat;
      option.addEventListener('click', () => {});
      categoriesMenu.append(option);
    });

    categoriesFilterName.addEventListener('click', () => {
      categoriesMenu.style.display = categoriesMenu.style.display === 'none' ? 'block' : 'none';
    });

    categoriesFilter.append(categoriesFilterName, categoriesMenu);
    filters.append(categoriesFilter);
    this.filters.append(filters);
  }

  private async getCatalog(): Promise<void> {
    const locale: string = navigator.language || 'ru';
    const lang: string = locale.split('-')[0];

    const cartId: string | null = localStorage.getItem(LocalStorageKeys.USER_CART_ID);
    let currentCartProducts: string[] = [];
    if (cartId) {
      const cart: Cart = await this.restHandler.getCartByCartId(cartId);
      currentCartProducts = cart.lineItems.map((item: LineItem): string => item.productId);
    }

    this.restHandler.getProductsAll().then(async (response: Product[]) => {
      for (let product of response) {
        const item: ProductData = product.masterData.current;
        const productCard = HtmlCreator.create('div', product.id, 'product__card-item');
        const productImgWrap = HtmlCreator.create('div', undefined, 'product__img-wrapper');
        const productImg = HtmlCreator.create('img', undefined, 'product__img');
        productImg.src = item.masterVariant.images[0].url;
        productImg.alt = `${item.name[lang]}`;
        productImgWrap.append(productImg);
        const productName = HtmlCreator.create('h2', undefined, 'product__name');
        productName.textContent = `${item.name[lang]}`;
        const productDesc = HtmlCreator.create('p', undefined, 'product__desc');
        const text = `${item.description[lang]}`;
        productDesc.textContent = text.slice(0, 150) + '...';
        const productPriceWrap = HtmlCreator.create('div', undefined, 'product__price-wrap');
        const productPrice = HtmlCreator.create('p', undefined, 'product__price-norm');
        productPrice.textContent = `${formatCentAmount(item.masterVariant.prices[0])} ${item.masterVariant.prices[0].value.currencyCode}`;
        const productPriceDiscount = HtmlCreator.create('p', undefined, 'product__price-discount');

        if (isNotNullable(item.masterVariant.prices[0].discounted)) {
          productPriceDiscount.textContent = `${formatDiscount(item.masterVariant.prices[0])} ${item.masterVariant.prices[0].discounted.value.currencyCode}`;
          productPrice.classList.add('discounted');
        }

        const productCartButton = HtmlCreator.create('button', undefined, 'product__cart-btn');

        if (currentCartProducts.includes(product.id)) {
          productCartButton.textContent = 'В корзинe';
          productCartButton.setAttribute('disabled', 'true');
        } else productCartButton.textContent = 'В корзину';

        productPriceWrap.append(productPriceDiscount, productPrice);
        productCard.append(productImgWrap, productName, productDesc, productPriceWrap, productCartButton);
        productCard.addEventListener('click', async (event) => {
          const element: EventTarget | null = event.currentTarget;
          const target = event.target;

          if (element !== null && element instanceof Element && target instanceof Element) {
            if (target.classList.contains('product__cart-btn')) {
              if (await this.restHandler.addProductToCartButton(element.id)) {
                productCartButton.textContent = 'В корзинe';
                productCartButton.setAttribute('disabled', 'true');
              }
            } else {
              router.navigate(`${AppRoutes.PRODUCT}${element.id}`);
            }
          }
        });
        this.catalog.append(productCard);
      }
    });
  }
}
