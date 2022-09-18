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

type UserData = {};

const userAtom = atom<User | null>(null);
export const useUser = () => useAtom(userAtom);

export const AuthenticationProvider = (props: PropsWithChildren<{}>) => {
  const [user, setUser] = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      setUser(user);

      const userDocSnap = await getDoc(doc(db, "users", user.uid));
      if (!userDocSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          bajere: 0,
          isAdmin: false,
        });
      }
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
      <div className="p-4 rounded border bg-white space-y-4 ">
        <div className="text-lg">Login</div>

        <div>
          <button
            className="bg-blue-500 text-sm font-medium text-white p-2 rounded"
            onClick={() => authWithGoogle()}
          >
            Log me in, I want øl
          </button>
        </div>
      </div>
    </div>
  );
};
