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
  import { isLoading } from "../stores";

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

<div class="flex flex-col flex-grow items-center w-full px-4">
  <div class="hidden {params.class}">{currentRoute}</div>

  <div
    class="flex flex-col-reverse flex-grow w-full overflow-auto space-y-2 py-2"
  >
    {#each users.sort((a, b) => b.getAmountOwed() - a.getAmountOwed()) as currentUser}
      <div
        class="flex flex-col justify-center items-center w-full rounded-xl overflow-hidden"
      >
        <div
          class="flex w-full items-center justify-between font-bold text-white py-2 px-4 bg-gradient-to-b {currentUser.getAmountOwed() >
          0
            ? 'from-red-800 to-red-600'
            : 'from-green-800 to-green-600'}"
        >
          <div>{currentUser.displayName}</div>
        </div>
        <div
          class="flex w-full items-center justify-between bg-gray-50 px-4 py-2"
        >
          <div class={currentUser.getAmountOwed() > 0 ? "font-bold" : ""}>
            Skylder: {currentUser.getAmountOwed()} Kr.
          </div>
          <div>
            <button
              disabled={currentUser.getAmountOwed() === 0}
              on:click={() => resetUser(currentUser)}
              class="flex w-full items-center space-x-2 justify-center text-white py-1 px-4 rounded-xl {currentUser.getAmountOwed() >
              0
                ? 'bg-gradient-to-b from-red-800 to-red-600'
                : 'bg-gray-400'}"
            >
              <div>Nulstil</div>
              <Fa icon={faRefresh} />
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="flex w-full py-2 text-white text-sm space-x-4">
    <div class="w-full">
      <Navigate
        styles="flex justify-center items-center bg-gradient-to-b from-green-800 to-green-600 rounded-xl"
        to="inventory"
      >
        <button
          class="flex w-full justify-center items-center space-x-2 bg-gradient-to-b from-green-800 to-green-600 px-4 py-2 rounded-xl"
        >
          <Fa icon={faBoxArchive} />
          <div>Se Lager</div>
        </button>
      </Navigate>
    </div>
    <div class="w-full">
      <button
        on:click={() => toggleOpenCreateNewBeer()}
        class="flex w-full justify-center items-center space-x-2 bg-gradient-to-b from-green-800 to-green-600 px-4 py-2 rounded-xl"
      >
        <Fa icon={faBeer} />
        <div>Ny Øl</div>
      </button>
    </div>
  </div>
</div>

<NewInventoryItem bind:isOpen={isCreateNewBeerOpen} />
