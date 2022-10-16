<script lang="ts">
  import { Navigate } from "svelte-router-spa";
</script>

<div class="flex flex-col h-screen items-center justify-center space-y-10">
  <div>You are unauthorized to view this page.</div>
  <button
    class="font-bold font-mono px-4 py-2 bg-red-500 text-white rounded-full"
  >
    <Navigate to="/">Return to home</Navigate>
  </button>
</div>
