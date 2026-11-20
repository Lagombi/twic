import { SetModel } from './set-model';

describe('SetModel', () => {
  it('should create and populate an instance', () => {
    const set = new SetModel(
      'sm6',
      'Forbidden Light',
      'logo.webp',
      'symbol.webp',
      { total: 146, official: 131 },
    );

    expect(set.id).toBe('sm6');
    expect(set.cardCount.official).toBe(131);
  });
});
