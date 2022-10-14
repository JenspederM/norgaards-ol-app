<script lang="ts">
  import { inventoryStore } from "../stores";
  import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
  import { Beer, db, beerConverter } from "../Firebase";
  import type { BeerInStock } from "../types";
  import Fa from "svelte-fa";
  import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

  export let currentRoute;
  export let params;

  let stock;
  let inventory;

  inventoryStore.subscribe((v) => {
    inventory = v;
  });

  onSnapshot(
    collection(db, "inventory").withConverter(beerConverter),
    (snapshot) => {
      const beers: Beer[] = [];
      snapshot.forEach((doc) => {
        beers.push(doc.data());
      });
      stock = beers;
    }
  );

  const toggleActive = (beer: BeerInStock) => {
    updateDoc(doc(db, "inventory", beer.uid), {
      isActive: !beer.isActive,
    });
    inventory.getInventory();
    inventoryStore.set(inventory);
  };
</script>

<div class="hidden {params.class}">{currentRoute}</div>

<div class="w-full sm:w-4/5 sm:font-bold">
  <div
    class="flex px-2 justify-center items-center border-b-2 border-green-600 space-y-2"
  >
    <div
      class="flex w-2/6 items-center text-sm sm:text-md lg:text-xl justify-start"
    >
      Navn
    </div>
    <div
      class="flex w-1/6 items-center text-sm sm:text-md lg:text-xl justify-start"
    >
      Købsdato
    </div>
    <div
      class="flex w-1/6 items-center text-sm sm:text-md lg:text-xl justify-center"
    >
      Antal Tilbage
    </div>
    <div
      class="flex w-1/6 items-center text-sm sm:text-md lg:text-xl justify-center"
    >
      Antal v. Køb
    </div>
    <div class="flex w-1/6 items-center justify-center px-2 py-2" />
  </div>
</div>
{#if stock}
  <div class="w-full sm:w-4/5 overflow-auto">
    {#each stock as beer}
      <div class="flex border-b-2 border-green-600 space-y-2">
        <div
          class="flex w-2/6 items-center text-sm sm:text-md lg:text-xl justify-start"
        >
          {beer.name}
        </div>
        <div
          class="flex w-1/6 items-center text-sm sm:text-md lg:text-xl justify-start"
        >
          {beer.purchaseDate.toDateString()}
        </div>
        <div
          class="flex w-1/6 items-center text-sm sm:text-md lg:text-xl justify-center"
        >
          {beer.nLeft}
        </div>
        <div
          class="flex w-1/6 items-center text-sm sm:text-md lg:text-xl justify-center"
        >
          {beer.nBeers}
        </div>

        <div class="flex items-center justify-center px-2 py-2">
          <button
            class="px-2 py-1 rounded-lg font-bold text-xs sm:text-md text-white lg:text-xl  {beer.isActive
              ? 'bg-gradient-to-b from-green-800 to-green-600'
              : 'bg-gradient-to-b from-red-800 to-red-600'}"
            on:click={() => toggleActive(beer)}
          >
            <Fa icon={beer.isActive ? faToggleOn : faToggleOff} />
          </button>
        </div>
      </div>
    {/each}
  </div>
{/if}
