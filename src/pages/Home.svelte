<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faArrowDown,
    faArrowUp,
    faMinus,
    faPlus,
    faShoppingCart,
    faTrashAlt,
  } from "@fortawesome/free-solid-svg-icons";
  import { Beer, beerConverter, db, User } from "../Firebase";
  import { userStore } from "../stores";
  import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
  } from "firebase/firestore";
  import Cart from "../components/Cart.svelte";
  import BeerMan from "../lib/BeerMan.svelte";

  export let currentRoute;
  export let params;
  let isCartOpen = false;
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

  const confirmPurchase = () => {
    let result = {};

    user.basket.items.forEach((beer) => {
      if (result[beer.uid]) {
        result[beer.uid].total += beer.salesPrice;
        result[beer.uid].amount += 1;
      } else {
        result[beer.uid] = {
          total: beer.salesPrice,
          amount: 1,
          date: new Date(),
          isPayed: false,
          uid: beer.uid,
          name: beer.name,
          price: beer.salesPrice,
        };
      }
      user.basket.clear();
    });

    Object.keys(result).forEach(async (beerUid) => {
      const beerSnap = await getDoc(
        doc(db, "inventory", beerUid).withConverter(beerConverter)
      );
      const beer = beerSnap.data();

      await updateDoc(doc(db, "inventory", beer.uid), {
        nLeft: beer.nLeft - result[beerUid].amount,
        isActive: beer.nLeft - result[beerUid].amount > 0,
      });

      await updateDoc(doc(db, "users", user.uid), {
        beerHistory: arrayUnion(result[beerUid]),
      });
    });
    userStore.set(user);

    console.debug(user.basket);
  };

  const resetCart = async () => {
    user.basket.clear();
    userStore.set(user);
  };

  const toggleCart = () => {
    isCartOpen = true;
  };

  $: cart = user.basket.getItems();
  $: beersInStock = inventory
    ? inventory.filter((beer) => beer.isActive && beer.nLeft > 0)
    : [];
</script>

<div class="flex flex-col justify-center items-center w-full lg:w-2/3 px-4">
  <div class="hidden {params.class}">{currentRoute}</div>
  <div class="flex flex-col-reverse flex-grow w-full">
    {#each beersInStock as beer}
      <div class="rounded-lg overflow-hidden mt-4">
        <div
          class="flex items-center font-['Silkscreen'] w-full justify-between bg-gradient-to-br from-green-800 to-green-600 text-white py-2 px-4"
        >
          <div>{beer.name}</div>
          <div>{beer.salesPrice} Kr.</div>
        </div>
        <div class="flex w-full space-x-1 py-2 bg-gray-500 justify-center">
          <button
            on:click={() => removeBeerFromBasket(beer)}
            class="p-2 bg-gradient-to-b from-red-800 to-red-500 rounded-full text-white"
          >
            <Fa icon={faMinus} />
          </button>
          <div
            class="flex w-1/5 justify-center items-center px-3 text-xl text-white font-bold font-['Silkscreen']"
          >
            {cart.filter((el) => el.name === beer.name).length}
          </div>
          <button
            disabled={cart.filter((el) => el.name === beer.name).length >=
              beer.nLeft}
            on:click={() => addBeerToBasket(beer)}
            class="p-2 rounded-full text-white {cart.filter(
              (el) => el.name === beer.name
            ).length >= beer.nLeft
              ? 'bg-gray-500'
              : 'bg-gradient-to-t from-green-800 to-green-500'}"
          >
            <Fa icon={faPlus} />
          </button>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex w-full py-4 text-white text-sm space-x-4">
    <button
      class="flex w-full rounded-lg font-['Silkscreen'] justify-center items-center space-x-2 bg-gradient-to-b from-red-800 to-red-600 px-4 py-2"
      on:click={() => resetCart()}
    >
      <Fa icon={faTrashAlt} />
      <div>Nulstil</div>
    </button>
    <button
      class="flex w-full rounded-lg font-['Silkscreen'] justify-center items-center space-x-2 bg-gradient-to-t from-green-800 to-green-600 px-4 py-2"
      on:click={() => toggleCart()}
    >
      <Fa icon={faShoppingCart} />
      <div>Køb</div>
    </button>
  </div>
</div>

<Cart bind:isOpen={isCartOpen} />
