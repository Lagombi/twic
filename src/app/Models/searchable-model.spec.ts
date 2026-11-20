import { SearchableModel } from './searchable-model';
import { CardModel } from './card-model';
import { SetModel } from './set-model';

describe('SearchableModel', () => {
  it('should create and populate an instance', () => {
    const card = new CardModel('sm6-1', '1', 'Exeggcute', 'image.webp');
    const set = new SetModel(
      'sm6',
      'Forbidden Light',
      'logo.webp',
      'symbol.webp',
      { total: 146, official: 131 },
    );
    const searchable = new SearchableModel(card, set, 'exeggcute', true);

    expect(searchable.cardModel).toBe(card);
    expect(searchable.setModel).toBe(set);
    expect(searchable.jsonPropertyName).toBe('exeggcute');
    expect(searchable.existsInSource).toBe(true);
  });
});
