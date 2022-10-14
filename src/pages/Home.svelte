<script lang="ts">
  import { inventoryStore, userStore } from "../stores";
  import ProductList from "../lib/ProductList.svelte";
  import Fa from "svelte-fa";
  import {
    faClose,
    faDollarSign,
    faShoppingCart,
    faTrashAlt,
  } from "@fortawesome/free-solid-svg-icons";
  import Modal from "../components/Modal.svelte";
  import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
  import { beerConverter, db } from "../Firebase";
  import Cart from "../components/Cart.svelte";

  export let currentRoute;
  export let params;

  let user;
  let inventory;
  let isOpen = true;

  userStore.subscribe((v) => {
    user = v;
  });

  inventoryStore.subscribe((v) => {
    inventory = v;
  });

  const confirmPurchase = () => {
    let result = {};

    user.basket.items.forEach((beer) => {
      if (result[beer.uid]) {
        result[beer.uid].total += beer.salesPrice();
        result[beer.uid].amount += 1;
      } else {
        result[beer.uid] = {
          total: beer.salesPrice(),
          amount: 1,
          date: new Date(),
          isPayed: false,
          uid: beer.uid,
          name: beer.name,
          price: beer.salesPrice(),
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
    inventoryStore.set(inventory);
    userStore.set(user);

    console.debug(user.basket);
  };

  const resetCart = () => {
    user.basket.clear();
    userStore.set(user);
  };

  const viewCart = () => {
    isOpen = true;
  };

  $: total = user.basket
    .getItems()
    .reduce((acc, item) => acc + item.salesPrice(), 0);
</script>

<div class="hidden {params.class}">{currentRoute}</div>

<div
  class="w-1/3 pb-2 flex items-center text-xl sm:2xl space-x-1 font-bold justify-center"
>
  <div>Total</div>
  <div>{total}</div>
  <div>kr.</div>
</div>
<div
  class="flex w-full sm:w-2/3 pb-1 px-2 text-xs md:text-sm lg:text-xl text-white items-center justify-center space-x-3"
>
  <button
    class="flex w-full sm:w-1/2 justify-center items-center space-x-2 bg-gradient-to-b from-green-800 to-green-600 px-4 py-2 rounded-xl"
    on:click={() => viewCart()}
  >
    <Fa icon={faShoppingCart} />
    <div>Kurv</div>
  </button>
  <button
    class="flex w-full sm:w-1/2 justify-center items-center space-x-2 bg-gradient-to-b from-red-800 to-red-600 px-4 py-2 rounded-xl"
    on:click={() => resetCart()}
  >
    <Fa icon={faTrashAlt} />
    <div>Ryd Alt</div>
  </button>

  <button
    class="flex w-full sm:w-1/2 justify-center items-center space-x-2 bg-gradient-to-b from-green-800 to-green-600 px-4 py-2 rounded-xl"
    on:click={() => confirmPurchase()}
  >
    <Fa icon={faDollarSign} />
    <div>Køb</div>
  </button>
</div>

<ProductList />

<Cart bind:isOpen />
