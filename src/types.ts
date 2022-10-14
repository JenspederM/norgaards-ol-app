import type { Timestamp } from "firebase/firestore";

export type UserData = {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  beerHistory: BeerHistory[];
};

export type BeerInStock = {
  uid: string;
  name: string;
  price: number;
  nBeers: number;
  profitMargin: number;
  nLeft: number;
  purchaseDate: Date;
  isActive: boolean;
};

export type BeerHistory = {
  name: string;
  date: Timestamp;
  amount: number;
  price: number;
  total: number;
  isPayed: boolean;
  uid: boolean;
};
