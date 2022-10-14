// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { UserData, BeerInStock, BeerHistory } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyD-puE41J_NDaEdYFBRwYixGsK7i2DJqgQ",
  authDomain: "norgaards-ol-app.firebaseapp.com",
  projectId: "norgaards-ol-app",
  storageBucket: "norgaards-ol-app.appspot.com",
  messagingSenderId: "245178053513",
  appId: "1:245178053513:web:181ddd2cf8a24a04432758",
  measurementId: "G-MZF8TF35E2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

class Basket {
  items: Array<Beer>;
  inventory: Inventory;

  constructor() {
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

  buy(user) {
    let result = {};
    this.items.forEach((beer) => {
      if (result[beer.uid]) {
        result[beer.uid].total += beer.salesPrice();
        result[beer.uid].amount += 1;
      } else {
        result[beer.uid] = {
          total: beer.salesPrice(),
          amount: 1,
          date: new Date(),
          isPayed: false,
          name: beer.uid,
          price: beer.salesPrice(),
        };
      }
    });
    Object.keys(result).forEach(async (beerUid) => {
      await updateDoc(doc(db, "users", user.me.uid), {
        beerHistory: arrayUnion(result[beerUid]),
      });
    });
    this.clear();
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
    return new Beer(docSnap.data() as BeerInStock);
  },
};

export class Beer implements BeerInStock {
  uid: string;
  name: string;
  price: number;
  nBeers: number;
  nLeft: number;
  profitMargin: number;
  purchaseDate: Date;
  isActive: boolean;

  get pricePerPiece() {
    return (this.price / this.nBeers) * (1 + this.profitMargin / 100);
  }

  constructor({
    uid,
    name,
    nBeers,
    nLeft,
    price,
    profitMargin = 0,
    purchaseDate = new Date(),
    isActive = true,
  }: BeerInStock) {
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

  salesPrice(beer: Beer = null) {
    if (beer) {
      return this._calculatePricePerPiece(beer);
    } else {
      return this._calculatePricePerPiece(this);
    }
  }

  _calculatePricePerPiece(beer: Beer) {
    return Math.round(
      (beer.price / beer.nBeers) * (1 + beer.profitMargin / 100)
    );
  }

  sellBeers(amount) {
    this.nLeft -= amount;
  }

  restock(amount) {
    this.nLeft += amount;
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
    return new User(docSnap.data() as UserData);
  },
};

export class User implements UserData {
  beerHistory: BeerHistory[];
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  basket: Basket = new Basket();

  constructor({ uid, email, displayName, isAdmin, beerHistory }: UserData) {
    this.uid = uid;
    this.email = email;
    this.displayName = displayName;
    this.isAdmin = isAdmin;
    this.beerHistory = beerHistory;
  }

  async update() {
    const userDocSnap = await getDoc(doc(db, "users", this.uid));
    if (userDocSnap.exists()) {
      return userDocSnap.data() as UserData;
    }
  }

  isAmin() {
    return this.isAdmin ? true : false;
  }

  getAmountOwed() {
    return this.beerHistory.reduce((acc, beer) => {
      if (!beer.isPayed) {
        acc += beer.total;
      }
      return acc;
    }, 0);
  }
}

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
    } as BeerInStock);
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
      const beerArgs = doc.data() as BeerInStock;
      if (beerArgs) {
        result.push(new Beer(beerArgs));
      }
    });
    this.beers = result;
    return this.beers;
  }
}
