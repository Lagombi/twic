import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CardModel } from '../../Models/card-model';
import { SearchableModel } from '../../Models/searchable-model';
import { SetModel } from '../../Models/set-model';
import { AssetsService } from '../../Services/assets-service';
import { InterfaceComponent } from './interface-component';

describe('InterfaceComponent', () => {
  let component: InterfaceComponent;
  let fixture: ComponentFixture<InterfaceComponent>;
  let assetsService: {
    getSourceImages: ReturnType<typeof vi.fn>;
    getCardInfo: ReturnType<typeof vi.fn>;
    getSetInfo: ReturnType<typeof vi.fn>;
  };

  const initialJson = {
    exeggcute: 'https://assets.tcgdex.net/en/sm/sm6/1/low.webp',
    exeggutor: 'https://assets.tcgdex.net/en/sm/sm6/2/low.webp',
  };

  const set = new SetModel(
    'sm6',
    'Forbidden Light',
    'logo',
    'symbol',
    { total: 146, official: 131 },
  );
  const exeggcute = new CardModel(
    'sm6-1',
    '1',
    'Exeggcute',
    'https://assets.tcgdex.net/en/sm/sm6/1',
  );
  const exeggutor = new CardModel(
    'sm6-2',
    '2',
    'Exeggutor',
    'https://assets.tcgdex.net/en/sm/sm6/2',
  );
  const exeggcuteVariant = new CardModel(
    'sm6-3',
    '3',
    'Exeggcute',
    'https://assets.tcgdex.net/en/sm/sm6/3',
  );

  beforeEach(async () => {
    assetsService = {
      getSourceImages: vi.fn((customSource?: string) =>
        of(customSource
          ? { exeggcute: 'https://custom.example/exeggcute.webp' }
          : initialJson),
      ),
      getCardInfo: vi.fn(() => of([exeggcute, exeggutor, exeggcuteVariant])),
      getSetInfo: vi.fn(() => of([set])),
    };

    await TestBed.configureTestingModule({
      imports: [InterfaceComponent],
      providers: [{ provide: AssetsService, useValue: assetsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(InterfaceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the setup and replacement UX', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Custom Source URL (optional)');
    expect(element.textContent).toContain('Replace Card Images');
    expect(element.textContent).toContain('Replace for all cards with the same name.');
    expect(element.textContent).toContain('Generate Customized JSON');
  });

  it('should filter cards by name and rank exact matches first', () => {
    component.cardSearchControl.setValue('Exeggcute');

    const results = component.filteredSearchableData();

    expect(results).toHaveLength(2);
    expect(results.every((card) => card.cardModel.name === 'Exeggcute')).toBe(true);
  });

  it('should show no matches for a short non-exact search', () => {
    component.cardSearchControl.setValue('x');

    expect(component.filteredSearchableData()).toEqual([]);
  });

  it('should replace one card and reset the URL and download', () => {
    const selected = new SearchableModel(exeggcute, set, 'exeggcute', true);
    component.customImageUrl = 'https://custom.example/single.webp';

    component.replaceCardImage(selected);
    component.generateJson();

    const generated = JSON.parse(
      decodeURIComponent(component.downloadUri!.split(',')[1]),
    ) as Record<string, string>;
    expect(generated['exeggcute']).toBe('https://custom.example/single.webp');
    expect(generated['exeggutor']).toBe(initialJson.exeggutor);
    expect(component.customImageUrl).toBe('');
  });

  it('should replace every matching card name when bulk replace is enabled', () => {
    const selected = new SearchableModel(exeggcute, set, 'exeggcute', true);
    component.customImageUrl = 'https://custom.example/bulk.webp';

    component.replaceCardImage(selected, true);
    component.generateJson();

    const generated = JSON.parse(
      decodeURIComponent(component.downloadUri!.split(',')[1]),
    ) as Record<string, string>;
    expect(generated['exeggcute']).toBe('https://custom.example/bulk.webp');
    expect(component.downloadUri).toContain('data:application/json');
  });

  it('should load a custom source and reconcile missing properties', () => {
    component.customSource = 'https://custom.example/cards.json';

    component.loadCustomSource();
    component.generateJson();

    expect(assetsService.getSourceImages).toHaveBeenCalledWith(
      'https://custom.example/cards.json',
    );
    const generated = JSON.parse(
      decodeURIComponent(component.downloadUri!.split(',')[1]),
    ) as Record<string, string>;
    expect(generated['exeggcute']).toBe('https://custom.example/exeggcute.webp');
    expect(generated['exeggutor']).toBe(initialJson.exeggutor);
  });
});
