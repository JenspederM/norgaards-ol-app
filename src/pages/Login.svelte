<script lang="ts">
  import { auth, db, User, userConverter } from "../Firebase";
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import Fa from "svelte-fa";
  import { faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
  import { isLoading, userStore } from "../stores";
  import type { UserData } from "../types";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { navigateTo } from "svelte-router-spa";

  auth.onAuthStateChanged(async (loginUser) => {
    if (!loginUser) {
      isLoading.set(false);
      return;
    }

    isLoading.set(true);

    const userDocSnap = await getDoc(
      doc(db, "users", loginUser.uid).withConverter(userConverter)
    );

    if (userDocSnap.exists()) {
      userStore.set(userDocSnap.data());
    } else {
      const newUser = new User({
        uid: loginUser.uid,
        displayName: loginUser.displayName,
        email: loginUser.email,
        beerHistory: [],
        isAdmin: false,
      });
      await setDoc(doc(db, "users", newUser.uid), newUser);
      userStore.set(newUser);
    }

    isLoading.set(false);
    navigateTo("/");
  });

  const loginWithGoogle = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };
</script>

<div
  on:click={loginWithGoogle}
  class="absolute bottom-0 w-full flex flex-row space-x-6 text-4xl justify-center items-end bg-gradient-to-t from-green-600 to-green-700 py-4 text-white"
>
  <Fa icon={faUnlockAlt} />
  <div>Login</div>
</div>
