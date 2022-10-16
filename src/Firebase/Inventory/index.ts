import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "..";
import { Beer, IBeer } from "./products/beer";

export class Inventory {
    beers: Array<Beer> = [];

    guid() {
        const CHARS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let autoId = "";

        for (let i = 0; i < 20; i++) {
            autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        }
        return autoId;
    } // End Function guid

    async newInventoryType(
        name: string,
        price: number,
        nBeers: number,
        profitMargin: number
    ) {
        const uid = this.guid();
        const beer = new Beer({
            name,
            nBeers,
            price,
            profitMargin,
            uid,
        } as IBeer);
        const beerDoc = {
            uid: beer.uid,
            name: beer.name,
            nBeers: beer.nBeers,
            nLeft: beer.nLeft,
            price: beer.price,
            profitMargin: beer.profitMargin,
            purchaseDate: beer.purchaseDate,
        };
        const newBeer = await setDoc(doc(db, "inventory", uid), beerDoc);
        await this.getInventory();
        return newBeer;
    }

    async getInventory() {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        let result = [];
        querySnapshot.forEach((doc) => {
            const beerArgs = doc.data() as IBeer;
            if (beerArgs) {
                result.push(new Beer(beerArgs));
            }
        });
        this.beers = result;
        return this.beers;
    }
}