import type { Product, ProductData } from '@core/model/product';
import { Resthandler } from '@service/rest/resthandler';
import HtmlCreator from '@utils/html';
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
        const productPrice = HtmlCreator.create('p', undefined, 'product__price');
        productPrice.textContent = `${item.masterVariant.prices[0].value.centAmount} ${item.masterVariant.prices[0].value.currencyCode}`;
        productCard.append(productImgWrap, productName, productDesc, productPrice);
        productCard.addEventListener('click', (event) => {
          const element: EventTarget | null = event.currentTarget;

          if (element !== null && element instanceof Element) {
            router.navigate(`${AppRoutes.PRODUCT}${element.id}`);
          }
        });
        this.catalog.append(productCard);
      }
    });
  }
}
