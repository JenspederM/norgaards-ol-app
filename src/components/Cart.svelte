<script lang="ts">
  import { faBeer, faClose } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import type { User } from "../Firebase";
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
    user.basket.buy(user);
    userStore.set(user);
    console.debug(user.basket);
  };

  $: cart = user.basket.getItems();
  $: total = cart.reduce((acc, item) => acc + item.salesPrice(), 0);
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
    class="flex flex-col flex-grow px-8 py-4 space-y-4 bg-gradient-to-b from-green-700 to-green-600"
  >
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
            <div>{beer.salesPrice()}</div>
          </div>
          <div class="flex sm:flex-col justify-between w-full">
            <div class="font-bold">Total</div>
            <div>
              {cart.filter((el) => el.name == beer.name).length *
                beer.salesPrice()}
            </div>
          </div>
        </div>
        <div class="flex w-full space-x-2">
          <button
            on:click={() => removeBeers(beer)}
            class="flex flex-row space-x-2 px-4 py-2 rounded-xl items-center justify-center bg-gradient-to-b from-red-800 to-red-600 w-full text-white"
          >
            <div>
              <Fa icon={faBeer} />
            </div>
            <div>Slet</div>
          </button>
        </div>
      </div>
    {/each}
  </div>
  <div slot="footer">
    <div
      class="flex flex-row border-y-4 font-bold text-3xl bg-white w-full justify-end"
    >
      <div class="">
        {total} kr.
      </div>
    </div>
    <div class="flex flex-row  w-full space-x-2">
      <button
        class="bg-gradient-to-t text-white from-green-500 to-green-600 px-4 py-2  w-full text-2xl"
        on:click={() => confirmPurchase()}
      >
        Køb!
      </button>
    </div>
  </div>
</Modal>
