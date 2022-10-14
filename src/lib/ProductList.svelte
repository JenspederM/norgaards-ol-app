<script lang="ts">
  import Fa from "svelte-fa";
  import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
  import { Beer, beerConverter, db, User } from "../Firebase";
  import { isLoading, userStore } from "../stores";
  import { collection, onSnapshot } from "firebase/firestore";

  let inventory: Beer[];
  let user: User;

  userStore.subscribe((value) => {
    user = value;
  });

  function addBeerToBasket(beer) {
    user.basket.addItem(beer);
    userStore.set(user);
    console.debug(user.basket);
  }

  const removeBeerFromBasket = (beer) => {
    user.basket.removeItem(beer);
    userStore.set(user);
    console.debug(user.basket);
  };

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

  $: cart = user.basket.getItems();
  $: beersInStock = inventory ? inventory.filter((beer) => beer.isActive) : [];
  $: beersInStock.length === 0 ? isLoading.set(true) : isLoading.set(false);
</script>

<div
  class="flex text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-4xl flex-col w-full sm:w-2/3 flex-grow overflow-auto"
>
  {#each beersInStock as beer}
    <div class="flex items-center w-full px-2 py-2 border-b-2 border-green-600">
      <div class="flex items-center w-3/4">
        <div class="flex items-center w-3/5">
          {beer.name}
        </div>
        <div class="flex justify-end w-1/5 space-x-1 items-center">
          <div>{beer.salesPrice()}</div>
          <div>kr.</div>
        </div>
      </div>
      <div class="flex space-x-1 w-2/4 justify-center">
        <button
          on:click={() => removeBeerFromBasket(beer)}
          class="px-3 py-2 bg-gradient-to-b from-red-800 to-red-500 rounded-full text-white"
        >
          <Fa icon={faArrowDown} />
        </button>
        <div class="flex w-1/5 justify-center items-center px-3">
          {cart.filter((el) => el.name === beer.name).length}
        </div>
        <button
          on:click={() => addBeerToBasket(beer)}
          class="px-3 py-2 bg-gradient-to-b from-green-800 to-green-500 rounded-full text-white"
        >
          <Fa icon={faArrowUp} />
        </button>
      </div>
    </div>
  {/each}
</div>
