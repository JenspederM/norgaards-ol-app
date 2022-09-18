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

const provider = new GoogleAuthProvider();

export type UserData = {
  uid: string;
  email: string;
  displayName: string;
  bajere: number;
  isAdmin: boolean;
};

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
        <button
          className="bg-blue-500 text-sm font-medium text-white p-2 rounded"
          onClick={() => authWithGoogle()}
        >
          Log me in, I want øl
        </button>
      </div>
    </div>
  );
};
