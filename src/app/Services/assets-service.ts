import { Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SetModel } from '../Models/set-model';
import { CardModel } from '../Models/card-model';

@Injectable({
    providedIn: 'root'
})
export class AssetsService {
    // Load the data from existing source files and APIs.
    // This is gonna look super amatuer for my years of experience but dawg I just want to get something out there.
    constructor(private http: HttpClient) {}

    // Initial call to get source image files. JSON structure will change as new cards release, so we must use the <any> type.
    getSourceImages(customSource?: string): Observable<any> {
        const url = customSource ? customSource : 'https://amydev.me/twinleaf-json/image-jsons/tcgdex/small.json';
        return this.http.get(url);
        // custom may not be tenable with initial implementation, as we scrape card info from the urls in this JSON.
        // alternative approach - init of app will load with no custom source, save this to an original variable.
        // then, users can override the target JSON using their own custom source, but the original remains available for reference.
    }

    // gets the set info, I'm thinking this will be useful when searching cards to replace images for.
    getSetInfo(): Observable<SetModel[]> {
        const url = 'https://api.tcgdex.net/v2/en/sets';
        return this.http.get<SetModel[]>(url);
    }

    // gets the card info. Necessary for the user to know what card they're selecting.
    getCardInfo(): Observable<CardModel[]> {
        const url = 'https://api.tcgdex.net/v2/en/cards';
        return this.http.get<CardModel[]>(url);
    }


}
