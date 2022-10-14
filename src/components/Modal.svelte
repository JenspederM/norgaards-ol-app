<script lang="ts">
  import { onDestroy } from "svelte";

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
    <div class="h-full w-full mx-auto md:h-1/2 md:w-2/3 lg:w-2/3 xl:w-2/3 z-50">
      <div
        class="flex flex-col justify-between h-full md:rounded-xl md:overflow-hidden"
      >
        <slot
          name="header"
          class="flex flex-row justify-between items-center w-full px-8 py-4 bg-gray-200 text-4xl font-bold"
        />
        <slot
          name="body"
          class="flex flex-col flex-grow w-full px-8 py-4 overflow-auto bg-white"
        />
        <slot
          class="flex flex-col w-full px-8 py-4 bg-gray-300"
          name="footer"
        />
      </div>
    </div>
  </div>
{/if}
