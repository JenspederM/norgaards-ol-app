import type { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp, WithFieldValue } from "firebase/firestore";

export interface IBeer {
    uid: string;
    name: string;
    price: number;
    nBeers: number;
    profitMargin: number;
    nLeft: number;
    purchaseDate: Date;
    isActive: boolean;
}

export class Beer implements IBeer {
    uid: string;
    name: string;
    price: number;
    nBeers: number;
    nLeft: number;
    profitMargin: number;
    purchaseDate: Date;
    isActive: boolean;

    constructor({
        uid,
        name,
        nBeers,
        nLeft,
        price,
        profitMargin = 0,
        purchaseDate = new Date(),
        isActive = true,
    }: IBeer) {
        if (uid) {
            this.uid = uid;
        }
        if (purchaseDate instanceof Date) {
            this.purchaseDate = purchaseDate;
        } else {
            const _purchaseDate = purchaseDate as Timestamp;
            this.purchaseDate = _purchaseDate.toDate();
        }
        this.name = name;
        this.price = price;
        this.nBeers = nBeers;
        this.nLeft = nLeft;
        this.profitMargin = profitMargin;
        this.isActive = isActive;
    }

    get salesPrice() {
        return Math.round(
            (this.price / this.nBeers) * (1 + this.profitMargin / 100)
        )
    }

    get pricePerPiece() {
        return (this.price / this.nBeers) * (1 + this.profitMargin / 100);
    }
}

export const beerConverter: FirestoreDataConverter<Beer> = {
    toFirestore: (beer: WithFieldValue<Beer>) => {
        return {
            uid: beer.uid,
            name: beer.name,
            price: beer.price,
            nBeers: beer.nBeers,
            nLeft: beer.nLeft,
            profitMargin: beer.profitMargin,
            purchaseDate: beer.purchaseDate ? beer.purchaseDate : new Date(),
            isActive: beer.isActive,
        };
    },
    fromFirestore: (docSnap: QueryDocumentSnapshot) => {
        return new Beer(docSnap.data() as IBeer);
    },
};