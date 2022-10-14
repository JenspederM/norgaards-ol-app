<script lang="ts">
  import Beer from "../assets/Beer.svg";
  import FlyingBeer from "../assets/FlyingBeer-3.svg";
  import { fly } from "svelte/transition";

  export let cart = [];
</script>

<div
  class="flex flex-row justify-center overflow-auto items-center w-full h-1/5"
>
  {#each cart as _}
    <img
      transition:fly={{ x: 50, duration: 500 }}
      class="w- pt-4"
      src={Beer}
      alt="beer"
    />
  {/each}
  <img class="w-5/12  md:w-2/12" src={FlyingBeer} alt="flyingbeer" />
</div>
