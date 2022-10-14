<script lang="ts">
  import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
  import { Beer, db, beerConverter } from "../Firebase";
  import Fa from "svelte-fa";
  import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

  export let currentRoute;
  export let params;

  let inventory: Beer[];

  onSnapshot(
    collection(db, "inventory").withConverter(beerConverter),
    (snapshot) => {
      const beers: Beer[] = [];
      snapshot.forEach((doc) => {
        beers.push(doc.data());
      });
      inventory = beers;
    }
  );

  const toggleActive = (beer: Beer) => {
    updateDoc(doc(db, "inventory", beer.uid), {
      isActive: !beer.isActive,
    });
  };

  $: orderedInventory = !inventory
    ? []
    : inventory.sort((a, b) => {
        return b.purchaseDate.getTime() - a.purchaseDate.getTime();
      });
</script>

<div class="hidden {params.class}">{currentRoute}</div>

{#if inventory}
  <div class="w-full overflow-auto space-y-2 py-2 px-2">
    {#each orderedInventory as beer}
      <div
        class="flex flex-col items-center px-4 py-2 bg-white border-2 space-y-2 rounded-xl"
      >
        <div class="flex flex-col w-full sm:flex-row sm:text-center">
          <div class="flex sm:flex-col justify-between w-full">
            <div class="font-bold">Ølmærke</div>
            <div>{beer.name}</div>
          </div>
          <div class="flex sm:flex-col justify-between w-full">
            <div class="font-bold">Købsdato</div>
            <div>{beer.purchaseDate.toDateString()}</div>
          </div>
          <div class="flex sm:flex-col justify-between w-full">
            <div class="font-bold">Øl Tilbage</div>
            <div>{beer.nLeft}</div>
          </div>
          <div class="flex sm:flex-col justify-between w-full">
            <div class="font-bold">Øl ved Køb</div>
            <div>{beer.nBeers}</div>
          </div>
        </div>
        <button
          class="flex items-center justify-center space-x-2 text-white rounded-xl px-4 py-1 w-1/2 {beer.isActive
            ? 'bg-gradient-to-b from-red-800 to-red-600'
            : 'bg-gradient-to-b from-green-800 to-green-600'}"
          on:click={() => toggleActive(beer)}
        >
          <div>{beer.isActive ? "Deaktiver" : "Aktiver"}</div>
          <div><Fa icon={beer.isActive ? faPowerOff : faPowerOff} /></div>
        </button>
      </div>
    {/each}
  </div>
{/if}
