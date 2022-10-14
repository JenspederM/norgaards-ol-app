<script lang="ts">
  import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
  import { db, User, userConverter } from "../Firebase";
  import NewInventoryItem from "../components/NewInventoryItem.svelte";
  import Fa from "svelte-fa";
  import {
    faBeer,
    faBinoculars,
    faBoxArchive,
    faPlusCircle,
    faRefresh,
  } from "@fortawesome/free-solid-svg-icons";
  import { Navigate } from "svelte-router-spa";
  import { isLoading } from "src/stores";

  export let currentRoute;
  export let params;

  let isCreateNewBeerOpen = false;
  let users: User[] = [];

  const toggleOpenCreateNewBeer = () => {
    isCreateNewBeerOpen = !isCreateNewBeerOpen;
  };

  const resetUser = (user) => {
    const newHistory = user.beerHistory.map((beer) => {
      beer.isPayed = true;
      return beer;
    });

    updateDoc(doc(db, "users", user.uid), {
      beerHistory: newHistory,
    });
  };

  onSnapshot(
    collection(db, "users").withConverter(userConverter),
    (docSnap) => {
      let result = [];
      docSnap.forEach((doc) => {
        result.push(doc.data());
      });
      users = result;
    }
  );

  $: users ? isLoading.set(true) : isLoading.set(false);
</script>

<div class="hidden {params.class}">{currentRoute}</div>

<div
  class="flex w-full sm:w-2/3 pb-1 px-2 text-xs md:text-sm lg:text-xl text-white items-center justify-center space-x-3"
>
  <Navigate
    styles="flex w-full sm:w-1/2 justify-center items-center bg-gradient-to-b from-green-800 to-green-600 px-4 py-2 rounded-xl"
    to="inventory"
  >
    <button class="flex space-x-2 items-center justify-center">
      <Fa icon={faBinoculars} />
      <span>Se Lager</span>
      <Fa icon={faBoxArchive} />
    </button>
  </Navigate>
  <button
    on:click={() => toggleOpenCreateNewBeer()}
    class="flex w-full sm:w-1/2 justify-center items-center space-x-2 bg-gradient-to-b from-green-800 to-green-600 px-4 py-2 rounded-xl"
  >
    <Fa icon={faPlusCircle} />
    <span>Ny Øl</span>
    <Fa icon={faBeer} />
  </button>
</div>

<div
  class="flex w-full text-xl font-bold sm:w-2/3 border-b-4 py-1 px-2 border-green-600 mb-1"
>
  Brugere
</div>
<div class="flex flex-col w-full sm:w-2/3 flex-grow overflow-auto px-2">
  {#each users.sort((a, b) => b.getAmountOwed() - a.getAmountOwed()) as currentUser}
    <div
      class="flex flex-col items-center px-4 py-2 bg-white border-2 space-y-2 rounded-xl"
    >
      <div class="flex flex-col w-full sm:flex-row sm:text-center">
        <div class="flex sm:flex-col sm:w-2/4 justify-between w-full">
          <div class="font-bold">Navn</div>
          <div>{currentUser.displayName}</div>
        </div>
        <div class="flex sm:flex-col sm:w-1/4 justify-between w-full">
          <div class="font-bold">Skylder</div>
          <div>{currentUser.getAmountOwed()} Kr.</div>
        </div>
        <div class="flex sm:flex-col sm:w-1/4 justify-center w-full">
          <button
            disabled={currentUser.getAmountOwed() === 0}
            on:click={() => resetUser(currentUser)}
            class="flex items-center justify-center space-x-2 text-white rounded-xl px-4 py-1 bg-gradient-to-b from-red-800 to-red-600"
          >
            <div>Nulstil</div>
            <Fa icon={faRefresh} />
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
<NewInventoryItem bind:isOpen={isCreateNewBeerOpen} />
