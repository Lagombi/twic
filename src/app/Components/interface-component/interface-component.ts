import { Component, computed, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AssetsService } from '../../Services/assets-service';
import { CardModel } from '../../Models/card-model';
import { SetModel } from '../../Models/set-model';
import { SearchableModel } from '../../Models/searchable-model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-interface-component',
  styleUrl: './interface-component.scss',
  templateUrl: './interface-component.html',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatCardModule, MatFormFieldModule, MatSelectModule, NgxMatSelectSearchModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCheckboxModule]
})
export class InterfaceComponent implements OnInit {

  constructor(private assetsService: AssetsService) {}
  private initialJson: Record<string, string> = {};
  private newJson: Record<string, string> = {};
  public downloadUri: string | null = null;

  // user input variables... no reason to make a fancy form.
  public customSource: string = '';
  public bulkReplace: boolean = false;
  public customImageUrl: string = '';
  public selectedCard: SearchableModel | undefined;
  public cardSearchControl = new FormControl('', { nonNullable: true });
  private cardSearchTerm = toSignal(this.cardSearchControl.valueChanges, { initialValue: '' });

  public cardInfo: CardModel[] = [];
  public setInfo: SetModel[] = [];
  public searchableData = signal<SearchableModel[]>([]);
  public filteredSearchableData = computed(() => {
    const query = this.cardSearchTerm().trim().toLowerCase();
    return this.searchableData().filter((card) => this.matchesSearchQuery(card, query));
  });
  public initialLoading: {
    sourceImages: boolean;
    cardInfo: boolean;
    setInfo: boolean;
    finalSetup: boolean;
    customSource: boolean;
  } = {
    sourceImages: true,
    cardInfo: true,
    setInfo: true,
    finalSetup: true, // this is for populateSearchableDataWhenReady()... It will be false once all data is loaded
    customSource: false
  };

  ngOnInit(): void {
    // load the twinleaf-acceptable base JSON, the card model info, and the set info.
    this.assetsService.getSourceImages().subscribe((data) => {
      this.initialJson = data;
      this.newJson = structuredClone(data);
      
      this.initialLoading.sourceImages = false;
      this.populateSearchableDataWhenReady();
    });

    this.assetsService.getCardInfo().subscribe((data) => {
      this.cardInfo = data;
      this.initialLoading.cardInfo = false;
      this.populateSearchableDataWhenReady();
    });

    this.assetsService.getSetInfo().subscribe((data) => {
      this.setInfo = data;
      this.initialLoading.setInfo = false;
      this.populateSearchableDataWhenReady();
    });

  }

  loadCustomSource(): void {
    this.initialLoading.customSource = true;
    this.downloadUri = null;
    this.assetsService.getSourceImages(this.customSource).subscribe((data) => {
      this.newJson = structuredClone(data);

      // the cloned JSON may be older and have fewer properties than the original JSON. Let's reconcile it with the original JSON.
      this.newJson = { ...this.initialJson, ...this.newJson };

      this.initialLoading.customSource = false;
    });
  }

  // Create a downloadable data URI from the current customized JSON.
  public generateJson(): void {
    const json = JSON.stringify(this.newJson, null, 2);
    this.downloadUri = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
  }

  // This was implemented by GitHub Copilot. I like to be clear when using AI generated code.
  private populateSearchableDataWhenReady(): void {
    if (this.initialLoading.sourceImages || this.initialLoading.cardInfo || this.initialLoading.setInfo) {
      return;
    }

    const sourcePropertyByUrl = new Map(
      Object.entries(this.initialJson).map(([propertyName, url]) => [url, propertyName] as const)
    );
    const setById = new Map(this.setInfo.map((set) => [set.id, set] as const));

    this.searchableData.set(this.cardInfo.flatMap((card) => {
      const cardIdSuffix = `-${card.localId}`;
      if (!card.id.endsWith(cardIdSuffix)) {
        return [];
      }

      const setId = card.id.slice(0, -cardIdSuffix.length);
      const setModel = setById.get(setId);
      if (!setModel) {
        return [];
      }

      const imageUrl = card.image
        ? `${card.image.replace(/\/+$/, '')}/low.webp`
        : undefined;
      const jsonPropertyName = imageUrl ? sourcePropertyByUrl.get(imageUrl) : undefined;

      return [
        new SearchableModel(
          card,
          setModel,
          jsonPropertyName ?? '',
          jsonPropertyName !== undefined
        ),
      ];
    }));
    this.initialLoading.finalSetup = false;
  }

  // Match the search text against every value displayed in a card option. This was generated by GitHub Copilot.
  private matchesSearchQuery(card: SearchableModel, query: string): boolean {
    if (!query) {
      return true;
    }

    const searchableText = [
      card.cardModel.name,
      card.cardModel.id,
      card.setModel.name,
      `${card.cardModel.localId}/${card.setModel.cardCount.official}`
    ].join(' ').toLowerCase();

    return searchableText.includes(query);
  }

  public replaceCardImage(selectedCard: SearchableModel, bulkReplace?: boolean) {
    // Replace the image of the selected card with the entered custom URL. bulkReplace will apply to all cards with the same "name" property from CardModel.
    // Remember, we are updating the url in our newJson object.
    if (selectedCard.jsonPropertyName) {
      this.newJson[selectedCard.jsonPropertyName] = this.customImageUrl;
    }
    if (bulkReplace) {
      // will probably be slow. For now, we are gonna accept that. In the future, some sort of map structure could be used to quickly find cards by name.
      this.searchableData().forEach((card) => {
        if (card.cardModel.name === selectedCard.cardModel.name && card.jsonPropertyName) {
          this.newJson[card.jsonPropertyName] = this.customImageUrl;
        }
      });
    }
    this.downloadUri = null;
    
  }

  // what i'm thinking is... we have an angular material select dropdown the user can search on, which will show them the card name followed by the card/set-id (id property on CardModel)
  // in subtext beneath this display, we can show the full name of the set, as well as the localId of the card over the official cardcount of the set it's in.
  // it may be more efficient to build a preprocessed data structure for search and display.
  // the searched card will be selected, and the user can then enter a custom image URL for that card.
  // when the user clicks "confirm", the custom image URL will be applied to the selected card in the new JSON.

  // refer to source-image-file.json for the strucutre, but
  // we can map cards to the relevant JSON object from the source image file by using the URL as the key.
  // in the source, the relevant property name that we will need to update the value of in our new JSON will have the same URL as the cardModel's image property as its value,
  // but it will have an extra /low.webp appended to the end. 

  // if we make a new preprocessed data structure, it may be useful to confirm that each card exists in the source url, and track this so we can disable selection of ones not present.
  // it may also be useful to simply track the original JSON property name of each card in this new json structure, so updates are easy to apply.
  
}
