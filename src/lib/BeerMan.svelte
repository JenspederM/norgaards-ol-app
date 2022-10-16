<script lang="ts">
  import Beer from "../assets/Beer.svg";
  import FlyingBeer from "../assets/FlyingBeer-3.svg";
  import { fly } from "svelte/transition";

  export let cart = [];
</script>

<div class="flex py-4">
  <div class="flex flex-row-reverse items-center flex-wrap">
    {#each cart as _}
      <img
        transition:fly={{ x: 30, duration: 500 }}
        class="h-10"
        src={Beer}
        alt="beer"
      />
    {/each}
  </div>
  <div class="w-full">
    <img class="min-h-20" src={FlyingBeer} alt="flyingbeer" />
  </div>
</div>
