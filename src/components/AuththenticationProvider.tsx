import { PropsWithChildren, useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { app, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { atom, useAtom } from "jotai";
import { UserData } from "../types";
import Logo from "../assets/Logo.svg";
import LoginButton from "../assets/LoginButton.svg";

const provider = new GoogleAuthProvider();

const userAtom = atom<{ fbUser: User; userData: UserData } | null>(null);
export const useUser = () => useAtom(userAtom);

export const AuthenticationProvider = (props: PropsWithChildren<{}>) => {
  const [user, setUser] = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const userDocSnap = await getDoc(doc(db, "users", user.uid));
      let userData: UserData;
      if (userDocSnap.exists()) {
        userData = userDocSnap.data() as UserData;
      } else {
        userData = {
          uid: user.uid,
          email: user.email ?? "",
          displayName: user.displayName ?? "",
          bajere: 0,
          isAdmin: false,
        };
        await setDoc(doc(db, "users", user.uid), userData);
      }

      setUser({ fbUser: user, userData });
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      {loading ? <div>Loading...</div> : user ? props.children : <Login />}
    </div>
  );
};

export const Login = () => {
  const authWithGoogle = () => {
    const auth = getAuth(app);
    signInWithPopup(auth, provider);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div>
        <img src={Logo} alt="app-logo" className="flex w-1/5 mx-auto" />
        <button
          onClick={() => authWithGoogle()}
          className="flex w-1/5 mx-auto mt-10"
        >
          <img src={LoginButton} alt="app-logo" className="flex" />
        </button>
      </div>
    </div>
  );
};
