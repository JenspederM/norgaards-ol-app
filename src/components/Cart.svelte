<script lang="ts">
  import {
    faClose,
    faShoppingCart,
    faTrash,
  } from "@fortawesome/free-solid-svg-icons";
  import { arrayUnion, doc, increment, updateDoc } from "firebase/firestore";
  import Fa from "svelte-fa";
  import { db, User } from "../Firebase";
  import { userStore } from "../stores";
  import Modal from "./Modal.svelte";

  export let isOpen;

  let user: User;

  userStore.subscribe((value) => {
    user = value;
  });

  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  const removeBeers = (beer) => {
    cart
      .filter((item) => item.uid === beer.uid)
      .forEach((item) => {
        user.basket.removeItem(item);
      });
    userStore.set(user);
    console.debug(user.basket);
  };

  const confirmPurchase = () => {
    const items = user.basket.getItems();

    let result = {};
    items.forEach((beer) => {
      if (result[beer.uid]) {
        result[beer.uid].total += beer.salesPrice;
        result[beer.uid].amount += 1;
      } else {
        result[beer.uid] = {
          total: beer.salesPrice,
          amount: 1,
          date: new Date(),
          isPayed: false,
          name: beer.uid,
          price: beer.salesPrice,
        };
      }
    });

    Object.keys(result).forEach(async (beerUid) => {
      await updateDoc(doc(db, "inventory", beerUid), {
        nLeft: increment(-result[beerUid].amount),
      });
      await updateDoc(doc(db, "users", user.uid), {
        beerHistory: arrayUnion(result[beerUid]),
      });
    });

    user.basket.clear();
    isOpen = false;
    userStore.set(user);

    console.debug(user.basket);
  };

  $: cart = user.basket.getItems();
  $: total = cart.reduce((acc, item) => acc + item.salesPrice, 0);
  $: uniqueItems = cart.filter(onlyUnique);
</script>

<Modal bind:open={isOpen}>
  <div
    slot="header"
    class="flex items-center justify-between text-xl font-bold py-4 px-8 bg-gradient-to-b from-green-800 to-green-700 text-white border-b-2 border-green-900"
  >
    <div>Kurv</div>
    <button
      class="bg-gradient-to-b from-red-800 to-red-500 px-2 py-1 rounded-full"
      on:click={() => (isOpen = false)}
    >
      <Fa color="white" icon={faClose} />
    </button>
  </div>
  <div
    slot="body"
    class="flex flex-col-reverse flex-grow overflow-auto px-8 py-4 space-y-4 bg-gradient-to-b from-green-700 to-green-600"
  >
    <div class="space-y-4">
      {#each uniqueItems as beer}
        <div
          class="flex flex-col items-center px-4 py-2 bg-white border-2 space-y-2 rounded-xl"
        >
          <div class="flex flex-col w-full sm:flex-row sm:text-center">
            <div class="flex sm:flex-col justify-between w-full">
              <div class="font-bold">Ølmærke</div>
              <div>{beer.name}</div>
            </div>
            <div class="flex sm:flex-col justify-between w-full">
              <div class="font-bold">Stk</div>
              <div>{cart.filter((item) => item.uid === beer.uid).length}</div>
            </div>
            <div class="flex sm:flex-col justify-between w-full">
              <div class="font-bold">Pris per stk.</div>
              <div>{beer.salesPrice}</div>
            </div>
            <div class="flex sm:flex-col justify-between w-full">
              <div class="font-bold">Total</div>
              <div>
                {cart.filter((el) => el.name == beer.name).length *
                  beer.salesPrice}
              </div>
            </div>
          </div>
          <div class="flex w-full space-x-2">
            <button
              on:click={() => removeBeers(beer)}
              class="flex flex-row space-x-2 px-4 py-2 rounded-xl items-center justify-center bg-gradient-to-b from-red-800 to-red-600 w-full text-white"
            >
              <div>
                <Fa icon={faTrash} />
              </div>
              <div>Slet</div>
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div
    slot="footer"
    class="flex flex-col bg-gradient-to-b from-green-600 to-green-500 px-4 pb-8 md:pb-0"
  >
    <div
      class="flex flex-row border-y-4 border-green-800 text-white font-bold text-3xl w-full justify-end"
    >
      <div class="">
        {total} kr.
      </div>
    </div>
    <div class="flex w-full py-2 text-white text-sm space-x-4">
      <button
        class="flex w-full justify-center items-center space-x-2 bg-gradient-to-b from-red-800 to-red-600 px-4 py-2 rounded-xl"
        on:click={() => (isOpen = false)}
      >
        <Fa icon={faClose} />
        <div>Tilbage</div>
      </button>
      <button
        class="flex w-full justify-center items-center space-x-2 bg-gradient-to-b from-green-800 to-green-600 px-4 py-2 rounded-xl"
        on:click={() => confirmPurchase()}
      >
        <Fa icon={faShoppingCart} />
        <div>Køb</div>
      </button>
    </div>
  </div>
</Modal>
