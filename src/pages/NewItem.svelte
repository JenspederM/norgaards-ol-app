<script lang="ts">
    import Fa from "svelte-fa";
    import {
        faBeer,
        faClose,
        faTrash,
    } from "@fortawesome/free-solid-svg-icons";
    import { userStore } from "../stores";
    import { doc, setDoc } from "firebase/firestore";
    import { Beer, beerConverter, db } from "../Firebase";
    import Input from "../lib/Input.svelte";

    let user;
    let name: string;
    let profit: number;
    let price: number;
    let amount: number;

    userStore.subscribe((v) => {
        user = v;
    });

    const reset = () => {
        name = undefined;
        profit = undefined;
        price = undefined;
        amount = undefined;
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
        reset();
    };
</script>

<div class="flex font-['Silkscreen'] flex-grow p-4">
    <div
        class="flex flex-col rounded-lg overflow-hidden justify-center font-bold bg-gray-500 text-white"
    >
        <div
            class="flex items-center w-full justify-between bg-gradient-to-br from-green-800 to-green-600 py-2 px-8"
        >
            Ny Øl
        </div>
        <div class="flex w-full flex-grow text-sm px-8 py-4 text-white">
            <div class="flex flex-col flex-grow space-y-4">
                <Input
                    label="Ølmærke"
                    type="text"
                    placeholder="Tuborg"
                    bind:value={name}
                />
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
        </div>
        <div class="pt-2 bg-gradient-to-br from-green-800 to-green-600" />
        <div
            class="flex items-center justify-center text-white text-xs px-8 py-2"
        >
            <div class="flex w-2/3 sm:w-1/3 items-center justify-start">
                <button
                    class="flex space-x-2 items-center py-2 px-4 rounded-xl bg-gradient-to-b from-red-800 to-red-500 "
                    on:click={() => reset()}
                >
                    <div>Nulstil</div>
                    <Fa icon={faTrash} />
                </button>
            </div>
            <div class="flex w-1/3 items-center justify-end">
                <button
                    class="flex space-x-2 items-center py-2 px-4 rounded-xl bg-gradient-to-b from-green-800 to-green-500"
                    on:click={() => NewInventoryItem()}
                >
                    <div>Opret</div>
                    <Fa icon={faBeer} />
                </button>
            </div>
        </div>
    </div>
</div>
