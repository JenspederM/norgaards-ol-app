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
      await setDoc(
        doc(db, "users", newUser.uid).withConverter(userConverter),
        newUser
      );
      userStore.set(newUser);
    }

    isLoading.set(false);
    navigateTo("/");
  });

  const loginWithGoogle = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };
</script>

<button
  on:click={loginWithGoogle}
  class="flex items-center py-2 px-6 rounded-2xl space-x-6 text-4xl xl:text-6xl bg-gradient-to-t from-green-600 to-green-700 text-white"
>
  <Fa icon={faUnlockAlt} />
  <div>Login</div>
</button>
