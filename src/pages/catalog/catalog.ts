import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { Product, ProductData } from '@core/model/product';
import { Resthandler } from '@service/rest/resthandler';
import { formatCentAmount, formatDiscount } from '@utils/formatters';
import HtmlCreator from '@utils/html';
import { isNotNullable } from '@utils/not-nullable';
import { AppRoutes, router } from '@utils/router';
// import { userLoggedCart } from '@utils/security';

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

  public getHTML(): HTMLElement {
    this.getCatalog();
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

  private getCatalog(): void {
    const locale: string = navigator.language || 'ru';
    const lang: string = locale.split('-')[0];
    this.restHandler.getProductsAll().then((response: Product[]) => {
      // console.log(response);
      for (let product of response) {
        // console.log(product);
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
        productCartButton.textContent = 'В корзину';

        productPriceWrap.append(productPriceDiscount, productPrice);
        productCard.append(productImgWrap, productName, productDesc, productPriceWrap, productCartButton);
        productCard.addEventListener('click', async (event) => {
          const element: EventTarget | null = event.currentTarget;
          const target = event.target;

          if (element !== null && element instanceof Element && target instanceof Element) {
            if (target.classList.contains('product__cart-btn')) {
              const customerId = localStorage.getItem(LocalStorageKeys.USER_ID_LOGGED_IN);
              if (isNotNullable(customerId)) {
                const cartId = localStorage.getItem(LocalStorageKeys.USER_LOGGED_CART_ID);
                console.log('cardID ' + cartId);
                if (isNotNullable(cartId)) {
                  const cart = await this.restHandler.addProductToCart(cartId, element.id);
                  console.log(cart);
                } else {
                  const cartId = await this.restHandler.createCart();
                  localStorage.setItem(LocalStorageKeys.USER_LOGGED_CART_ID, cartId);
                  const cart = await this.restHandler.setCustomerIdForCart(cartId, customerId);
                  console.log(cart);
                  const data = await this.restHandler.addProductToCart(cartId, element.id);
                  console.log(data);
                }
              } else {
                const anonymousCartId = localStorage.getItem(LocalStorageKeys.ANONYMOUS_CART_ID);
                if (isNotNullable(anonymousCartId)) {
                  const data = await this.restHandler.addProductToCart(anonymousCartId, element.id);
                  console.log(data);
                } else {
                  const newAnonymousCartId = await this.restHandler.createCart();
                  localStorage.setItem(LocalStorageKeys.ANONYMOUS_CART_ID, newAnonymousCartId);
                  const data = await this.restHandler.addProductToCart(newAnonymousCartId, element.id);
                  console.log(data);
                }
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
