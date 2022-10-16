<script lang="ts">
  import { auth, db, User, userConverter } from "../Firebase";
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import Fa from "svelte-fa";
  import { faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
  import { isLoading, userStore } from "../stores";
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

<div
  class="flex flex-col justify-center items-center w-full absolute inset-0 bg-gray-800"
>
  <button
    on:click={loginWithGoogle}
    class="flex items-center py-4 px-6 rounded-2xl space-x-3 bg-gradient-to-t from-green-600 to-green-700 text-white"
  >
    <Fa class="text-2xl xl:text-3xl" icon={faUnlockAlt} />
    <div class="text-4xl xl:text-4xl">Login</div>
  </button>
</div>
