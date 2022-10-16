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

<div class="flex flex-col h-2/5">
  <div class="hidden {params.class}">{currentRoute}</div>

  {#if inventory}
    <div class="overflow-auto">
      <div class="space-y-4">
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
            <div class="flex w-full space-x-2">
              <button
                class="flex items-center justify-center space-x-2 text-white rounded-xl px-4 py-1 w-1/2 bg-gradient-to-b from-red-800 to-red-600"
                on:click={() => deleteBeer(beer)}
              >
                <div>Slet</div>
                <div><Fa icon={faTrash} /></div>
              </button>
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
          </div>
          <div />
        {/each}
      </div>
    </div>
  {/if}
</div>

<Modal bind:open={confirmOpen}>
  <div slot="body" class="flex flex-col items-center justify-center h-full">
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
