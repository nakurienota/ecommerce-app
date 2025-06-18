import { LocalStorageKeys } from '@core/enum/local-storage-keys';
import type { Cart, LineItem } from '@core/model/cart';
import type { Product, ProductData } from '@core/model/product';
import { Resthandler } from '@service/rest/resthandler';
import { formatCentAmount, formatDiscount } from '@utils/formatters';
import HtmlCreator from '@utils/html';
import { isNotNullable } from '@utils/not-nullable';
import { removeChildren } from '@utils/removehtml';
import { AppRoutes, router } from '@utils/router';

import { PaginationButtons } from '../../components/pagination/pagination';

export default class CatalogPage {
  public container: HTMLElement;
  private readonly restHandler: Resthandler = Resthandler.getInstance();
  private readonly catalogWrapper: HTMLElement;
  private readonly filters: HTMLElement;
  private readonly catalog: HTMLElement;
  private pagination: PaginationButtons;
  private page: number;
  private cardsPerPage = 12;
  private totalPages: number;
  private catalogArray: Product[];
  private currentCartProducts: string[];
  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
    const catalogWrapper: HTMLDivElement = HtmlCreator.create('div', undefined, 'catalog-wrapper');
    this.catalogWrapper = catalogWrapper;
    this.filters = HtmlCreator.create('section', undefined, 'section', 'filters');
    this.catalog = HtmlCreator.create('section', undefined, 'section', 'catalog');
    this.pagination = new PaginationButtons();
    this.addPaginationEvents();
    catalogWrapper.append(this.filters, this.catalog, this.pagination.getPagination());
    this.page = 0;
    this.totalPages = 0;
    this.catalogArray = [];
    this.currentCartProducts = [];
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
    const cartId: string | null = localStorage.getItem(LocalStorageKeys.USER_CART_ID);

    if (cartId) {
      const cart: Cart = await this.restHandler.getCartByCartId(cartId);
      this.currentCartProducts = cart.lineItems.map((item: LineItem): string => item.productId);
    }

    this.catalogArray = await this.restHandler.getProductsAll();
    this.page = 1;
    this.totalPages = Math.ceil(this.catalogArray.length / this.cardsPerPage);
    const paginatedCatalog = this.getPaginatedCatalog(this.catalogArray);
    this.getPaginatedCatalogHTML(paginatedCatalog, this.currentCartProducts);
    this.updatePaginationButtons();
  }

  private getPaginatedCatalog(catalog: Product[]): Product[] {
    return catalog.slice((this.page - 1) * this.cardsPerPage, this.page * this.cardsPerPage);
  }

  private getPaginatedCatalogHTML(catalog: Product[], currentCartProducts: string[]): void {
    const locale: string = navigator.language || 'ru';
    const lang: string = locale.split('-')[0];
    const fragment = document.createDocumentFragment();
    for (let product of catalog) {
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
      fragment.append(productCard);
    }
    this.catalog.append(fragment);
  }

  private nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      removeChildren(this.catalog);
      this.getPaginatedCatalogHTML(this.getPaginatedCatalog(this.catalogArray), this.currentCartProducts);
      this.updatePaginationButtons();
    }
  }

  private prevPage(): void {
    if (this.page > 1) {
      this.page--;
      removeChildren(this.catalog);
      this.getPaginatedCatalogHTML(this.getPaginatedCatalog(this.catalogArray), this.currentCartProducts);
      this.updatePaginationButtons();
    }
  }

  private updatePaginationButtons(): void {
    this.pagination.getPrevButton().disabled = this.page === 1;
    this.pagination.getNextButton().disabled = this.page === this.totalPages;
  }

  private addPaginationEvents(): void {
    this.pagination.getPrevButton().addEventListener('click', () => this.prevPage());
    this.pagination.getNextButton().addEventListener('click', () => this.nextPage());
  }
}
