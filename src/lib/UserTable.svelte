<script>
  import { onSnapshot, query, collection, doc } from "firebase/firestore";
  import { userStore } from "../stores";
  import { db } from "../Firebase";
  import { onDestroy } from "svelte";

  let headers = [
    {
      key: "email",
      value: "Email",
    },
    {
      key: "displayName",
      value: "Name",
    },
    {
      key: "owes",
      value: "Skylder",
    },
    {
      key: "total",
      value: "Total",
    },
  ];

  let rows = [];

  let unsubscribe;
  userStore.subscribe((v) => {
    if (v !== null && v !== undefined) {
      const totals = v.beerHistory.map((b) => b.total);
      const owes = v.beerHistory.map((b) => (!b.isPayed ? b.total : 0));

      const add = (total, num) => {
        return total + num;
      };

      const sumOwes = owes.reduce(add, 0);
      const sumTotals = totals.reduce(add, 0);
      rows.push({
        email: v.email,
        displayName: v.displayName,
        owes: sumOwes,
        total: sumTotals,
      });
    }
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  $: if ($userStore) {
    unsubscribe = onSnapshot(collection(db, "users"), (col) => {
      col.forEach((doc) => {
        const data = doc.data();
        const totals = data.beerHistory.map((b) => b.total);
        const owes = data.beerHistory.map((b) => (!b.isPayed ? b.total : 0));

        const add = (total, num) => {
          return total + num;
        };

        const sumOwes = owes.reduce(add, 0);
        const sumTotals = totals.reduce(add, 0);
        rows.push({
          email: data.email,
          displayName: data.displayName,
          owes: sumOwes,
          total: sumTotals,
        });
      });
    });
  }
</script>
