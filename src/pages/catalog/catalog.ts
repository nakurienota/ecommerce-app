import type { Product, ProductData } from '@core/model/product';
import { Resthandler } from '@service/rest/resthandler';
import HtmlCreator from '@utils/html';
import { AppRoutes, router } from '@utils/router';

export default class CatalogPage {
  public container: HTMLElement;
  private readonly restHandler: Resthandler = Resthandler.getInstance();
  private categoryWrap: HTMLElement;
  private catalogWrapper: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
    this.categoryWrap = HtmlCreator.create('div', undefined, 'category__wrap');
    this.catalogWrapper = HtmlCreator.create('section', undefined, 'section', 'catalog');
  }

  public getHTML(): HTMLElement {
    this.getCatalog();
    this.container.append(this.getControls(), this.catalogWrapper);

    return this.container;
  }

  private getControls(): HTMLElement {
    const controls = HtmlCreator.create('section', undefined, 'section', 'controls');
    this.categoryWrap.textContent = 'Категории';
    controls.append(this.categoryWrap);

    return controls;
  }

  private getCatalog(): void {
    const locale: string = navigator.language || 'ru';
    const lang: string = locale.split('-')[0];
    this.restHandler.getProductsAll().then((response: Product[]) => {
      console.log(response);
      for (let product of response) {
        const item: ProductData = product.masterData.current;
        console.log(product);
        const productCard = HtmlCreator.create('div', undefined, 'product__card-item');
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
        const moreInfoButton = HtmlCreator.create('button', product.id, 'product__btn-more-info');
        moreInfoButton.addEventListener('click', (event) => {
          const element = event.currentTarget;
          event.preventDefault();

          if (element instanceof Element) {
            console.log(element.id);
            router.navigate(`${AppRoutes.PRODUCT}${element.id}`);
          }
        });
        const moreImg = HtmlCreator.create('img', undefined, 'product__more-img');
        moreImg.src = '../../assets/images/right_arrow.webp';
        moreImg.alt = 'more info link';
        moreInfoButton.append(moreImg);
        productDesc.append(moreInfoButton);
        const productPrice = HtmlCreator.create('p', undefined, 'product__price');
        productPrice.textContent = `${item.masterVariant.prices[0].value.centAmount} ${item.masterVariant.prices[0].value.currencyCode}`;
        productCard.append(productImgWrap, productName, productDesc, productPrice);
        this.catalogWrapper.append(productCard);
      }
    });
  }
}
