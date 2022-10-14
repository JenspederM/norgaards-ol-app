<script lang="ts">
  import { Router } from "svelte-router-spa";
  import { userStore } from "./stores";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Admin from "./pages/Admin.svelte";
  import Profile from "./pages/Profile.svelte";
  import Inventory from "./pages/Inventory.svelte";
  import Unauthorized from "./lib/403.svelte";
  import Layout from "./layouts/Layout.svelte";

  let user;

  userStore.subscribe((v) => {
    user = v;
  });

  function userExists(): boolean {
    //check if user is admin and returns true or false
    return user !== null && user !== undefined;
  }
  function userIsAdmin(): boolean {
    //check if user is admin and returns true or false
    if (userExists()) {
      return user.isAdmin;
    }
    // if user is not logged in, return false
    return false;
  }

  const routes = [
    {
      name: "/",
      component: Home,
      layout: Layout,
      onlyIf: {
        guard: () => userExists(),
        redirect: "/login",
      },
    },
    {
      name: "/login",
      component: Login,
      layout: Layout,
      onlyIf: {
        guard: () => !userExists(),
        redirect: "/",
      },
    },
    {
      name: "/403",
      layout: Layout,
      component: Unauthorized,
    },
    {
      name: "/profile",
      component: Profile,
      layout: Layout,
      onlyIf: {
        guard: () => userExists(),
        redirect: "/login",
      },
    },
    {
      name: "/admin",
      onlyIf: {
        guard: () => userIsAdmin(),
        redirect: "/login",
      },
      component: Admin,
      layout: Layout,
    },
    {
      name: "/inventory",
      onlyIf: {
        guard: () => userIsAdmin(),
        redirect: "/login",
      },
      component: Inventory,
      layout: Layout,
    },
  ];
</script>

<Router {routes} />
