<script lang="ts">
  import Fa from "svelte-fa";
  export let icon;
  export let gradient = "green";
  export let textColor = "white";
  export let size = "2";
  export let textSize = "xl";
</script>

<button
  class={`bg-gradient-to-b from-${gradient.trim()}-700 to-${gradient}-600 p-${size} rounded-full text-${textColor} text-${textSize}`}
>
  <Fa {icon} />
</button>
