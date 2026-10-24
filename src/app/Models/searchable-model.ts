import { CardModel } from './card-model';
import { SetModel } from './set-model';

export class SearchableModel {
    public cardModel: CardModel;
    public setModel: SetModel;
    public jsonPropertyName: string;
    public existsInSource: boolean;

    constructor(cardModel: CardModel, setModel: SetModel, jsonPropertyName: string, existsInSource: boolean) {
        this.cardModel = cardModel;
        this.setModel = setModel;
        this.jsonPropertyName = jsonPropertyName;
        this.existsInSource = existsInSource;
    }
}
