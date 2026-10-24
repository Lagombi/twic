export class SetModel {
    // Pulled from the TCGdex API for set information.
    // example structure:
    /*
        {
            id	"me02.5"
            name	"Ascended Heroes"
            logo	"https://assets.tcgdex.net/en/me/me02.5/logo"
            symbol	"https://assets.tcgdex.net/univ/me/me02.5/symbol"
            cardCount	{ total: 295, official: 217 }
        }
    */
    id: string;
    name: string;
    logo: string;
    symbol: string;
    cardCount: {
        total: number;
        official: number;
    };

    constructor(id: string, name: string, logo: string, symbol: string, cardCount: { total: number; official: number }) {
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.symbol = symbol;
        this.cardCount = cardCount;
    }
}
