import { Component, OnInit } from '@angular/core';
import { AssetsService } from '../../Services/assets-service';
import { CardModel } from '../../Models/card-model';
import { SetModel } from '../../Models/set-model';

@Component({
  selector: 'app-interface-component',
  styleUrl: './interface-component.scss',
  templateUrl: './interface-component.html',
})
export class InterfaceComponent implements OnInit {

  constructor(private assetsService: AssetsService) {}
  private initialJson: any;
  private newJson: any;

  // user input variables... no reason to make a fancy form.
  public customSource: string = '';

  public cardInfo: CardModel[] = [];
  public setInfo: SetModel[] = [];
  public initialLoading: {
    sourceImages: boolean;
    cardInfo: boolean;
    setInfo: boolean;
    customSource: boolean;
  } = {
    sourceImages: true,
    cardInfo: true,
    setInfo: true,
    customSource: false
  };

  ngOnInit(): void {
    // load the twinleaf-acceptable base JSON, the card model info, and the set info.
    this.assetsService.getSourceImages().subscribe((data) => {
      this.initialJson = data;
      this.newJson = structuredClone(data);
      
      this.initialLoading.sourceImages = false;
    });

    this.assetsService.getCardInfo().subscribe((data) => {
      this.cardInfo = data;
      this.initialLoading.cardInfo = false;
    });

    this.assetsService.getSetInfo().subscribe((data) => {
      this.setInfo = data;
      this.initialLoading.setInfo = false;
    });
  }

  loadCustomSource(): void {
    this.initialLoading.customSource = true;
    this.assetsService.getSourceImages(this.customSource).subscribe((data) => {
      this.newJson = structuredClone(data);

      // the cloned JSON may be older and have fewer properties than the original JSON. Let's reconcile it with the original JSON.
      this.newJson = { ...this.initialJson, ...this.newJson };

      this.initialLoading.customSource = false;
    });
  }
  
}
