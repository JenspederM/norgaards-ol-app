<script lang="ts">
  import FlyingBeer from "../assets/FlyingBeer-3.svg";
  import { Route } from "svelte-router-spa";
  import Navbar from "../lib/Navbar.svelte";
  import { isLoading } from "../stores";

  export let currentRoute;
  export let params;

  params = {
    class: "",
  };
</script>

<div class="flex flex-col items-center justify-center absolute inset-0">
  <div
    class="flex flex-col sm:flex-row w-full sm:w-2/3 items-center justify-between  p-2 space-y-2"
  >
    <div
      class="flex font-['Silkscreen'] text-center text-green-600 text-2xl sm:text-3xl lg:text-4xl xl:text-4xl 2xl:text-6xl"
    >
      Nørgaards Øl
    </div>
    <div class="flex w-2/3 sm:w-1/3 justify-center items-center sm:justify-end">
      <img class="h-10" src={FlyingBeer} alt="flyingbeer" />
    </div>
  </div>
  <div class="w-full sm:w-2/3 h-1 bg-green-600" />
  <div class="flex flex-grow overflow-auto w-full sm:w-2/3 justify-center">
    <Route {currentRoute} {params} />
  </div>
  <div class="w-full sm:w-2/3 h-1 bg-green-600" />
  <div class="flex w-full sm:w-2/3 mb-8 lg:mb-0">
    <Navbar />
  </div>
</div>
