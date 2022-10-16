import type { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp, WithFieldValue } from "firebase/firestore";
import { Inventory } from "./Inventory";
import type { Beer } from "./Inventory/products/beer";

export interface BeerHistory {
    name: string;
    date: Timestamp;
    amount: number;
    price: number;
    total: number;
    isPayed: boolean;
    uid: boolean;
};

export interface IUser {
    uid: string;
    email: string;
    displayName: string;
    isAdmin: boolean;
    beerHistory: BeerHistory[];
};

export class User implements IUser {
    beerHistory: BeerHistory[];
    uid: string;
    email: string;
    displayName: string;
    isAdmin: boolean;
    basket: Basket;

    constructor({ uid, email, displayName, isAdmin, beerHistory }: IUser) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.isAdmin = isAdmin;
        this.beerHistory = beerHistory;
        this.basket = new Basket(this);
    }

    get amountOwed() {
        return this.beerHistory.reduce((acc, beer) => {
            if (!beer.isPayed) {
                acc += beer.total;
            }
            return acc;
        }, 0);
    }
}

export const userConverter: FirestoreDataConverter<User> = {
    toFirestore: (user: WithFieldValue<User>) => {
        return {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            isAdmin: user.isAdmin,
            beerHistory: user.beerHistory,
        };
    },
    fromFirestore: (docSnap: QueryDocumentSnapshot) => {
        return new User(docSnap.data() as IUser);
    },
};

export class Basket {
    user: User;
    items: Array<Beer>;
    inventory: Inventory;

    constructor(user: User) {
        this.user = user;
        this.items = [];
        this.inventory = new Inventory();
    }

    async getStock() {
        const stock = await this.inventory.getInventory();
        return stock;
    }

    addItem(item: Beer) {
        this.items.push(item);
        return this.items;
    }

    getItems() {
        return this.items;
    }

    clear() {
        this.items = [];
        return this.items;
    }

    removeItem(item) {
        const idx = this.items.indexOf(item);
        if (idx > -1) {
            return this.items.splice(idx, 1);
        }
    }
}