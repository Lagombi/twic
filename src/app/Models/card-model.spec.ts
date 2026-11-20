import { CardModel } from './card-model';

describe('CardModel', () => {
  it('should create and populate an instance', () => {
    const card = new CardModel(
      'sm6-1',
      '1',
      'Exeggcute',
      'https://assets.tcgdex.net/en/sm/sm6/1',
    );

    expect(card.id).toBe('sm6-1');
    expect(card.name).toBe('Exeggcute');
  });
});
