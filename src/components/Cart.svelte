<script lang="ts">
  import { faBeer } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import type { User } from "../Firebase";
  import { userStore } from "../stores";

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

<div class="flex flex-col w-full overflow-auto">
  {#each uniqueItems as beer}
    <div class="flex flex-col">
      <div>
        <div
          class="flex flex-col bg-gradient-to-t from-green-500 to-green-600 w-full text-white font-bold text-xl py-2 px-4"
        >
          {beer.name}
        </div>
      </div>
      <div class="flex flex-row bg-white px-4 py-2">
        <div class="flex-col w-1/2">
          <div class="flex flex-row space-x-2">
            <div class="font-bold text-lg">Antal:</div>
            <div class="text-lg">
              {cart.filter((el) => el.name == beer.name).length}
            </div>
          </div>

          <div class="flex flex-row space-x-2">
            <div class="font-bold text-lg">Pris:</div>
            <div class="text-lg">
              {beer.salesPrice()} kr.
            </div>
          </div>
        </div>
        <div class="flex flex-col w-1/2">
          <div class="flex flex-row space-x-2">
            <div class="font-bold text-lg">Total:</div>
            <div class="text-lg">
              {cart.filter((el) => el.name == beer.name).length *
                beer.salesPrice()}
            </div>
            <div class="text-lg">kr.</div>
          </div>
          <div>
            <button
              on:click={() => removeBeers(beer)}
              class="flex flex-row space-x-2 items-center justify-center bg-gradient-to-b from-red-500 to-red-700 w-full text-white"
            >
              <div>
                <Fa icon={faBeer} />
              </div>
              <div>Slet</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
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
