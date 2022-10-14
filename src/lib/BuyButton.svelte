<script lang="ts">
  import type { User } from "../Firebase";
  import { userStore } from "../stores";

  let user: User;

  userStore.subscribe((value) => {
    user = value;
  });

  function buyBeer() {
    user.basket.buy(user);
    userStore.set(user);
  }
</script>

<div
  on:click={() => buyBeer()}
  class="flex flex-row absolute bottom-0 md:relative md:bottom-auto w-full items-center justify-center py-4 px-8 bg-green-700 text-white font-bold text-4xl rounded-b-lg"
>
  Køb
</div>
