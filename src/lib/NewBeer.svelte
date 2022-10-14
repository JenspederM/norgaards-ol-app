<script lang="ts">
  import { userStore } from "../stores";
  import { onMount } from "svelte";
  import { Line } from "svelte-chartjs";
  import { Chart } from "chart.js";

  let user;

  userStore.subscribe((v) => {
    user = v;
  });
</script>
