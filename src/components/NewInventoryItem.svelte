<script lang="ts">
  import Modal from "./Modal.svelte";
  import Fa from "svelte-fa";
  import { faBeer, faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
  import { userStore } from "../stores";
  import { doc, setDoc } from "firebase/firestore";
  import { Beer, beerConverter, db } from "../Firebase";
  import Input from "./Input.svelte";

  export let isOpen = false;

  let user;
  let name: string;
  let profit: number;
  let price: number;
  let amount: number;

  userStore.subscribe((v) => {
    user = v;
  });

  const toggleModal = () => {
    isOpen = !isOpen;
  };

  const guid = () => {
    const CHARS =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let autoId = "";

    for (let i = 0; i < 20; i++) {
      autoId += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return autoId;
  };

  const NewInventoryItem = () => {
    const uid = guid();
    const beer = new Beer({
      uid: uid,
      name: name,
      profitMargin: profit,
      price: price,
      nBeers: amount,
      nLeft: amount,
      purchaseDate: new Date(),
      isActive: true,
    });
    console.log(`Create new ${beer}`);
    setDoc(doc(db, "inventory", uid).withConverter(beerConverter), beer);
    userStore.set(user);
    toggleModal();
  };
</script>

<Modal open={isOpen}>
  <div
    slot="header"
    class="flex items-center justify-between text-xl font-bold py-4 px-8 bg-gradient-to-b from-green-800 to-green-700 text-white border-b-2 border-green-900"
  >
    <div>Ny Øl</div>
    <button
      class="bg-gradient-to-b from-red-800 to-red-500 px-2 py-1 rounded-full"
      on:click={() => toggleModal()}
    >
      <Fa color="white" icon={faClose} />
    </button>
  </div>
  <div
    class="flex flex-col flex-grow px-8 py-4 bg-gradient-to-b from-green-700 to-green-600 overflow-auto"
  >
    <Input label="Ølmærke" type="text" placeholder="Tuborg" bind:value={name} />
    <Input
      label="Pris for en kasse"
      type="number"
      placeholder="130"
      bind:value={price}
    />
    <Input
      label="Antal øl i kassen"
      type="number"
      placeholder="24"
      bind:value={amount}
    />
    <Input
      label="Forventet spildprocent"
      type="number"
      placeholder="10"
      bind:value={profit}
    />
  </div>
  <div
    slot="footer"
    class="flex items-center justify-center px-8 py-4 bg-gradient-to-b from-green-600 to-green-500"
  >
    <div class="flex w-2/3 sm:w-1/3 items-center justify-start">
      <button
        class="flex space-x-2 items-center py-2 px-4 rounded-xl bg-gradient-to-b from-red-800 to-red-500 text-white outline-double"
        on:click={() => toggleModal()}
      >
        <div>Annuller</div>
        <Fa icon={faTrash} />
      </button>
    </div>
    <div class="flex w-1/3 items-center justify-end">
      <button
        class="flex space-x-2 items-center py-2 px-4 rounded-xl bg-gradient-to-b from-green-800 to-green-500 text-white outline-double"
        on:click={() => NewInventoryItem()}
      >
        <div>Opret</div>
        <Fa icon={faBeer} />
      </button>
    </div>
  </div>
</Modal>
