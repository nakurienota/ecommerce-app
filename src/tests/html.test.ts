import HtmlCreator from '../utils/html';

test('create element with the correct tag', () => {
  const div = HtmlCreator.create('div');
  expect(div).toBeInstanceOf(HTMLDivElement);
});
test('set element id', () => {
  const button = HtmlCreator.create('button', 'test-button');
  expect(button.id).toBe('test-button');
});
test('add classes to element', () => {
  const span = HtmlCreator.create('span', undefined, 'class1', 'class2');
  expect(span.classList.contains('class1')).toBe(true);
  expect(span.classList.contains('class2')).toBe(true);
});
test('work without id and classes', () => {
  const p = HtmlCreator.create('p');
  expect(p.id).toBe('');
  expect(p.className).toBe('');
});
