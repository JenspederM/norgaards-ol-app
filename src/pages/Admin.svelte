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

<div class="flex w-full sm:w-2/3 border-b-4 py-1 px-2 border-green-600">
  <div class="flex flex-row w-3/4">
    <div class="flex flex-grow items-center text-sm sm:text-lg lg:text-2xl">
      <div class="flex font-bold w-3/5">Navn</div>
      <div class="flex font-bold w-2/5 justify-center">Skylder</div>
    </div>
  </div>
  <div class="flex flex-col w-1/4 items-center" />
</div>
<div class="flex flex-col w-full sm:w-2/3 flex-grow overflow-auto">
  {#each users.sort((a, b) => b.getAmountOwed() - a.getAmountOwed()) as currentUser}
    <div
      class="flex items-center w-full px-2 py-2 border-b-2 border-green-600 text-md sm:text-xl lg:text-2xl"
    >
      <div class="flex items-center w-3/4">
        <div class="flex items-center w-3/5 overflow-auto">
          {currentUser.displayName}
        </div>
        <div class="flex justify-center w-2/5 space-x-1">
          <div>{currentUser.getAmountOwed()}</div>
          <div>kr.</div>
        </div>
      </div>
      <div class="flex space-x-3 w-1/4 justify-center">
        <button
          disabled={currentUser.getAmountOwed() === 0}
          on:click={() => resetUser(currentUser)}
          class="flex sm:w-1/2 justify-center items-center space-x-2 p-3 rounded-full text-md md:text-lg text-white {currentUser.getAmountOwed() ===
          0
            ? 'bg-gray-500'
            : 'bg-gradient-to-b from-red-800 to-red-600'}"
        >
          <Fa icon={faRefresh} />
        </button>
      </div>
    </div>
  {/each}
</div>
<NewInventoryItem bind:isOpen={isCreateNewBeerOpen} />
