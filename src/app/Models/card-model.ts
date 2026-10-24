export class CardModel {
    // Pulled from the TCGdex API for card information.
    // example stucture:
    /*
        { id: "sm6-1", localId: "1", name: "Exeggcute", image: "https://assets.tcgdex.net/en/sm/sm6/1" }
    */

    id: string; // format: setId-localId. Will be used for filtering purposes in our application.
    localId: string;
    name: string;
    image: string; // URL to the card's image. The initial JSON 

    constructor(id: string, localId: string, name: string, image: string) {
        this.id = id;
        this.localId = localId;
        this.name = name;
        this.image = image;
    }
}
