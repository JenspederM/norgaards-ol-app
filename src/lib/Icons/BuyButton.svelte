<script lang="ts">
  import { userStore } from "../../stores";
  import BuyButton from "../assets/BuyButton.svg";

  let user;

  userStore.subscribe((value) => {
    user = value;
  });
</script>

{#if user}
  <button>
    <img src={BuyButton} alt="Login button" />
  </button>
{/if}
