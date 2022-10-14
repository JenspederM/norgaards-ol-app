<script lang="ts">
  import Modal from "./Modal.svelte";
  import Fa from "svelte-fa";
  import { faBeer, faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
  import { inventoryStore, userStore } from "../stores";
  import { doc, setDoc } from "firebase/firestore";
  import { Beer, beerConverter, db } from "../Firebase";

  export let isOpen = false;
  let user;
  let inventory;
  let name: string;
  let profit: number;
  let price: number;
  let amount: number;

  userStore.subscribe((v) => {
    user = v;
  });

  inventoryStore.subscribe((v) => {
    inventory = v;
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
  <div slot="header" class="flex flex-row justify-between w-full">
    <div>Opret ny øl</div>
    <div>
      <button on:click={() => toggleModal()}>
        <Fa color="red" icon={faClose} />
      </button>
    </div>
  </div>
  <div slot="body" class="flex flex-col flex-grow px-8 py-4">
    <div>
      <div class="font-bold text-xl pb-2">Hvilket mærke øl har du købt?</div>
      <input
        class="border-2 border-black rounded-md p-1 w-2/3"
        type="text"
        name="name"
        id="beer-name"
        bind:value={name}
        placeholder="for eksempel 'Tuborg'"
      />
    </div>
    <div>
      <div class="font-bold text-xl">Hvad kostede kassen?</div>
      <div class="flex items-center justify-start space-x-2">
        <input
          class="border-2 border-black rounded-md p-1 w-2/3"
          type="number"
          name="price"
          id="beer-price"
          bind:value={price}
          placeholder="100"
        />
        <div class="font-bold text-xl">kroner</div>
      </div>
    </div>
    <div>
      <div class="font-bold text-xl">Hvor mange øl var der i kassen?</div>
      <div class="flex items-center justify-start space-x-2">
        <input
          class="border-2 border-black rounded-md p-1 w-2/3"
          type="number"
          name="amount"
          id="beer-amount"
          bind:value={amount}
          placeholder="24"
        />
        <div class="font-bold text-xl">øl</div>
      </div>
    </div>
    <div>
      <div class="font-bold text-xl">
        Hvor stor en spildprocent forventer du?
      </div>
      <div class="flex items-center justify-start space-x-2">
        <input
          class="border-2 border-black rounded-md p-1 w-2/3"
          type="number"
          name="price"
          id="beer-profit"
          bind:value={profit}
          placeholder="20"
        />
        <div class="font-bold text-xl">%</div>
      </div>
    </div>
  </div>
  <div slot="footer" class="flex flex-row justify-between rounded-b-2xl">
    <button
      class="flex flex-row text-white space-x-2 items-center bg-red-600 py-2 px-4 rounded-xl"
      on:click={() => toggleModal()}
    >
      <div class="font-bold text-xl">Annuller</div>
      <Fa icon={faTrash} />
    </button>
    <button
      class="flex flex-row text-white space-x-2 items-center bg-green-600 py-2 px-4 rounded-xl"
      on:click={() => NewInventoryItem()}
    >
      <div class="font-bold text-xl">Opret</div>
      <Fa icon={faBeer} />
    </button>
  </div>
</Modal>
