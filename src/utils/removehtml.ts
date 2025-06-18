export function removeChildren(element: HTMLElement): void {
  while (element.firstElementChild) element.firstElementChild.remove();
}
