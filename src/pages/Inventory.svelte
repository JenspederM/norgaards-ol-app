<script lang="ts">
  import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc,
  } from "firebase/firestore";
  import { Beer, db, beerConverter } from "../Firebase";
  import Fa from "svelte-fa";
  import { faPowerOff, faTrash } from "@fortawesome/free-solid-svg-icons";
  import Modal from "../components/Modal.svelte";

  export let currentRoute;
  export let params;

  let inventory: Beer[];
  let confirmOpen = false;
  let confirmed = 0;
  let beerToDelete: Beer;

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

  const deleteBeer = (beer?: Beer) => {
    confirmOpen = true;
    if (confirmed == 1) {
      console.log(`Deleting... ${beerToDelete.uid}`);
      deleteDoc(doc(db, "inventory", beerToDelete.uid));
      beerToDelete = undefined;
      confirmOpen = false;
      confirmed = 0;
    } else {
      if (beer) {
        beerToDelete = beer;
        confirmed++;
      } else {
        confirmed = 0;
      }
      console.log(beerToDelete);
    }
  };

  $: orderedInventory = !inventory
    ? []
    : inventory.sort((a, b) => {
        return b.purchaseDate.getTime() - a.purchaseDate.getTime();
      });
</script>

<div class="flex flex-col w-full p-4">
  <div class="hidden {params.class}">{currentRoute}</div>

  <div class="space-y-4">
    {#each orderedInventory as beer}
      <div
        class="flex flex-col w-full items-center space-y-2 sm:space-y-0 rounded-lg sm:text-center bg-gray-500 text-white font-bold overflow-hidden"
      >
        <div
          class="w-full py-2 px-8 bg-gradient-to-br from-green-800 to-green-600 sm:hidden"
        >
          {beer.name}
        </div>
        <div
          class="flex sm:flex-col text-sm xs:text-lg items-center justify-center w-full space-x-2 sm:space-x-0"
        >
          <div
            class="flex py-2 px-8 flex-col sm:flex-row sm:w-full sm:bg-gradient-to-br from-green-800 to-green-600"
          >
            <div class="hidden sm:flex sm:w-1/4">Ølmærke</div>
            <div class="sm:w-1/4">Købsdato</div>
            <div class="sm:w-1/4">Øl Tilbage</div>
            <div class="sm:w-1/4">Øl ved Køb</div>
          </div>
          <div class="sm:hidden">
            <div class="hidden sm:flex">:</div>
            <div>:</div>
            <div>:</div>
            <div>:</div>
          </div>
          <div
            class="flex sm:py-2 sm:px-8 flex-col sm:flex-row sm:w-full font-normal"
          >
            <div class="hidden sm:flex sm:w-1/4">{beer.name}</div>
            <div class="sm:w-1/4">{beer.purchaseDate.toDateString()}</div>
            <div class="sm:w-1/4">{beer.nLeft}</div>
            <div class="sm:w-1/4">{beer.nBeers}</div>
          </div>
        </div>
        <div class="bg-gray-500 w-full py-2 px-4">
          <div class="flex w-full space-x-2">
            <button
              class="flex items-center justify-center space-x-2 rounded-xl px-4 py-1 w-1/2 bg-gradient-to-b from-red-800 to-red-600"
              on:click={() => deleteBeer(beer)}
            >
              <div>Slet</div>
              <div><Fa icon={faTrash} /></div>
            </button>
            <button
              class="flex items-center justify-center space-x-2 rounded-xl px-4 py-1 w-1/2 {beer.isActive
                ? 'bg-gradient-to-b from-red-800 to-red-600'
                : 'bg-gradient-to-b from-green-800 to-green-600'}"
              on:click={() => toggleActive(beer)}
            >
              <div>{beer.isActive ? "Deaktiver" : "Aktiver"}</div>
              <div><Fa icon={beer.isActive ? faPowerOff : faPowerOff} /></div>
            </button>
          </div>
        </div>
      </div>
      <div />
    {/each}
  </div>
</div>

<Modal bind:open={confirmOpen}>
  <div class="flex flex-col items-center justify-center h-full">
    <div class="flex flex-col items-center bg-white px-4 py-2 rounded-xl">
      <div>Bekræft sletning af</div>
      <div class="font-bold">
        {beerToDelete ? beerToDelete.name : ""}
      </div>
      <div class="flex flex-col flex-grow justify-end pt-2">
        <div class="flex flex-row space-x-2">
          <button
            class="text-white bg-gradient-to-b from-red-800 to-red-600 px-4 py-2 rounded-xl"
            on:click={() => {
              confirmed = 0;
              confirmOpen = false;
            }}
          >
            Fortryd
          </button>
          <button
            class="text-white bg-gradient-to-b from-green-800 to-green-600 px-4 py-2 rounded-xl"
            on:click={() => deleteBeer()}
          >
            Bekræft
          </button>
        </div>
      </div>
    </div>
  </div>
</Modal>
