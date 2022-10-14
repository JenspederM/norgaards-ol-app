<script lang="ts">
  import { Navigate } from "svelte-router-spa";
  import Fa from "svelte-fa";
  import { faUser, faBeer, faWrench } from "@fortawesome/free-solid-svg-icons";
  import { userStore } from "../stores";

  let user;

  userStore.subscribe((v) => {
    user = v;
  });

  const buttonStyle =
    "text-sm p-3 sm:text-lg sm:p-4 bg-gradient-to-b from-green-800 to-green-500 rounded-full text-white";
</script>

<!-- A navigation bar that is the width as the screen -->
<div
  class="flex flex-row space-x-4 text-xl pb-8 lg:pb-2 pt-2 w-full items-center justify-center border-t-4 border-green-600"
>
  <Navigate to="/profile">
    <button class={buttonStyle}>
      <Fa icon={faUser} />
    </button>
  </Navigate>
  <Navigate to="/">
    <button class={buttonStyle}>
      <Fa icon={faBeer} />
    </button>
  </Navigate>
  {#if user.isAdmin}
    <Navigate to="/admin">
      <button class={buttonStyle}>
        <Fa icon={faWrench} />
      </button>
    </Navigate>
  {/if}
</div>
