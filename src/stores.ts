import type { Inventory, User } from "./Firebase";
import { Writable, writable } from "svelte/store";

export const userStore: Writable<User> = writable();
export const inventoryStore: Writable<Inventory> = writable();
export const isLoading = writable(false);
export const navigator = writable("/");
