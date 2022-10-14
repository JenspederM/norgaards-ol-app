<script lang="ts">
  import { Navigate } from "svelte-router-spa";
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
  $: owsCount = user.beerHistory.filter((c) => !c.isPayed).length;

  $: totalMoney = user.beerHistory.reduce((p, c) => p + c.total, 0);
  $: totalOrderCount = user.beerHistory.length;
  $: totalBeerCount = user.beerHistory.reduce((p, c) => p + c.amount, 0);
  $: totalBeerPrice = user.beerHistory.reduce((p, c) => p + c.price, 0);

  $: averageOrderCost =
    totalBeerPrice > 0 ? Math.round(totalMoney / totalOrderCount) : 0;
  // Number.EPSILON is used to correct for floating point math errors
  $: averageBeerPrice =
    totalBeerPrice > 0
      ? Math.round(
          ((totalBeerPrice + Number.EPSILON) / totalOrderCount) * 100
        ) / 100
      : 0;
</script>

<div class="hidden {params.class}">{currentRoute}</div>

<div class="flex flex-col flex-grow overflow-auto text-center py-2">
  <div
    class="flex flex-row bg-gradient-to-b from-green-800 to-green-600 text-white text-sm sm:text-lg lg:text-2xl items-center w-full justify-between px-4 py-2"
  >
    <Fa icon={faUserAlt} />
    {user.displayName}
  </div>
  <div class="flex flex-col space-y-3 py-3 text-sm sm:text-lg lg:text-2xl">
    <div class={owsMoney > 0 ? "text-lg font-bold" : ""}>
      Du skylder {owsMoney} kroner for {owsCount} øl
    </div>
    <div>
      Du har i alt brugt {totalMoney} kroner på {totalOrderCount} ordre{totalOrderCount >
      0
        ? "r"
        : ""}
    </div>
    <div>Gennemsnitsordre {averageOrderCost} Kr.</div>
    <div>
      Gennemsnitspris: {averageBeerPrice} kr.
    </div>
    <div />
  </div>
</div>
