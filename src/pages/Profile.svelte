<script lang="ts">
  import { userStore } from "../stores";
  import Fa from "svelte-fa";
  import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
  import { doc, onSnapshot } from "firebase/firestore";
  import { db, User } from "../Firebase";
  import type { UserData, BeerHistory } from "../types";

  export let currentRoute;
  export let params;
  let user;
  let chartData;

  userStore.subscribe((v) => {
    user = v;
  });

  onSnapshot(doc(db, "users", user.uid), (doc) => {
    userStore.set(new User(doc.data() as UserData));
    chartData = user.beerHistory.reduce((result, item: BeerHistory) => {
      const arr = result.find(
        (i) =>
          i.group === item.name &&
          i.dateObj.toDate().toDateString() ===
            item.date.toDate().toDateString()
      );
      if (arr) {
        arr.value += item.total;
      } else {
        if (item.date) {
          const d = item.date.toDate();
          d.setHours(0, 0, 0, 0);
          result.push({
            group: item.isPayed ? `${item.name}` : `${item.name}`,
            dateObj: item.date,
            date: d.toISOString(),
            value: item.total,
          });
        }
      }
      return result;
    }, []);
  });

  $: owsMoney = user.beerHistory.reduce(
    (p, c) => (c.isPayed ? p : p + c.total),
    0
  );
  $: owsCount = user.beerHistory
    .filter((c) => !c.isPayed)
    .reduce((p, c) => p + c.amount, 0);

  $: totalOrderCount = user.beerHistory.length;
  $: totalBeerCount = user.beerHistory.reduce((p, c) => p + c.amount, 0);

  $: totalCost = user.beerHistory.reduce((p, c) => p + c.total, 0);
  $: averageOrderCost =
    totalCost > 0 ? Math.round(totalCost / totalOrderCount) : 0;

  $: totalBeerPrice = user.beerHistory.reduce((p, c) => p + c.price, 0);
  $: averageBeerPrice =
    totalBeerPrice > 0
      ? Math.round(
          ((totalBeerPrice + Number.EPSILON) / totalOrderCount) * 100 // Number.EPSILON is used to correct for floating point math errors
        ) / 100
      : 0;
</script>

<div class="flex flex-col items-center justify-end p-4">
  <div class="hidden {params.class}">{currentRoute}</div>

  <div class="rounded-lg overflow-hidden ">
    <div
      class="flex font-['Silkscreen'] items-center font-bold w-full justify-between bg-gradient-to-br from-green-800 to-green-600 text-white py-2 px-4"
    >
      <Fa icon={faUserAlt} />
      {user.displayName}
    </div>
    <div class="w-full text-sm bg-gray-500 px-4 py-2 text-white">
      {#if owsMoney > 0}
        <div class="text-lg font-bold">
          Du skylder {owsMoney} kr. for {owsCount} øl.
        </div>
      {/if}
      <div class="text-md font-bold">
        Du har i alt brugt {totalCost} kr. på {totalBeerCount} øl fordelt over
        {totalOrderCount} køb. Altså har du i gennemsnit betalt
        {averageOrderCost} kr. pr. køb og {averageBeerPrice} kr. pr. øl.
      </div>
    </div>
  </div>
</div>
