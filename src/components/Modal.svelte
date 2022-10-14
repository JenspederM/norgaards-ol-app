<script lang="ts">
  import { onDestroy } from "svelte";
  import { compute_slots } from "svelte/internal";

  export let open = true;

  const toggle = () => {
    open = false;
  };

  onDestroy(() => {
    toggle();
  });
</script>

{#if open}
  <div
    class="modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center lg:p-0"
  >
    <div class="modal-overlay fixed w-full h-full bg-gray-900 opacity-50" />
    <div
      class="h-full w-full mx-auto md:h-1/2 md:w-2/3 lg:w-2/3 xl:w-2/3 shadow-xl z-50"
    >
      <div class="flex flex-col justify-between h-full ">
        <div
          class="flex flex-row justify-between items-center w-full px-8 py-4 bg-gray-200 text-4xl font-bold"
        >
          <slot name="header" />
        </div>
        <div
          class="flex flex-col w-full px-8 py-4 flex-grow overflow-auto bg-white"
        >
          <slot name="body" />
        </div>
        {#if $$slots.footer}
          <div class="flex flex-col w-full px-8 py-4 bg-gray-300">
            <slot name="footer" />
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
